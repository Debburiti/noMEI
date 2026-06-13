"""
Regras de conformidade LGPD.
"""

SENSITIVE_FIELDS = {
    "cpf",
    "telefone",
    "email",
    "senha",
}


def remove_sensitive_fields(
    document: dict
) -> dict:
    """
    Remove campos considerados sensíveis.
    """

    return {
        key: value
        for key, value in document.items()
        if key.lower() not in SENSITIVE_FIELDS
    }


def validate_document(
    document: dict
) -> bool:
    """
    Validação básica de conformidade LGPD.
    """

    for field in SENSITIVE_FIELDS:
        if field in document:
            return False

    return True