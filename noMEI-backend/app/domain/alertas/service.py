from datetime import UTC, datetime, timedelta

from app.domain.alertas.repository import AlertaRepository
from app.domain.contratacoes.repository import ContratacaoRepository
from app.domain.perfil.repository import PerfilRepository


class AlertaService:
    def __init__(self):
        self.repository = AlertaRepository()
        self.perfil_repo = PerfilRepository()
        self.contratacao_repo = ContratacaoRepository()

    async def listar(self, user_id: str) -> dict:
        items = await self.repository.list_by_user(user_id)
        for item in items:
            item["id"] = item.pop("_id")
        return {"total": len(items), "items": items}

    async def marcar_como_lido(self, alerta_id: str, user_id: str) -> bool:
        return await self.repository.mark_as_read(alerta_id, user_id)

    async def marcar_todos_como_lidos(self, user_id: str) -> int:
        return await self.repository.mark_all_as_read(user_id)

    async def gerar(self, user_id: str) -> dict:
        perfil = await self.perfil_repo.get_by_user_id(user_id)
        if not perfil or not perfil.get("notificacoes", True):
            return {"criados": 0, "message": "Nenhum alerta gerado"}

        cnae = perfil.get("cnae")
        uf = perfil.get("uf")
        palavras_chave = perfil.get("palavras_chave") or []

        now = datetime.now(UTC)

        contratacoes, _ = await self.contratacao_repo.find_all(
            limit=50,
            uf=uf or None,
            cnae=cnae or None,
            data_min=now,
        )
        deadline_cutoff = now + timedelta(hours=72)
        criados = 0

        for c in contratacoes:
            numero = c.get("numeroControlePNCP")
            if not numero:
                continue

            titulo = c.get("objetoCompra") or "Licitação sem título"
            orgao = (c.get("orgaoEntidade") or {}).get("razaoSocial") or "Órgão não informado"

            encerramento = c.get("dataEncerramentoProposta")
            if isinstance(encerramento, str):
                try:
                    encerramento = datetime.fromisoformat(encerramento.replace("Z", "+00:00"))
                except ValueError:
                    encerramento = None

            if encerramento and encerramento.tzinfo is None:
                encerramento = encerramento.replace(tzinfo=UTC)

            # deadline alert: encerramento within 72h
            if encerramento and now < encerramento <= deadline_cutoff:
                if not await self.repository.exists(user_id, "deadline", numero):
                    horas = int((encerramento - now).total_seconds() / 3600)
                    await self.repository.create({
                        "user_id": user_id,
                        "type": "deadline",
                        "title": "Prazo se encerrando",
                        "message": f'"{titulo[:60]}" encerra em {horas}h. Órgão: {orgao}.',
                        "date": now,
                        "read": False,
                        "contratacao_id": numero,
                    })
                    criados += 1

            # new_bid alert: keyword match or first time seeing this contract
            is_keyword_match = any(
                kw.lower() in titulo.lower() for kw in palavras_chave
            ) if palavras_chave else True

            if is_keyword_match:
                if not await self.repository.exists(user_id, "new_bid", numero):
                    await self.repository.create({
                        "user_id": user_id,
                        "type": "new_bid",
                        "title": "Nova licitação disponível",
                        "message": f'"{titulo[:60]}" — {orgao}.',
                        "date": now,
                        "read": False,
                        "contratacao_id": numero,
                    })
                    criados += 1

        msg = f"{criados} alerta(s) gerado(s)" if criados else "Nenhum alerta novo"
        return {"criados": criados, "message": msg}
