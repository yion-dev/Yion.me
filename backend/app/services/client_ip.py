"""Resolve addresses only from Nginx, never from arbitrary forwarded headers."""
import os
from ipaddress import ip_address, ip_network


def resolve_client_ip(peer: str | None, real_ip: str | None, trusted_cidrs: str) -> str | None:
    if "%" in (peer or "") or "%" in (real_ip or ""):
        return None
    try:
        address = ip_address(peer or "")
    except ValueError:
        return None
    networks = [ip_network(value.strip()) for value in trusted_cidrs.split(",") if value.strip()]
    if any(address in network for network in networks):
        try:
            address = ip_address(real_ip or "")
        except ValueError:
            return None  # Never save the proxy's address as a visitor.
    if getattr(address, "ipv4_mapped", None):
        address = address.ipv4_mapped
    return str(address) if address.is_global and not address.is_multicast else None


def request_client_ip(request) -> str | None:
    return resolve_client_ip(
        request.client.host if request.client else None,
        request.headers.get("x-real-ip"),
        os.getenv("TRUSTED_PROXY_CIDRS", ""),
    )
