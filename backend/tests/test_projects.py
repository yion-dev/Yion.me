"""Project update regression tests; no database connection is opened."""
import os
import unittest
import uuid
from unittest.mock import MagicMock, patch

with patch.dict(os.environ, {"DATABASE_URL": os.getenv("VISITOR_TEST_DATABASE_URL", "sqlite://")}):
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from app.database import get_db
    from app.models.project import Project
    from app.routers.project import router


class ProjectUpdateTests(unittest.TestCase):
    def setUp(self):
        self.project = Project(
            project_id=7, project_name="Original", project_slug=uuid.uuid4(),
            project_thumbnailUrl="https://example.com/demo.webm",
            project_thumbnailImageUrl="https://example.com/old.gif",
            project_pictures=["https://example.com/old.png"],
            project_techstack=["Python"], project_status="published",
        )
        self.db = MagicMock()
        self.db.query.return_value.filter.return_value.first.return_value = self.project
        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_db] = lambda: self.db
        self.client = TestClient(app)

    def test_update_uses_path_id_and_preserves_omitted_fields(self):
        slug = self.project.project_slug
        response = self.client.put("/projects/update/7", json={"project_name": "Edited"})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(response.json()["project_id"], 7)
        self.assertEqual(response.json()["project_name"], "Edited")
        self.assertEqual(self.project.project_slug, slug)
        self.assertEqual(self.project.project_thumbnailUrl, "https://example.com/demo.webm")
        self.assertEqual(self.project.project_techstack, ["Python"])
        self.db.commit.assert_called_once()

    def test_replace_and_clear_media(self):
        response = self.client.put("/projects/update/7", json={
            "project_pictures": ["https://example.com/new.gif"],
            "project_thumbnailImageUrl": "https://example.com/new.gif",
        })
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.project.project_pictures, ["https://example.com/new.gif"])
        response = self.client.put("/projects/update/7", json={
            "project_pictures": [], "project_thumbnailImageUrl": None,
        })
        self.assertEqual(response.status_code, 200, response.text)
        self.assertEqual(self.project.project_pictures, [])
        self.assertIsNone(self.project.project_thumbnailImageUrl)

    def test_missing_project_returns_404(self):
        self.db.query.return_value.filter.return_value.first.return_value = None
        response = self.client.put("/projects/update/99", json={"project_name": "Missing"})
        self.assertEqual(response.status_code, 404)
        self.db.commit.assert_not_called()

    def test_invalid_updates_do_not_reach_the_database(self):
        for field in ["project_name", "project_slug", "project_techstack", "project_status"]:
            with self.subTest(field=field):
                response = self.client.put("/projects/update/7", json={field: None})
                self.assertEqual(response.status_code, 422, response.text)
        self.db.commit.assert_not_called()

    def test_invalid_path_id_is_rejected(self):
        response = self.client.put("/projects/update/not-an-id", json={"project_name": "Edited"})
        self.assertEqual(response.status_code, 422, response.text)
        self.db.commit.assert_not_called()

    def test_failed_save_rolls_back(self):
        self.db.commit.side_effect = RuntimeError("Database unavailable")
        response = self.client.put("/projects/update/7", json={"project_name": "Edited"})
        self.assertEqual(response.status_code, 500)
        self.db.rollback.assert_called_once()
