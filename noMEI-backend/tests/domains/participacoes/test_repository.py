import pytest
from unittest.mock import AsyncMock, MagicMock, patch, PropertyMock
from app.domain.participacoes.repository import ParticipacaoRepository

@pytest.mark.asyncio
@patch("app.domain.participacoes.repository.ParticipacaoRepository.collection", new_callable=PropertyMock)
async def test_get_dashboard_resumo_isolamento_por_cnpj(mock_collection_property):
    mock_to_list = AsyncMock(return_value=[{"total_participacoes": [{"total": 1}], "resumo_status": []}])
    
    mock_cursor = MagicMock()
    mock_cursor.to_list = mock_to_list
    
    mock_collection = MagicMock()
    mock_collection.aggregate.return_value = mock_cursor
    
    mock_collection_property.return_value = mock_collection

    repo = ParticipacaoRepository()
    
    resultado = await repo.get_dashboard_resumo(cnpj="12345678000199")
    
    assert resultado is not None
    mock_collection.aggregate.assert_called_once()
    
    args, kwargs = mock_collection.aggregate.call_args
    pipeline_chamado = args[0]
    
    assert pipeline_chamado[0]["$match"]["cnpj"] == "12345678000199"