from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

BidStatus = Literal["open", "analysis", "sent", "winner", "closed"]

_SITUACAO_TO_STATUS: dict[int, BidStatus] = {
    1: "open",
    2: "analysis",
    3: "sent",
    4: "winner",
    5: "closed",
}


class ContratacaoResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: str = Field(alias="numeroControlePNCP")
    title: str | None = Field(None, alias="objetoCompra")
    value: float | None = Field(None, alias="valorTotalEstimado")
    category: str | None = Field(None, alias="modalidadeNome")
    description: str | None = Field(None, alias="informacaoComplementar")
    agency: str | None = None
    status: BidStatus = "open"
    deadline: str | None = None
    compatibility: int = 0

    @model_validator(mode="before")
    @classmethod
    def _map_fields(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        orgao = data.get("orgaoEntidade") or {}
        data["agency"] = orgao.get("razaoSocial")

        situacao = data.get("situacaoCompraId")
        data["status"] = _SITUACAO_TO_STATUS.get(situacao, "open")

        encerramento = data.get("dataEncerramentoProposta")
        if isinstance(encerramento, datetime):
            data["deadline"] = encerramento.strftime("%d/%m")
        elif isinstance(encerramento, str):
            data["deadline"] = encerramento[:5]

        data["compatibility"] = 100 if data.get("_mei_compativel") else 0

        return data


class ContratacaoListResponse(BaseModel):
    total: int
    page: int
    pages: int
    items: list[ContratacaoResponse]
