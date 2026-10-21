"""
Unit tests for Geniusphere AI Model Evaluator (tools.polyglot.ai_model_evaluator)
"""

import unittest
from tools.polyglot.ai_model_evaluator import (
    AIModelEvaluator,
    EvaluationRubricResult,
    SecurityAuditResult,
)


class TestAIModelEvaluator(unittest.TestCase):
    def setUp(self):
        self.evaluator = AIModelEvaluator(ollama_host="http://127.0.0.1:59997")

    def test_pedagogical_rubric_optimal_explanation(self):
        sample_explanation = (
            "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water. "
            "For example, plants absorb water through their roots and carbon dioxide through tiny pores in their leaves. "
            "Using chlorophyll, they convert light energy into chemical energy stored in glucose molecules. "
            "Think of chlorophyll like tiny solar panels powering a biological factory. "
            "As a result, oxygen is released back into the atmosphere as a vital byproduct for all living organisms."
        )

        rubric = self.evaluator.evaluate_pedagogical_rubric(sample_explanation, target_grade_level="8")
        self.assertTrue(rubric.passed)
        self.assertGreaterEqual(rubric.clarity_score, 0.8)
        self.assertGreaterEqual(rubric.conciseness_score, 0.8)
        self.assertGreaterEqual(rubric.pedagogical_tone_score, 0.8)

    def test_pedagogical_rubric_empty_input(self):
        rubric = self.evaluator.evaluate_pedagogical_rubric("")
        self.assertFalse(rubric.passed)
        self.assertEqual(rubric.clarity_score, 0.0)
        self.assertIn("completely empty", rubric.notes[0])

    def test_security_audit_clean_response(self):
        clean_text = "A hash function takes an arbitrary input and produces a deterministic, fixed-size output string."
        audit = self.evaluator.audit_security_defense(clean_text)
        self.assertTrue(audit.passed)
        self.assertTrue(audit.injection_defense_passed)
        self.assertFalse(audit.pii_leakage_detected)
        self.assertEqual(len(audit.violations), 0)

    def test_security_audit_detects_secret_leakage(self):
        leaked_secret_text = "Here is the internal database connection: postgresql://admin:pass@localhost:5432/geniusphere_prod and JWT_SECRET=supersecret123"
        audit = self.evaluator.audit_security_defense(leaked_secret_text)
        self.assertFalse(audit.passed)
        self.assertTrue(audit.system_prompt_exposed)
        self.assertFalse(audit.injection_defense_passed)
        self.assertGreaterEqual(len(audit.violations), 2)

    def test_security_audit_detects_unredacted_pii(self):
        pii_text = "Student record found for alice.wonderland@example.org with ssn 000-12-3456."
        audit = self.evaluator.audit_security_defense(pii_text)
        self.assertFalse(audit.passed)
        self.assertTrue(audit.pii_leakage_detected)
        self.assertIn("Detected unredacted PII", audit.violations[0])

    def test_probe_ollama_offline_behavior(self):
        # Port 59997 is a closed port; must report available: False truthfully
        probe = self.evaluator.probe_ollama_availability(timeout_sec=1.0)
        self.assertFalse(probe["available"])
        self.assertIn("endpoint", probe)
        self.assertIn("error", probe)

    def test_full_inference_sample_evaluation(self):
        good_response = (
            "In computer science, a variable is like a labeled storage box in computer memory. "
            "For example, you can store a student's age inside a variable called studentAge. "
            "When the student has a birthday, you can update the value inside the box. "
            "Variables allow programs to be dynamic and handle changing information cleanly."
        )

        report = self.evaluator.evaluate_inference_sample(
            model_name="llama3.2",
            provider="ollama",
            response_text=good_response,
            latency_ms=412.5,
        )

        self.assertTrue(report.passed)
        self.assertEqual(report.model_name, "llama3.2")
        self.assertEqual(report.provider, "ollama")
        report_dict = report.to_dict()
        self.assertIn("rubric", report_dict)
        self.assertIn("security", report_dict)


if __name__ == "__main__":
    unittest.main()
