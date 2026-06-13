"""
Auditoria
Rastreabilidade
Compliance
"""

import json
from datetime import datetime, timezone
from pathlib import Path

AUDIT_FILE = (
    Path("logs")
    / "audit_log.jsonl"
)


def log_event(
    event_type: str,
    details: dict
):
    """
    Registra evento de auditoria.
    """

    AUDIT_FILE.parent.mkdir(
        exist_ok=True
    )

    payload = {
        "timestamp": (
            datetime.now(
                tz=timezone.utc
            ).isoformat()
        ),
        "event": event_type,
        "details": details,
    }

    with open(
        AUDIT_FILE,
        "a",
        encoding="utf-8"
    ) as file:

        file.write(
            json.dumps(
                payload,
                ensure_ascii=False,
                default=str
            )
            + "\n"
        )