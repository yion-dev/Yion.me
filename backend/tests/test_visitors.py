"""Run against a disposable database named portfolio_visitor_test (see docs)."""
import os
import unittest
from concurrent.futures import ThreadPoolExecutor

from app.services.client_ip import resolve_client_ip
from app.services.country import lookup_country


class CountryLookupTests(unittest.TestCase):
    def test_public_ipv4_ipv6_and_local_addresses(self):
        self.assertEqual(lookup_country("8.8.8.8"), "US")
        self.assertEqual(lookup_country("1.1.1.1"), "AU")
        self.assertEqual(lookup_country("2606:4700:4700::1111"), "CA")
        self.assertIsNone(lookup_country("127.0.0.1"))
        self.assertIsNone(lookup_country("not-an-ip"))


class ClientIPTests(unittest.TestCase):
    def test_direct_client_cannot_spoof_forwarded_ip(self):
        self.assertEqual(resolve_client_ip("8.8.8.8", "1.1.1.1", "172.30.50.2/32"), "8.8.8.8")

    def test_trusted_nginx_ipv4_and_ipv6(self):
        for address in ["8.8.8.8", "2606:4700:4700::1111"]:
            self.assertEqual(resolve_client_ip("172.30.50.2", address, "172.30.50.2/32"), address)

    def test_other_container_cannot_forward_an_ip(self):
        self.assertIsNone(resolve_client_ip("172.30.50.3", "8.8.8.8", "172.30.50.2/32"))

    def test_no_trusted_proxy_by_default(self):
        self.assertIsNone(resolve_client_ip("172.30.50.2", "8.8.8.8", ""))

    def test_missing_malformed_or_nonpublic_addresses_are_not_recorded(self):
        for address in [None, "", "unknown", "8.8.8.8, 1.1.1.1", "8.8.8.8:123", "10.0.0.1", "127.0.0.1", "::1", "fe80::1", "224.0.0.1", "2606:4700::1111%eth0"]:
            with self.subTest(address=address):
                self.assertIsNone(resolve_client_ip("172.30.50.2", address, "172.30.50.2/32"))

    def test_ipv4_mapped_ipv6_is_normalized(self):
        self.assertEqual(resolve_client_ip("172.30.50.2", "::ffff:8.8.8.8", "172.30.50.2/32"), "8.8.8.8")


@unittest.skipUnless(os.getenv("VISITOR_TEST_DATABASE_URL"), "Set VISITOR_TEST_DATABASE_URL to run PostgreSQL/API tests")
class VisitorIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from sqlalchemy.engine import make_url
        url = os.environ["VISITOR_TEST_DATABASE_URL"]
        if make_url(url).database != "portfolio_visitor_test":
            raise RuntimeError("Refusing to test against a non-test database")
        os.environ.update(DATABASE_URL=url, JWT_KEY="isolated-test-key", ADMIN_USERNAME="test-admin", ADMIN_PASSWORD="test-password", ALLOWED_USER="test-github", TRUSTED_PROXY_CIDRS="172.30.50.2/32")
        from app.main import app
        from app.database import SessionLocal
        from app.models.visitor import Visitor
        from fastapi.testclient import TestClient
        cls.app = app
        cls.Session = staticmethod(SessionLocal)
        cls.Visitor = Visitor
        cls.client = TestClient(app, base_url="https://testserver", client=("172.30.50.2", 4567))

    def setUp(self):
        with self.Session() as db:
            db.query(self.Visitor).delete()
            db.commit()
        self.client.cookies.clear()

    def track(self, path="/", ip="8.8.8.8"):
        return self.client.post("/visitors/track", json={"path": path}, headers={"X-Real-IP": ip, "CF-Connecting-IP": "1.1.1.1", "X-Forwarded-For": "1.1.1.1"})

    def test_browser_visits_deduplicate_and_store_page_paths(self):
        for path in ["/", "/", "/projects/chipx", "/about"]:
            self.assertEqual(self.track(path).status_code, 204)
        with self.Session() as db:
            rows = db.query(self.Visitor).all()
            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0].visitor_ip_address, "8.8.8.8")
            self.assertEqual(rows[0].visitor_country_code, "US")
            self.assertEqual(rows[0].visitor_visited_pages, ["/", "/projects/chipx", "/about"])

    def test_api_reads_and_private_addresses_do_not_create_visitors(self):
        for path in ["/visitors/get-all/count", "/visitors/countries", "/projects/get-all", "/blogs/get-all"]:
            self.assertIn(self.client.get(path).status_code, (200, 404))
        self.track(ip="172.30.50.2")
        self.assertEqual(self.client.get("/visitors/get-all/count").json(), 0)

    def test_public_country_counts_deduplicate_and_hide_addresses(self):
        self.assertEqual(self.track(ip="8.8.8.8").status_code, 204)
        self.assertEqual(self.track(ip="1.1.1.1").status_code, 204)
        with self.Session() as db:
            db.add(self.Visitor(visitor_ip_address="8.8.8.8", visitor_country_code="US", visitor_visited_pages=["/about"]))
            db.add(self.Visitor(visitor_ip_address="127.0.0.1", visitor_country_code=None, visitor_visited_pages=["/"]))
            db.commit()
        response = self.client.get("/visitors/countries")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [{"country_code": "AU", "visitors": 1}, {"country_code": "US", "visitors": 1}])
        self.assertNotIn("8.8.8.8", response.text)
        self.assertNotIn("127.0.0.1", response.text)

    def test_payload_cannot_supply_ip_or_sensitive_path(self):
        for path in ["/internal/manage/dashboard", "/authentication", "/?token=secret", "//evil.test", "/projects/../../internal"]:
            self.assertEqual(self.track(path).status_code, 422)
        self.assertEqual(self.client.post("/visitors/track", json={"path":"/", "visitor_ip_address":"1.1.1.1"}).status_code, 422)

    def test_visitor_data_requires_real_admin_token(self):
        from app.services.jwt import create_token
        self.assertEqual(self.client.get("/visitors/get-all/data").status_code, 401)
        self.client.cookies.set("session_token", "forged")
        self.assertEqual(self.client.get("/visitors/get-all/data").status_code, 401)
        self.client.cookies.set("session_token", create_token("outsider"))
        self.assertEqual(self.client.get("/visitors/get-all/data").status_code, 401)
        for user in ["test-admin", "test-github"]:
            self.client.cookies.set("session_token", create_token(user))
            response = self.client.get("/visitors/get-all/data")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.headers["cache-control"], "no-store")

    def test_invalid_credentials_do_not_issue_cookie(self):
        for username, password in [("test-admin", "wrong"), ("wrong", "test-password"), ("wrong", "wrong")]:
            response = self.client.post("/oauth/login", json={"username":username,"password":password})
            self.assertEqual(response.status_code, 401)
            self.assertNotIn("set-cookie", response.headers)
        response = self.client.post("/oauth/login", json={"username":"test-admin","password":"test-password"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("session_token=", response.headers["set-cookie"])

    def test_protected_routes_and_cors_preflight(self):
        for method, path in [("get","/visitors/get-all/data"),("post","/projects/create"),("post","/blogs/create"),("delete","/blogs/delete/1")]:
            self.assertEqual(getattr(self.client, method)(path).status_code, 401)
        response = self.client.options("/visitors/get-all/data", headers={"Origin":"https://www.yiondev.me", "Access-Control-Request-Method":"GET"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["access-control-allow-credentials"], "true")

    def test_concurrent_first_visits_do_not_duplicate_or_lose_paths(self):
        from app.services.visitor import record_visit
        def save(path):
            with self.Session() as db:
                record_visit("8.8.4.4", path, db)
        paths=["/", "/about", "/projects", "/blogs", "/projects/chipx"]
        with ThreadPoolExecutor(max_workers=5) as pool:
            list(pool.map(save, paths))
        with self.Session() as db:
            rows=db.query(self.Visitor).all()
            self.assertEqual(len(rows),1)
            self.assertEqual(set(rows[0].visitor_visited_pages),set(paths))


if __name__ == "__main__":
    unittest.main()
