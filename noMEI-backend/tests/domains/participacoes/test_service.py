import pytest
from unittest.mock import AsyncMock
from app.domain.participacoes.service import ParticipacaoService
from fastapi import HTTPException

@pytest.mark.asyncio
async def test_calculo_taxa_vitoria_matematicamente_correto():
    """
    Testa se o serviço calcula a taxa isolando os estados de absorção (finalizados).
    """
    mock_dados_repositorio = {
        "total_participacoes": [{"total": 10}],
        "resumo_status": [
            {"status": "winner", "total": 3, "processos_ids": ["id1", "id2", "id3"]},  
            {"status": "closed", "total": 2, "processos_ids": ["id4", "id5"]},  
            {"status": "open", "total": 4, "processos_ids": ["id6", "id7", "id8", "id9"]},    
            {"status": "analysis", "total": 1, "processos_ids": ["id10"]} 
        ]
    }

    mock_user = {"_id": "fake_user_123", "cnpj": "12345678000199"}
    
    servico = ParticipacaoService()
    servico.repository.get_dashboard_resumo = AsyncMock(return_value=mock_dados_repositorio)
    servico.user_repository.get_user_by_id = AsyncMock(return_value=mock_user)

    resultado = await servico.resumo_dashboard(user_id="fake_user_123")

    assert resultado.total_participacoes == 10
    assert resultado.taxa_vitoria == 0.6  
    assert len(resultado.resumo_status) == 4
    
    servico.repository.get_dashboard_resumo.assert_called_once_with(cnpj="12345678000199")

@pytest.mark.asyncio
async def test_prevencao_divisao_por_zero_sem_status_finalizados():
    """
    Testa o caso limite matemático: quando o usuário só tem propostas em andamento
    e o conjunto de estados finalizados (o denominador) é vazio.
    """
    mock_dados_repositorio = {
        "total_participacoes": [{"total": 8}],
        "resumo_status": [
            {"status": "open", "total": 8, "processos_ids": ["id11", "id12", "id13", "id14", "id15", "id16", "id17", "id18"]}
        ]
    }
    mock_user = {"_id": "fake_user_123", "cnpj": "12345678000199"}
    
    servico = ParticipacaoService()
    servico.repository.get_dashboard_resumo = AsyncMock(return_value=mock_dados_repositorio)
    servico.user_repository.get_user_by_id = AsyncMock(return_value=mock_user)

    resultado = await servico.resumo_dashboard(user_id="fake_user_123")

    assert resultado.total_participacoes == 8
    assert resultado.taxa_vitoria == 0.0

@pytest.mark.asyncio
async def test_servico_rejeita_usuario_sem_cnpj():
    """
    Testa a proteção lógica: se o mapeamento f(x) retornar nulo,
    a execução deve ser abortada imediatamente.
    """
    servico = ParticipacaoService()
    
    servico.user_repository.get_user_by_id = AsyncMock(return_value={"_id": "fake_user_123"})
    
    with pytest.raises(HTTPException) as exc_info:
        await servico.resumo_dashboard(user_id="fake_user_123")
        
    assert exc_info.value.status_code == 404
    assert "não possui CNPJ" in exc_info.value.detail