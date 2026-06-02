import pytest
from unittest.mock import AsyncMock, patch

from app.domain.contratacoes.service import ContratacaoService
from app.domain.contratacoes.schemas import ContratacaoResponse

@pytest.mark.asyncio
@patch("app.domain.contratacoes.repository.ContratacaoRepository.find_all")
async def test_listar_contratacoes_paginacao_matematica(mock_find_all):
    mock_find_all.return_value = ([], 25)

    service = ContratacaoService()

    resultado = await service.listar_contratacoes(page=2, uf="PE", limit=10)

    assert resultado["total"] == 25
    assert resultado["page"] == 2
    assert resultado["pages"] == 3
    
    mock_find_all.assert_called_once_with(
        skip=10, 
        limit=10,
        uf="PE",
        modalidade_id=None,
        valor_max=None,
        mei_compativel=None,
        busca=None,
        cnae=None
    )