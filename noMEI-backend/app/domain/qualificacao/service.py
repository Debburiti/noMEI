from typing import Any

from app.core.exceptions import NotFoundError
from app.domain.contratacoes.repository import ContratacaoRepository
from app.domain.perfil.repository import PerfilRepository

_MEI_VALOR_LIMITE = 144_900.0


def _fmt_brl(valor: float) -> str:
    return f"R${valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


class QualificacaoService:
    def __init__(self):
        self.contratacao_repo = ContratacaoRepository()
        self.perfil_repo = PerfilRepository()

    async def verificar_elegibilidade(
        self, cnpj: str, numero_controle_pncp: str
    ) -> dict[str, Any]:
        contratacao = await self.contratacao_repo.find_by_id(numero_controle_pncp)
        if not contratacao:
            raise NotFoundError("Contratação não encontrada")

        perfil = await self.perfil_repo.get_by_cnpj(cnpj)

        itens = [
            self._verificar_valor(contratacao),
            self._verificar_cnae(perfil),
            self._verificar_uf(perfil, contratacao),
        ]

        return {
            "elegivel": all(item["elegivel"] for item in itens),
            "itens": itens,
        }

    def _verificar_valor(self, contratacao: dict[str, Any]) -> dict[str, Any]:
        valor = contratacao.get("valorTotalEstimado")
        if valor is None:
            return {
                "item": "Valor dentro do limite MEI",
                "elegivel": True,
                "detalhe": "Valor estimado não informado pelo órgão.",
            }
        if valor <= _MEI_VALOR_LIMITE:
            return {
                "item": "Valor dentro do limite MEI",
                "elegivel": True,
                "detalhe": f"Valor {_fmt_brl(valor)} está dentro do limite anual do MEI (R$144.900,00).",
            }
        return {
            "item": "Valor dentro do limite MEI",
            "elegivel": False,
            "detalhe": f"Valor {_fmt_brl(valor)} excede o limite anual do MEI (R$144.900,00).",
        }

    def _verificar_cnae(self, perfil: dict[str, Any] | None) -> dict[str, Any]:
        if not perfil or not perfil.get("cnae"):
            return {
                "item": "CNAE cadastrado no perfil",
                "elegivel": False,
                "detalhe": "CNAE não cadastrado. Atualize seu perfil para verificar compatibilidade.",
            }
        return {
            "item": "CNAE cadastrado no perfil",
            "elegivel": True,
            "detalhe": f"CNAE {perfil['cnae']} cadastrado no seu perfil.",
        }

    def _verificar_uf(
        self, perfil: dict[str, Any] | None, contratacao: dict[str, Any]
    ) -> dict[str, Any]:
        unidade = contratacao.get("unidadeOrgao") or {}
        uf_contrato = unidade.get("ufSigla")
        uf_perfil = perfil.get("uf") if perfil else None

        if not uf_contrato:
            return {
                "item": "Compatibilidade regional",
                "elegivel": True,
                "detalhe": "UF do contrato não informada.",
            }
        if not uf_perfil:
            return {
                "item": "Compatibilidade regional",
                "elegivel": True,
                "detalhe": "UF não cadastrada no perfil. Você pode participar de qualquer estado.",
            }
        if uf_perfil.upper() == uf_contrato.upper():
            return {
                "item": "Compatibilidade regional",
                "elegivel": True,
                "detalhe": f"Contrato em {uf_contrato}, compatível com seu perfil.",
            }
        return {
            "item": "Compatibilidade regional",
            "elegivel": False,
            "detalhe": f"Contrato em {uf_contrato}, mas seu perfil está cadastrado em {uf_perfil}.",
        }
