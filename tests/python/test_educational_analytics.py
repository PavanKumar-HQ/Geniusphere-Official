"""
Unit tests for Geniusphere Educational Analytics (tools.polyglot.educational_analytics)
"""

import unittest
from tools.polyglot.educational_analytics import (
    EducationalAnalyticsEngine,
    ItemAnalysisResult,
    MasteryCurveFit,
    DropoffInflectionPoint,
)


class TestEducationalAnalytics(unittest.TestCase):
    def test_item_analysis_insufficient_sample(self):
        # Sample with only 2 students
        scores = [(80.0, True), (50.0, False)]
        res = EducationalAnalyticsEngine.calculate_item_analysis("quiz-item-1", scores)
        self.assertEqual(res.total_attempts, 2)
        self.assertEqual(res.difficulty_index, 0.5)
        self.assertEqual(res.discrimination_index, 0.0)
        self.assertIn("Insufficient Sample", res.classification)
        self.assertFalse(res.flagged_for_review)

    def test_item_analysis_optimal_item(self):
        # 10 students: upper group gets it right, lower group gets it wrong
        scores = [
            (95.0, True),
            (90.0, True),
            (85.0, True),
            (75.0, True),
            (70.0, False),
            (65.0, True),
            (55.0, False),
            (50.0, False),
            (40.0, False),
            (30.0, False),
        ]
        res = EducationalAnalyticsEngine.calculate_item_analysis("quiz-item-2", scores)
        self.assertEqual(res.total_attempts, 10)
        self.assertEqual(res.difficulty_index, 0.5)
        # Upper 27% (top 3): all 3 correct. Lower 27% (bottom 3): 0 correct. D = (3 - 0) / 3 = 1.0
        self.assertEqual(res.discrimination_index, 1.0)
        self.assertEqual(res.classification, "Optimal Psychometric Quality")
        self.assertFalse(res.flagged_for_review)

    def test_item_analysis_too_difficult(self):
        # Only 1 student out of 10 gets it right
        scores = [(i * 10, i == 9) for i in range(10)]
        res = EducationalAnalyticsEngine.calculate_item_analysis("quiz-hard-1", scores)
        self.assertEqual(res.difficulty_index, 0.1)
        self.assertTrue(res.flagged_for_review)
        self.assertIn("Too Difficult", res.classification)

    def test_mastery_curve_fitting(self):
        # Progressive learning scores over 5 sessions: 0.20, 0.45, 0.65, 0.80, 0.88
        session_scores = [0.20, 0.45, 0.65, 0.80, 0.88]
        fit = EducationalAnalyticsEngine.fit_mastery_curve(session_scores)
        self.assertGreater(fit.learning_rate_k, 0.0)
        self.assertGreaterEqual(fit.r_squared, 0.70)
        self.assertGreaterEqual(fit.current_estimated_mastery, 0.80)
        self.assertLessEqual(fit.projected_sessions_to_mastery, 15)

    def test_mastery_curve_empty_input(self):
        fit = EducationalAnalyticsEngine.fit_mastery_curve([])
        self.assertEqual(fit.current_estimated_mastery, 0.0)
        self.assertEqual(fit.r_squared, 0.0)

    def test_curriculum_bottleneck_detection(self):
        # Lessons 1 to 4:
        # Lesson 1: 100 students
        # Lesson 2: 95 students (dropoff 5%)
        # Lesson 3: 60 students (dropoff 36.8% -> BOTTLENECK)
        # Lesson 4: 55 students (dropoff 8.3%)
        progression = [
            ("lesson-1", 1, 100),
            ("lesson-2", 2, 95),
            ("lesson-3", 3, 60),
            ("lesson-4", 4, 55),
        ]
        bottlenecks = EducationalAnalyticsEngine.identify_curriculum_bottlenecks(progression)
        self.assertEqual(len(bottlenecks), 3)

        # Lesson 2 to 3 transition is a bottleneck
        l2_transition = bottlenecks[1]
        self.assertEqual(l2_transition.lesson_id, "lesson-2")
        self.assertTrue(l2_transition.is_bottleneck)
        self.assertGreater(l2_transition.dropoff_rate, 0.30)

        # Lesson 1 to 2 transition is not a bottleneck
        self.assertFalse(bottlenecks[0].is_bottleneck)


if __name__ == "__main__":
    unittest.main()
