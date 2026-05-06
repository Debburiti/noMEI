from typing import Literal

from pydantic import BaseModel

AlertaType = Literal["new_bid", "deadline", "status_change", "document"]


class AlertaResponse(BaseModel):
    id: str
    type: AlertaType
    title: str
    message: str
    date: str
    read: bool


class AlertaListResponse(BaseModel):
    total: int
    items: list[AlertaResponse]
