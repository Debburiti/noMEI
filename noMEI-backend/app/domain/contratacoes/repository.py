from typing import Any

from app.core.database import get_database


class ContratacaoRepository:
    @property
    def collection(self):
        return get_database()["contratacoes_proposta"]

    async def find_all(
        self,
        skip: int = 0,
        limit: int = 10,
        uf: str | None = None,
        modalidade_id: int | None = None,
        valor_max: float | None = None,
        mei_compativel: bool | None = None,
        busca: str | None = None,
    ) -> tuple[list[dict[Any, Any]], int]:

        query = {}
        if busca:
            query["objetoCompra"] = {"$regex": busca, "$options": "i"}
        if uf:
            query["unidadeOrgao.ufSigla"] = uf
        if modalidade_id is not None:
            query["modalidadeId"] = modalidade_id
        if valor_max is not None:
            query["valorTotalEstimado"] = {"$lte": valor_max}
        if mei_compativel is not None:
            query["_mei_compativel"] = mei_compativel

        cursor = self.collection.find(query).sort("dataEncerramentoProposta", 1).skip(skip).limit(limit)
        items = await cursor.to_list(length=limit)
        total = await self.collection.count_documents(query)

        return items, total

    async def find_by_id(self, numero_controle_pncp: str) -> dict[Any, Any] | None:
        return await self.collection.find_one({"numeroControlePNCP": numero_controle_pncp})

    async def get_estatisticas(self) -> dict[str, Any]:
        pipeline_uf = [
            {"$group": {"_id": "$unidadeOrgao.ufSigla", "total": {"$sum": 1}}}
        ]

        pipeline_modalidade = [
            {"$group": {"_id": {"id": "$modalidadeId", "nome": "$modalidadeNome"}, "total": {"$sum": 1}}}
        ]

        total_abertas = await self.collection.count_documents({})
        total_mei = await self.collection.count_documents({"_mei_compativel": True})

        dist_uf = await self.collection.aggregate(pipeline_uf).to_list(None)
        dist_modalidade = await self.collection.aggregate(pipeline_modalidade).to_list(None)

        return {
            "totalContratacoesAbertas": total_abertas,
            "totalCompativeisMEI": total_mei,
            "distribuicaoPorUF": [{"uf": d["_id"] or "ND", "total": d["total"]} for d in dist_uf],
            "distribuicaoPorModalidade": [
                {"modalidadeId": d["_id"]["id"], "modalidadeNome": d["_id"]["nome"], "total": d["total"]}
                for d in dist_modalidade if d["_id"].get("id") is not None
            ]
        }
