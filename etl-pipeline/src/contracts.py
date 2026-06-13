"""
Contratos base para os componentes do ETL.

As classes concretas implementam responsabilidades isoladas e podem ser
trocadas em testes ou em futuras integrações sem alterar a orquestração.
"""

from abc import ABC, abstractmethod
from typing import Any, Generator


class BaseExtractor(ABC):
    """Contrato para fontes de extração."""

    @abstractmethod
    def extract(self, **kwargs: Any) -> Generator[dict[str, Any], None, None]:
        """Extrai registros brutos da origem."""


class BaseTransformer(ABC):
    """Contrato para normalização de registros."""

    @abstractmethod
    def transform(self, record: dict[str, Any]) -> dict[str, Any]:
        """Transforma um registro bruto em documento curado."""


class BaseRepository(ABC):
    """Contrato para persistência dos documentos curados."""

    @abstractmethod
    def load_batch(self, documents: list[dict[str, Any]]) -> dict[str, int]:
        """Persiste um lote de documentos."""
