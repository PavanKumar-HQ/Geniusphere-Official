// ====================================================================
// Geniusphere 2.0 — Real-Time Live Gradebook & Assessment Sync Engine
// Instant grade updates, submission ingestion, section score recalculation
// ====================================================================

import { realtimeBus } from '../RealtimeBus';
import { notificationEngine } from './NotificationEngine';

export interface GradeUpdateEvent {
  submission_id: string;
  assignment_id: string;
  classroom_id: string;
  student_id: string;
  student_name: string;
  score: number;
  max_score: number;
  passed: boolean;
  teacher_feedback?: string;
  graded_by: string;
  timestamp: string;
}

export interface SubmissionReceivedEvent {
  submission_id: string;
  assignment_id: string;
  classroom_id: string;
  student_id: string;
  student_name: string;
  lab_title?: string;
  attempt_number: number;
  score: number;
  timestamp: string;
}

export class LiveGradebookEngine {
  constructor() {
    this.initRealtimeListeners();
  }

  private initRealtimeListeners(): void {
    // Listen for gradebook updates
    realtimeBus.subscribe('gradebook:*', (envelope) => {
      if (envelope.event === 'GRADE_POSTED' && envelope.payload) {
        const payload = envelope.payload as GradeUpdateEvent;
        // Dispatch student notification
        notificationEngine.dispatch(
          payload.student_id,
          'Grade Published',
          `Your submission received ${payload.score}/${payload.max_score} points.${payload.teacher_feedback ? ` Feedback: "${payload.teacher_feedback}"` : ''}`,
          'high',
          'grade',
          'student-dashboard'
        );
      } else if (envelope.event === 'SUBMISSION_RECEIVED' && envelope.payload) {
        const payload = envelope.payload as SubmissionReceivedEvent;
        // Broadcast notification to teachers of this classroom
        notificationEngine.dispatch(
          'teacher-1', // Default instructor
          'New Student Submission',
          `${payload.student_name} submitted work for ${payload.lab_title || 'assignment'}. Score: ${payload.score}/100.`,
          'medium',
          'assignment',
          'gradebook'
        );
      }
    });
  }

  /**
   * Broadcasts that a student submitted work
   */
  public emitSubmissionReceived(
    classroomId: string,
    assignmentId: string,
    submissionId: string,
    studentId: string,
    studentName: string,
    labTitle: string,
    score: number,
    attemptNumber: number
  ): void {
    const payload: SubmissionReceivedEvent = {
      submission_id: submissionId,
      assignment_id: assignmentId,
      classroom_id: classroomId,
      student_id: studentId,
      student_name: studentName,
      lab_title: labTitle,
      attempt_number: attemptNumber,
      score,
      timestamp: new Date().toISOString(),
    };

    realtimeBus.publish(
      `gradebook:${classroomId}`,
      'SUBMISSION_RECEIVED',
      payload,
      studentId,
      'learner',
      studentName
    );
  }

  /**
   * Broadcasts that a teacher graded a submission
   */
  public emitGradePosted(
    classroomId: string,
    assignmentId: string,
    submissionId: string,
    studentId: string,
    studentName: string,
    score: number,
    maxScore: number,
    passed: boolean,
    feedback: string | undefined,
    teacherId: string,
    teacherName: string
  ): void {
    const payload: GradeUpdateEvent = {
      submission_id: submissionId,
      assignment_id: assignmentId,
      classroom_id: classroomId,
      student_id: studentId,
      student_name: studentName,
      score,
      max_score: maxScore,
      passed,
      teacher_feedback: feedback,
      graded_by: teacherId,
      timestamp: new Date().toISOString(),
    };

    realtimeBus.publish(
      `gradebook:${classroomId}`,
      'GRADE_POSTED',
      payload,
      teacherId,
      'teacher',
      teacherName
    );
  }
}

export const liveGradebookEngine = new LiveGradebookEngine();
