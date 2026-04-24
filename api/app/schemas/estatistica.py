
from pydantic import BaseModel


class DistribuicaoUF(BaseModel):
    uf: str
    total: int

class DistribuicaoModalidade(BaseModel):
    modalidadeId: int
    modalidadeNome: str
    total: int

class EstatisticasResponse(BaseModel):
    totalContratacoesAbertas: int
    totalCompativeisMEI: int
    distribuicaoPorUF: list[DistribuicaoUF]
    distribuicaoPorModalidade: list[DistribuicaoModalidade]
