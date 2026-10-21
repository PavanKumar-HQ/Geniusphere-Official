"""
Geniusphere Educational Data Science & Analytics Engine
Computes psychometric item statistics, exponential student mastery curves,
cohort score distributions, and curriculum attrition inflection points.
"""

from dataclasses import dataclass, field
import math
import statistics
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class ItemAnalysisResult:
    item_id: str
    total_attempts: int
    difficulty_index: float  # p-value: ratio of correct answers (0.0 to 1.0)
    discrimination_index: float  # D-index: upper 27% vs lower 27% (-1.0 to 1.0)
    classification: str  # 'Optimal', 'Too Easy', 'Too Hard', 'Poor Discrimination'
    flagged_for_review: bool


@dataclass
class MasteryCurveFit:
    learning_rate_k: float  # k in M(t) = 1 - e^(-k * t)
    projected_sessions_to_mastery: int  # Sessions to reach 90% mastery
    r_squared: float  # Goodness-of-fit
    current_estimated_mastery: float  # 0.0 to 1.0


@dataclass
class DropoffInflectionPoint:
    lesson_id: str
    lesson_order: int
    student_count_start: int
    student_count_end: int
    retention_rate: float
    dropoff_rate: float
    is_bottleneck: bool  # True if dropoff rate > 20%


class EducationalAnalyticsEngine:
    """Psychometric and cohort telemetry analytics engine for Geniusphere educators."""

    @staticmethod
    def calculate_item_analysis(
        item_id: str,
        student_scores: List[Tuple[float, bool]],  # List of (total_student_quiz_score, is_item_correct)
    ) -> ItemAnalysisResult:
        """
        Calculates Difficulty Index (p) and Discrimination Index (D) for a quiz question.
        Uses Kelley's 27% rule for upper and lower criterion groups.
        """
        n = len(student_scores)
        if n < 4:
            # Insufficient sample size for reliable psychometric discrimination
            correct_count = sum(1 for _, correct in student_scores if correct)
            p = correct_count / max(1, n)
            return ItemAnalysisResult(
                item_id=item_id,
                total_attempts=n,
                difficulty_index=round(p, 3),
                discrimination_index=0.0,
                classification="Insufficient Sample Size",
                flagged_for_review=False,
            )

        # 1. Calculate overall difficulty p = correct / total
        correct_count = sum(1 for _, correct in student_scores if correct)
        p = correct_count / n

        # 2. Sort students by overall quiz score to establish upper and lower groups
        sorted_students = sorted(student_scores, key=lambda s: s[0], reverse=True)
        group_size = max(1, int(round(n * 0.27)))

        upper_group = sorted_students[:group_size]
        lower_group = sorted_students[-group_size:]

        upper_correct = sum(1 for _, correct in upper_group if correct)
        lower_correct = sum(1 for _, correct in lower_group if correct)

        # Discrimination Index D = (Upper_correct - Lower_correct) / group_size
        d = (upper_correct - lower_correct) / group_size

        # Classification based on standard psychometric testing benchmarks:
        # Ideal: 0.3 <= p <= 0.8 and D >= 0.3
        flagged = False
        if d < 0.15:
            classification = "Poor Discrimination (Item does not separate high and low performers)"
            flagged = True
        elif p < 0.20:
            classification = "Too Difficult (Less than 20% correct)"
            flagged = True
        elif p > 0.90:
            classification = "Very Easy (Over 90% correct)"
            flagged = False
        else:
            classification = "Optimal Psychometric Quality"
            flagged = False

        return ItemAnalysisResult(
            item_id=item_id,
            total_attempts=n,
            difficulty_index=round(p, 3),
            discrimination_index=round(d, 3),
            classification=classification,
            flagged_for_review=flagged,
        )

    @staticmethod
    def fit_mastery_curve(session_scores: List[float]) -> MasteryCurveFit:
        """
        Fits an exponential learning curve M(t) = 1 - e^(-k * t) to sequential session scores.
        Scores should be normalized in [0.0, 1.0].
        """
        if not session_scores:
            return MasteryCurveFit(
                learning_rate_k=0.1,
                projected_sessions_to_mastery=10,
                r_squared=0.0,
                current_estimated_mastery=0.0,
            )

        # Clamp scores in [0.01, 0.99] to avoid log domain errors
        clamped = [min(0.99, max(0.01, s)) for s in session_scores]
        n = len(clamped)

        # Linearize: ln(1 - M) = -k * t  =>  y = -k * t  (through origin)
        # Sum(t_i * y_i) / Sum(t_i^2)
        sum_ty = 0.0
        sum_t2 = 0.0
        for i, m in enumerate(clamped):
            t = i + 1
            y = math.log(1.0 - m)
            sum_ty += t * y
            sum_t2 += t * t

        k = -sum_ty / max(1e-5, sum_t2)
        k = max(0.01, min(2.0, k))  # Bounded learning rate

        # Calculate R-squared
        y_actual = [math.log(1.0 - m) for m in clamped]
        y_pred = [-k * (i + 1) for i in range(n)]
        y_mean = statistics.mean(y_actual) if n > 1 else y_actual[0]

        ss_tot = sum((y - y_mean) ** 2 for y in y_actual)
        ss_res = sum((y_act - y_p) ** 2 for y_act, y_p in zip(y_actual, y_pred))
        r2 = max(0.0, 1.0 - (ss_res / max(1e-5, ss_tot))) if ss_tot > 0 else 1.0

        # Calculate sessions needed to reach 90% mastery: 1 - e^(-k * t) = 0.90 => t = ln(0.1) / (-k)
        target_t = math.log(0.1) / (-k)
        projected_sessions = max(1, int(math.ceil(target_t)))

        current_mastery = 1.0 - math.exp(-k * n)

        return MasteryCurveFit(
            learning_rate_k=round(k, 4),
            projected_sessions_to_mastery=projected_sessions,
            r_squared=round(r2, 3),
            current_estimated_mastery=round(current_mastery, 3),
        )

    @staticmethod
    def identify_curriculum_bottlenecks(
        lesson_progression_counts: List[Tuple[str, int, int]],  # (lesson_id, lesson_order, active_student_count)
    ) -> List[DropoffInflectionPoint]:
        """
        Analyzes consecutive curriculum lessons to detect attrition inflection points (>20% drop-off).
        """
        results: List[DropoffInflectionPoint] = []
        if len(lesson_progression_counts) < 2:
            return results

        sorted_lessons = sorted(lesson_progression_counts, key=lambda x: x[1])

        for i in range(len(sorted_lessons) - 1):
            curr_id, curr_order, count_start = sorted_lessons[i]
            next_id, _, count_end = sorted_lessons[i + 1]

            if count_start == 0:
                retention = 0.0
                dropoff = 1.0
            else:
                retention = min(1.0, count_end / count_start)
                dropoff = 1.0 - retention

            is_bottleneck = dropoff > 0.20 and count_start >= 5

            results.append(
                DropoffInflectionPoint(
                    lesson_id=curr_id,
                    lesson_order=curr_order,
                    student_count_start=count_start,
                    student_count_end=count_end,
                    retention_rate=round(retention, 3),
                    dropoff_rate=round(dropoff, 3),
                    is_bottleneck=is_bottleneck,
                )
            )

        return results
