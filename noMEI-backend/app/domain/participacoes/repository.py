from typing import Any, Optional
from app.core.database import get_database


class ParticipacaoRepository:
    @property
    def collection(self):
        return get_database().get_collection("participacoes")

    async def get_dashboard_resumo(self, cnpj: str) -> dict[str, Any]:
        pipeline = [
            {"$match": {"cnpj": cnpj}},
            {
                "$facet": {
                    "resumo_status": [
                        {"$group": 
                            {
                            "_id": "$status_proposta", 
                            "total": {"$sum": 1},
                            "processos_ids": {"$push": {"$toString": "$_id"}}
                            }
                        },
                        {"$project": 
                            {
                             "_id": 0, 
                             "status": "$_id", 
                             "total": "$total",
                             "processos_ids": 1
                            }
                        },
                    ],
                    "total_participacoes": [{"$count": "total"}],
                }
            },
        ]
        cursor = self.collection.aggregate(pipeline)
        result = await cursor.to_list(length=1)
        return result[0] if result else {}

    async def listar_participacoes_por_cnpj(self, cnpj: str, status: Optional[str] = None) -> list[dict[str, Any]]:

        query: dict[str, Any] = {"cnpj": cnpj}

        if status:
            query["status_proposta"] = status

        cursor = self.collection.find(query)
        return await cursor.to_list(length=None) 