// ====================================================================
// Geniusphere — Production API Client & Real-Time Sync Bridge
// Connects React UI to PostgreSQL Fastify Server with WebSocket sync
// ====================================================================

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';
const WS_BASE_URL = (import.meta as any).env?.VITE_WS_BASE_URL || 'ws://localhost:3001/ws';

const TOKEN_KEY = 'geniusphere_auth_token_v2';

export interface ApiUserSession {
  userId: string;
  email: string;
  fullName: string;
  isSuperadmin: boolean;
  orgId?: string;
  role?: string;
}

export class ApiClient {
  private token: string | null = null;
  private ws: WebSocket | null = null;
  private wsListeners: Set<(event: any) => void> = new Set();
  private wsRetryCount = 0;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = window.localStorage.getItem(TOKEN_KEY);
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      return res.json();
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  public async login(email: string, password: string = 'TestPass123!'): Promise<{ token: string; user: ApiUserSession }> {
    const res = await this.request<{ token: string; user: ApiUserSession }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    this.initWebSocket();
    return res;
  }

  public async getMe(): Promise<{ user: ApiUserSession; progress: any; completions: any[] }> {
    return this.request('/api/auth/me');
  }

  public async getProfile(): Promise<{
    personalInfo: {
      id: string;
      email: string;
      fullName: string;
      dateOfBirth: string;
      isMinor: boolean;
      isSuperadmin: boolean;
      accountStatus: string;
      role: string;
      organization: { id: string; name: string; type: string } | null;
      createdAt: string;
      updatedAt: string;
    };
    learningStats: {
      xp: number;
      currentStreak: number;
      streakLastExtendedDate: string | null;
      totalTimeSpentSeconds: number;
      lastActiveAt: string;
      completedLessonsCount: number;
      enrolledCoursesCount: number;
      labAttemptsCount: number;
    };
  }> {
    return this.request('/api/profile');
  }

  public async updateProfile(updates: { fullName: string }): Promise<{ success: boolean; user: any }> {
    return this.request('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async getCourses(): Promise<any[]> {
    return this.request('/api/courses');
  }

  public async enrollInCourse(courseId: string): Promise<any> {
    return this.request(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  public async completeLesson(
    courseId: string,
    lessonId: string,
    payload: number | { score?: number; answers?: Record<string, number>; watchTimeSeconds?: number; activityType?: string } = 100
  ): Promise<any> {
    const body = typeof payload === 'number' ? { score: payload } : payload;
    return this.request(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public async recordPlayback(
    courseId: string,
    lessonId: string,
    watchTimeSeconds: number,
    videoCompleted: boolean = false
  ): Promise<any> {
    return this.request(`/api/courses/${courseId}/lessons/${lessonId}/playback`, {
      method: 'POST',
      body: JSON.stringify({ watchTimeSeconds, videoCompleted }),
    });
  }

  public async getLeaderboard(
    timeframe: 'all_time' | 'weekly' | 'daily' = 'all_time',
    limit: number = 50
  ): Promise<{ timeframe: string; entries: any[]; totalParticipants: number }> {
    return this.request(`/api/leaderboard?timeframe=${timeframe}&limit=${limit}`);
  }

  public async getCertificates(): Promise<any[]> {
    return this.request('/api/certificates');
  }

  public async verifyCertificate(code: string): Promise<any> {
    return this.request(`/api/certificates/verify/${encodeURIComponent(code)}`);
  }

  public async recordLabAttempt(
    labSlug: string,
    score: number = 100,
    status: 'completed' | 'failed' | 'in_progress' = 'completed',
    details: any = {}
  ): Promise<any> {
    return this.request('/api/labs/attempt', {
      method: 'POST',
      body: JSON.stringify({ labSlug, score, status, details }),
    });
  }

  public async getNotifications(): Promise<{ notifications: any[]; unreadCount: number }> {
    return this.request('/api/notifications');
  }

  public async markNotificationRead(notificationId: string): Promise<{ success: boolean }> {
    return this.request(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  public async markAllNotificationsRead(): Promise<{ count: number }> {
    return this.request('/api/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  public async syncPushSubscription(subscription: any): Promise<void> {
    await this.request('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  // --- Marketplace & Institutional Training API Endpoints ---
  public async getTrainingRequests(): Promise<any[]> {
    return this.request('/api/marketplace/requests');
  }

  public async createTrainingRequest(data: {
    title: string;
    domain: string;
    targetGradeRange: string;
    approxCohortSize: number;
    learningObjectives: string;
    preferredFormat: string;
    preferredStartDate: string;
    preferredEndDate: string;
    locationAddress: string;
    budgetMaxPaise: number;
  }): Promise<any> {
    return this.request('/api/marketplace/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async createTrainingQuote(requestId: string, data: {
    grossAmountPaise: number;
    trainerFeePaise: number;
    platformFeePaise?: number;
    taxAmountPaise?: number;
    termsMarkdown: string;
    validDays?: number;
  }): Promise<any> {
    return this.request(`/api/marketplace/requests/${requestId}/quote`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async acceptTrainingQuote(quoteId: string): Promise<any> {
    return this.request(`/api/marketplace/quotes/${quoteId}/accept`, {
      method: 'POST',
    });
  }

  public async getTrainingSessions(): Promise<any[]> {
    return this.request('/api/marketplace/sessions');
  }

  public async logSessionDelivery(sessionId: string, attendanceCount: number, notes?: string): Promise<any> {
    return this.request(`/api/marketplace/sessions/${sessionId}/deliver`, {
      method: 'POST',
      body: JSON.stringify({ attendanceCount, notes }),
    });
  }

  public async verifySessionAttendance(sessionId: string): Promise<any> {
    return this.request(`/api/marketplace/sessions/${sessionId}/verify`, {
      method: 'POST',
    });
  }

  public async getInvoices(): Promise<any[]> {
    return this.request('/api/marketplace/invoices');
  }

  public async payInvoice(invoiceId: string): Promise<any> {
    return this.request(`/api/marketplace/invoices/${invoiceId}/pay`, {
      method: 'POST',
    });
  }

  public async getPayouts(): Promise<any[]> {
    return this.request('/api/marketplace/payouts');
  }

  public async approvePayout(payoutId: string): Promise<any> {
    return this.request(`/api/marketplace/payouts/${payoutId}/approve`, {
      method: 'POST',
    });
  }

  public async settlePayout(payoutId: string): Promise<any> {
    return this.request(`/api/marketplace/payouts/${payoutId}/settle`, {
      method: 'POST',
    });
  }

  public async reportSafeguarding(data: {
    category: string;
    severity: string;
    description: string;
    subjectUserId?: string;
  }): Promise<any> {
    return this.request('/api/safeguarding/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getSafeguardingReports(): Promise<any[]> {
    return this.request('/api/safeguarding/reports');
  }

  /**
   * Initializes real-time authenticated WebSocket connection
   */
  public async initWebSocket(): Promise<void> {
    if (typeof window === 'undefined' || !this.token) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Pre-flight check if server is running on 3001 to prevent unhandled browser WebSocket errors
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      if (!res || !res.ok) {
        return;
      }
    } catch {
      return;
    }

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}?token=${this.token}`);

      this.ws.onopen = () => {
        this.wsRetryCount = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          for (const listener of this.wsListeners) {
            listener(data);
          }
        } catch {
          // ignore
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (this.wsRetryCount < 3) {
          this.wsRetryCount++;
          const delay = Math.min(1000 * Math.pow(2, this.wsRetryCount), 12000);
          setTimeout(() => {
            if (this.token) this.initWebSocket();
          }, delay);
        }
      };

      this.ws.onerror = () => {
        // Quiet fallback when standalone backend server is not running locally
      };
    } catch {
      // Quiet fallback
    }
  }

  public onRealtimeEvent(listener: (event: any) => void): () => void {
    this.wsListeners.add(listener);
    return () => {
      this.wsListeners.delete(listener);
    };
  }

  public async sendAIChat(payload: {
    message: string;
    conversationId?: string | null;
    context?: {
      subject?: string;
      gradeLevel?: string;
      topicId?: string;
      courseId?: string;
      lessonId?: string;
    };
    history?: { role: 'user' | 'assistant'; content: string }[];
  }): Promise<{
    status: 'success' | 'provider_not_configured' | 'error';
    data?: any;
    message?: string;
    error?: { code: string; message: string };
  }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (res.status === 503 && body.status === 'provider_not_configured') {
        return {
          status: 'provider_not_configured',
          message: body.message || 'The AI service is not configured yet.',
          error: body.error,
        };
      }

      if (!res.ok) {
        return {
          status: 'error',
          error: body.error || {
            code: `HTTP_${res.status}`,
            message: body.message || `Request failed with status ${res.status}`,
          },
        };
      }

      return body;
    } catch (err: any) {
      return {
        status: 'error',
        error: {
          code: 'NETWORK_ERROR',
          message: err?.message || 'Failed to connect to AI service.',
        },
      };
    }
  }
}

export const apiClient = new ApiClient();
