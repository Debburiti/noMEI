import hashlib
from datetime import UTC, datetime, timedelta
from unittest.mock import AsyncMock, Mock

import pytest

from app.domain.auth.service import AuthService


@pytest.mark.asyncio
async def test_forgot_password_existing_email_saves_token_and_sends_email(monkeypatch):
    service = AuthService()
    service.repository = Mock()
    service.email_service = Mock()

    user = {
        "_id": "user123",
        "email": "user@example.com",
    }

    service.repository.get_by_email = AsyncMock(return_value=user)
    service.repository.save_reset_token = AsyncMock()

    monkeypatch.setattr(
        "app.domain.auth.service.create_password_reset_token",
        lambda user_id: "reset-token-abc"
    )

    result = await service.forgot_password("user@example.com")

    assert result == {
        "message": "Se o email existir, um link de recuperação foi enviado."
    }

    expected_hash = hashlib.sha256("reset-token-abc".encode()).hexdigest()

    service.repository.save_reset_token.assert_awaited_once()
    kwargs = service.repository.save_reset_token.await_args.kwargs
    assert kwargs["user_id"] == "user123"
    assert kwargs["token_hash"] == expected_hash
    assert isinstance(kwargs["expires_at"], datetime)

    service.email_service.send_password_reset_email.assert_called_once()
    email_kwargs = service.email_service.send_password_reset_email.call_args.kwargs
    assert email_kwargs["to_email"] == "user@example.com"
    assert "reset-token-abc" in email_kwargs["reset_link"]


@pytest.mark.asyncio
async def test_forgot_password_non_existing_email_returns_generic_message(monkeypatch):
    service = AuthService()
    service.repository = Mock()
    service.email_service = Mock()

    service.repository.get_by_email = AsyncMock(return_value=None)
    service.repository.save_reset_token = AsyncMock()

    result = await service.forgot_password("ghost@example.com")

    assert result == {
        "message": "Se o email existir, um link de recuperação foi enviado."
    }
    service.repository.save_reset_token.assert_not_called()
    service.email_service.send_password_reset_email.assert_not_called()


@pytest.mark.asyncio
async def test_reset_password_success(monkeypatch):
    service = AuthService()
    service.repository = Mock()

    token = "valid-reset-token"
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    user = {
        "_id": "user123",
        "email": "user@example.com",
        "reset_password_token_hash": token_hash,
        "reset_password_expires_at": datetime.now(UTC) + timedelta(minutes=10),
    }

    service.repository.get_by_id = AsyncMock(return_value=user)
    service.repository.update_password = AsyncMock()

    monkeypatch.setattr(
        "app.domain.auth.service.decode_token",
        lambda value: {"sub": "user123", "type": "password_reset"}
    )
    monkeypatch.setattr(
        "app.domain.auth.service.hash_password",
        lambda password: "hashed-new-password"
    )

    result = await service.reset_password(token, "NovaSenha123")

    assert result == {"message": "Senha redefinida com sucesso"}
    service.repository.update_password.assert_awaited_once_with(
        "user123", "hashed-new-password"
    )


@pytest.mark.asyncio
async def test_reset_password_fails_when_token_type_is_invalid(monkeypatch):
    service = AuthService()
    service.repository = Mock()

    monkeypatch.setattr(
        "app.domain.auth.service.decode_token",
        lambda value: {"sub": "user123", "type": "access"}
    )

    with pytest.raises(ValueError, match="Token inválido ou expirado"):
        await service.reset_password("token", "NovaSenha123")


@pytest.mark.asyncio
async def test_reset_password_fails_when_token_hash_does_not_match(monkeypatch):
    service = AuthService()
    service.repository = Mock()

    user = {
        "_id": "user123",
        "email": "user@example.com",
        "reset_password_token_hash": "different-hash",
        "reset_password_expires_at": datetime.now(UTC) + timedelta(minutes=10),
    }

    service.repository.get_by_id = AsyncMock(return_value=user)

    monkeypatch.setattr(
        "app.domain.auth.service.decode_token",
        lambda value: {"sub": "user123", "type": "password_reset"}
    )

    with pytest.raises(ValueError, match="Token inválido ou expirado"):
        await service.reset_password("valid-reset-token", "NovaSenha123")


@pytest.mark.asyncio
async def test_reset_password_fails_when_token_is_expired(monkeypatch):
    service = AuthService()
    service.repository = Mock()

    token = "expired-reset-token"
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    user = {
        "_id": "user123",
        "email": "user@example.com",
        "reset_password_token_hash": token_hash,
        "reset_password_expires_at": datetime.now(UTC) - timedelta(minutes=1),
    }

    service.repository.get_by_id = AsyncMock(return_value=user)

    monkeypatch.setattr(
        "app.domain.auth.service.decode_token",
        lambda value: {"sub": "user123", "type": "password_reset"}
    )

    with pytest.raises(ValueError, match="Token inválido ou expirado"):
        await service.reset_password(token, "NovaSenha123")