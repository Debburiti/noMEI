"""
Módulo de anonimização e pseudonimização.

Responsável por:
- Hash SHA-256
- Mascaramento de informações
- Pseudonimização de dados sensíveis
"""

import hashlib


def hash_sha256(value: str) -> str:
    """
    Gera hash SHA-256 de um valor.
    """

    if not value:
        return ""

    return hashlib.sha256(
        str(value).encode("utf-8")
    ).hexdigest()


def mask_value(
    value: str,
    visible_start: int = 3,
    visible_end: int = 2
) -> str:
    """
    Mascara parcialmente um valor.

    Exemplo:
    12345678901 -> 123******01
    """

    if not value:
        return ""

    value = str(value)

    if len(value) <= (
        visible_start + visible_end
    ):
        return "*" * len(value)

    return (
        value[:visible_start]
        + "*" * (
            len(value)
            - visible_start
            - visible_end
        )
        + value[-visible_end:]
    )


def pseudonymize_field(
    document: dict,
    field_name: str
) -> dict:
    """
    Cria uma versão hash de um campo sensível.

    Exemplo:
    cnpj -> cnpj_hash
    """

    if field_name in document:

        document[f"{field_name}_hash"] = (
            hash_sha256(
                str(document[field_name])
            )
        )

    return document