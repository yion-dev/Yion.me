# Visitor tracking on the Azure VM

## Request flow

`Browser → [optional Cloudflare] → VM Nginx → FastAPI → PostgreSQL`

The browser posts only a public page path to `/api/visitors/track`. Nginx routes this directly to FastAPI's `/visitors/track`, bypassing Next.js. Server-side data fetches, API count checks, admin pages, authentication pages, and query strings do not create visitor records. Browser JavaScript must be enabled; blockers and bots affect analytics. An IP is a network address, not a unique person: shared Wi-Fi/NAT, VPNs, and changing addresses affect counts.

Nginx overwrites forwarding headers using its resolved client address. FastAPI trusts `X-Real-IP` only from Nginx's exact address on the dedicated `visitor_proxy` Docker network. Uvicorn's own proxy rewriting is disabled so FastAPI can check the actual socket peer. Invalid, local, and private IPs are skipped. IPv4 and IPv6 are supported. Cloudflare's header is trusted only when the connection comes from its published IP ranges.

One record is kept per IP, with distinct public paths and the original first-seen time. Concurrent requests are serialized per IP using PostgreSQL transaction advisory locks. The current visitor timestamp and Today statistic continue to mean first seen, not last active. Existing page paths and timestamps are not rewritten or deleted; old proxy addresses cannot be converted back into visitor addresses without original logs.

The backend resolves each recorded public IP to a country using the bundled [DB-IP Country Lite database](https://db-ip.com/db/download/ip-to-country-lite). Existing rows are backfilled when the backend starts. Country can be unknown when the database has no match; local and private IPs are still skipped. The country database is an October 2026 snapshot. To update it, replace `backend/data/dbip-country-lite-2026-10.mmdb` with a newer Country Lite MMDB file and restart the backend. Set `COUNTRY_DB_PATH` if the file lives elsewhere. DB-IP Lite requires attribution, which appears below the admin visitor list.

## Deploy

Use the production Compose file **on its own**, as before. Merging the development file can expose backend/database ports.

```sh
docker compose -f docker-compose.prod.yml config --quiet
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec nginx nginx -t
```

The backend adds the nullable `visitor_country_code` column automatically on startup. The new `nginx/` directory must be deployed with `nginx.conf`. Compose adds a dedicated bridge using `172.30.50.0/24`, with Nginx at `172.30.50.2` and FastAPI at `172.30.50.3`. If that overlaps an existing Docker/Azure network, set `VISITOR_PROXY_SUBNET`, `NGINX_TRACKING_IP`, and `BACKEND_TRACKING_IP` in the root `.env` to an unused subnet and two different usable addresses within it. Do not broaden `TRUSTED_PROXY_CIDRS` to arbitrary public/private ranges. The API and database should not have public Azure NSG/host-port exposure; public web traffic enters through 80/443.

### Direct DNS to the VM

No further IP-header configuration is needed. Nginx uses the incoming connection address. Client-supplied Cloudflare and forwarding headers cannot override it.

### Cloudflare proxy to the VM

`nginx/cloudflare-real-ip.conf` contains the official IPv4/IPv6 ranges checked on 2026-09-26. Review against https://www.cloudflare.com/ips-v4/ and https://www.cloudflare.com/ips-v6/ when maintaining the server. Keep Pseudo IPv4 disabled or in Add Header mode; Overwrite Headers replaces real IPv6 addresses with synthetic IPv4. Do not cache POST `/api/visitors/track` or `/visitors/track`.

Reference: https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/

### Azure Front Door / Application Gateway / another reverse proxy

This repository does not contain that deployment configuration. Its IP/header trust chain must be configured explicitly in Nginx before deploying behind it. Do not trust every Azure IP or blindly take the first X-Forwarded-For entry. Azure VM hosting alone does not require a special client-IP header. Cloudflare Tunnel also needs a separate trust configuration for the tunnel connector.

Reference: https://nginx.org/en/docs/http/ngx_http_realip_module.html

## Verify after deploying

1. Visit the homepage from a phone on mobile data, then open Projects.
2. Log into `/authentication`, then inspect `/internal/manage/website-visitors`.
3. The new record should use the connection's public IPv4/IPv6, with `/` and `/projects`. A VPN/proxy will expose its exit IP.
4. Refreshing the visitor count or opening the admin should not create records.
5. An unauthenticated request to `/visitors/get-all/data` should return 401.

Visitor data is now protected by real token validation. The login password check was corrected, and frontend admin requests include the session cookie. `ADMIN_USERNAME`/`ADMIN_PASSWORD` configure password login; `ALLOWED_USER` configures GitHub login. Secure cookies require HTTPS and the existing correct `DOMAIN_NAME` setting.

## Local tests

Use a disposable PostgreSQL database named `portfolio_visitor_test`, never your application database. Install `backend/requirements.txt` in a virtual environment, then from `backend/`:

```sh
VISITOR_TEST_DATABASE_URL=postgresql://postgres:TEST_PASSWORD@localhost:55439/portfolio_visitor_test python -m unittest discover -s tests -v
```

Without `VISITOR_TEST_DATABASE_URL`, only pure IP-resolution tests run. Integration tests delete visitor records only in the explicitly named test database. Local browser tracking has a Next.js rewrite fallback, but loopback/private addresses are intentionally not counted.
