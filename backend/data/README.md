# Country database

`dbip-country-lite-2026-10.mmdb` is the October 2026 [DB-IP Country Lite](https://db-ip.com/db/download/ip-to-country-lite) database. It is distributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) and is used with attribution in the visitor admin page.

SHA-1 of the uncompressed MMDB: `e515b63075ad48847f9c4332b724742e8ba15b0e`.

Replace the MMDB with a newer Country Lite release and restart the backend to refresh country lookups. Existing resolved country codes are kept as first-seen metadata; rows with an unknown country are retried at startup.
