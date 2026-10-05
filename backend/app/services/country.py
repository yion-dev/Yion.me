"""Look up a public IP's country using the bundled DB-IP Lite database."""

import os
from functools import lru_cache
from ipaddress import ip_address
from pathlib import Path

import maxminddb


DEFAULT_DATABASE = Path(__file__).resolve().parents[2] / "data" / "dbip-country-lite-2026-10.mmdb"


@lru_cache(maxsize=1)
def country_reader():
    return maxminddb.open_database(os.getenv("COUNTRY_DB_PATH", str(DEFAULT_DATABASE)))


def lookup_country(ip: str) -> str | None:
    try:
        if not ip_address(ip).is_global:
            return None
        result = country_reader().get(ip)
    except ValueError:
        return None
    code = (result or {}).get("country", {}).get("iso_code")
    return code if isinstance(code, str) and len(code) == 2 and code.isalpha() else None
