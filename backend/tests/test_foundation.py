"""
BLACKOUT: RESTORE THE GRID
Phase 3B.1 Foundation Verification Tests (Standard Library)
Sphinx @ MNIT Jaipur

This test suite verifies:
1. Application configuration defaults and URL normalization.
2. Participant model metadata, field declarations, and unique constraints.
3. Absence of forbidden fields (passwords, emails, phone numbers, scores).
4. Alembic initial migration syntax and table definitions.
"""

import ast
import os
import sys
import unittest

# Ensure backend root is on sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

from app.config import get_settings


class TestConfigurationFoundation(unittest.TestCase):
    """Test configuration loading, environment variables, and URL normalization."""

    def test_settings_initialization(self):
        settings = get_settings()
        self.assertIsNotNone(settings.database_url)
        self.assertIsNotNone(settings.environment)
        self.assertEqual(settings.app_name, "Blackout: Restore the Grid API")
        self.assertEqual(settings.api_v1_prefix, "/api/v1")
        self.assertIsInstance(settings.cors_origins, list)
        self.assertTrue(len(settings.cors_origins) >= 1)

    def test_database_url_normalization(self):
        settings = get_settings()
        # Verify sync_database_url handles postgres:// -> postgresql://
        original_url = settings.database_url
        settings.database_url = "postgres://user:pass@ep-test.ap-southeast-1.aws.neon.tech/neondb"
        self.assertTrue(settings.sync_database_url.startswith("postgresql://"))
        settings.database_url = original_url


class TestParticipantModelStructure(unittest.TestCase):
    """Test model file AST to verify field declarations and constraint compliance."""

    def setUp(self):
        model_path = os.path.join(BACKEND_DIR, "app", "models", "participant.py")
        with open(model_path, "r", encoding="utf-8") as f:
            self.model_code = f.read()
        self.tree = ast.parse(self.model_code)

    def test_participant_class_exists(self):
        class_names = [n.name for n in ast.walk(self.tree) if isinstance(n, ast.ClassDef)]
        self.assertIn("Participant", class_names)

    def test_confirmed_fields_present(self):
        """Verify strictly the three confirmed fields + PK and timestamps exist."""
        expected_fields = {
            "id",
            "full_name",
            "college_id",
            "college_name",
            "created_at",
            "updated_at",
        }
        
        # Search annotations or assignments in Participant class
        found_fields = set()
        for node in ast.walk(self.tree):
            if isinstance(node, ast.ClassDef) and node.name == "Participant":
                for item in node.body:
                    if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                        found_fields.add(item.target.id)
                    elif isinstance(item, ast.Assign):
                        for target in item.targets:
                            if isinstance(target, ast.Name):
                                found_fields.add(target.id)

        for field in expected_fields:
            self.assertIn(
                field, 
                found_fields, 
                f"Required field '{field}' not found in Participant model"
            )

    def test_no_forbidden_fields(self):
        """Enforce strict exclusion of unapproved fields (passwords, emails, phone, scores)."""
        forbidden = ["password", "email", "phone", "score", "rank", "attempt", "role", "admin"]
        
        for node in ast.walk(self.tree):
            if isinstance(node, ast.ClassDef) and node.name == "Participant":
                for item in node.body:
                    field_name = None
                    if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                        field_name = item.target.id
                    elif isinstance(item, ast.Assign):
                        for target in item.targets:
                            if isinstance(target, ast.Name):
                                field_name = target.id
                    
                    if field_name:
                        for bad in forbidden:
                            self.assertNotIn(
                                bad, 
                                field_name.lower(), 
                                f"Forbidden field '{field_name}' detected in Participant model"
                            )

    def test_unique_constraint_declaration(self):
        """Verify unique constraint on college_id is declared in model source."""
        self.assertIn("uq_participants_college_id", self.model_code)
        self.assertIn("unique=True", self.model_code)


class TestAlembicMigrationStructure(unittest.TestCase):
    """Test initial Alembic migration file for correctness."""

    def setUp(self):
        migration_path = os.path.join(
            BACKEND_DIR, "alembic", "versions", "0001_create_participants_table.py"
        )
        with open(migration_path, "r", encoding="utf-8") as f:
            self.migration_code = f.read()
        self.tree = ast.parse(self.migration_code)

    def test_migration_functions_defined(self):
        func_names = [n.name for n in ast.walk(self.tree) if isinstance(n, ast.FunctionDef)]
        self.assertIn("upgrade", func_names)
        self.assertIn("downgrade", func_names)

    def test_migration_creates_participants_table(self):
        self.assertIn("op.create_table", self.migration_code)
        self.assertIn("'participants'", self.migration_code)

    def test_migration_enforces_college_id_uniqueness(self):
        self.assertIn("uq_participants_college_id", self.migration_code)
        self.assertIn("idx_participants_college_id", self.migration_code)
        self.assertIn("unique=True", self.migration_code)


if __name__ == "__main__":
    unittest.main()
