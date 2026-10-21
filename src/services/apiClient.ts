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

  public async completeLesson(courseId: string, lessonId: string, score: number = 100): Promise<any> {
    return this.request(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
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

  /**
   * Initializes real-time authenticated WebSocket connection
   */
  public initWebSocket(): void {
    if (typeof window === 'undefined' || !this.token) return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(`${WS_BASE_URL}?token=${this.token}`);

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
        // Exponential backoff reconnect
        setTimeout(() => {
          if (this.token) this.initWebSocket();
        }, 3000);
      };

      this.ws.onerror = (err) => {
        console.warn('[ApiClient WS Error]', err);
      };
    } catch (err) {
      console.warn('[ApiClient WS Connection failed]', err);
    }
  }

  public onRealtimeEvent(listener: (event: any) => void): () => void {
    this.wsListeners.add(listener);
    return () => {
      this.wsListeners.delete(listener);
    };
  }
}

export const apiClient = new ApiClient();
