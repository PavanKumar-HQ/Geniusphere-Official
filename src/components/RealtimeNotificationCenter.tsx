// ====================================================================
// Geniusphere 2.0 — Real-Time Notification Center, Preferences & Toast Stack
// Persistent records, cross-tab sync, category tabs, and Web Push controls
// ====================================================================

import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  GraduationCap,
  Award,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  X,
  ExternalLink,
  Settings,
  Wifi,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { AppNotification, NotificationCategory, NotificationPreferences } from '../backend/types';
import { backendEngine } from '../backend/RealtimeOrchestrator';
import { webPushService } from '../services/WebPushService';

interface RealtimeNotificationCenterProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, slug?: string) => void;
}

export const RealtimeNotificationCenter: React.FC<RealtimeNotificationCenterProps> = ({
  userId,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'assignment' | 'grade' | 'system'>('all');
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    backendEngine.notifications.getUserPreferences(userId)
  );
  const [pushStatus, setPushStatus] = useState<string>(webPushService.getPermissionStatus());
  const [isRequestingPush, setIsRequestingPush] = useState(false);

  const refreshList = () => {
    setNotifications([...backendEngine.notifications.getUserNotifications(userId)]);
    setPreferences(backendEngine.notifications.getUserPreferences(userId));
    setPushStatus(webPushService.getPermissionStatus());
  };

  useEffect(() => {
    refreshList();
    const unsubscribe = backendEngine.bus.subscribe(`user:${userId}`, () => {
      refreshList();
    });
    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = (id: string) => {
    backendEngine.notifications.markAsRead(userId, id);
    refreshList();
  };

  const handleMarkAllRead = () => {
    backendEngine.notifications.markAllAsRead(userId);
    refreshList();
  };

  const handleClearAll = () => {
    backendEngine.notifications.clearAll(userId);
    refreshList();
  };

  const handleTogglePush = async () => {
    if (preferences.push_enabled) {
      await webPushService.unsubscribe(userId);
      const updated = backendEngine.notifications.updateUserPreferences(userId, { push_enabled: false });
      setPreferences(updated);
      setPushStatus(webPushService.getPermissionStatus());
    } else {
      setIsRequestingPush(true);
      const res = await webPushService.requestPermissionAndSubscribe(userId);
      setIsRequestingPush(false);
      if (res.success) {
        const updated = backendEngine.notifications.updateUserPreferences(userId, { push_enabled: true });
        setPreferences(updated);
      }
      setPushStatus(webPushService.getPermissionStatus());
    }
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    const updated = backendEngine.notifications.updateUserPreferences(userId, {
      [key]: !preferences[key],
    });
    setPreferences(updated);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'assignment') return n.category === 'assignment';
    if (filter === 'grade') return n.category === 'grade';
    if (filter === 'system') return n.category === 'system' || n.category === 'security';
    return true;
  });

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grade':
        return <Award size={15} style={{ color: 'var(--brand-primary)' }} />;
      case 'assignment':
        return <BookOpen size={15} style={{ color: '#3B82F6' }} />;
      case 'certificate':
        return <GraduationCap size={15} style={{ color: '#F59E0B' }} />;
      case 'security':
        return <AlertTriangle size={15} style={{ color: '#EF4444' }} />;
      default:
        return <ShieldCheck size={15} style={{ color: 'var(--brand-primary)' }} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              textTransform: 'uppercase',
            }}
          >
            Urgent
          </span>
        );
      case 'high':
        return (
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#D97706',
              textTransform: 'uppercase',
            }}
          >
            High
          </span>
        );
      default:
        return null;
    }
  };

  const telemetry = backendEngine.getTelemetry();

  return (
    <div
      style={{
        position: 'absolute',
        top: '48px',
        right: 0,
        width: '390px',
        maxWidth: '92vw',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.24)',
        padding: '16px',
        zIndex: 300,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--brand-primary)' }} />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '100px',
                backgroundColor: 'var(--brand-primary)',
                color: '#FFFFFF',
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Live Status indicator & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            title={`Real-Time Bus: ${telemetry.status} (${telemetry.rtt_ms}ms)`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: telemetry.status === 'connected' ? 'var(--brand-primary)' : 'var(--text-muted)',
              padding: '2px 6px',
              borderRadius: '100px',
              backgroundColor: 'var(--bg-surface-subdued)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Radio size={11} className={telemetry.status === 'connected' ? 'animate-pulse' : ''} />
            <span>{telemetry.status === 'connected' ? 'Live' : 'Offline'}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'notifications' ? 'preferences' : 'notifications')}
            style={{
              background: activeTab === 'preferences' ? 'var(--bg-surface-subdued)' : 'none',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '4px 6px',
              color: activeTab === 'preferences' ? 'var(--brand-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Notification Preferences"
          >
            <Sliders size={13} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {activeTab === 'preferences' ? (
        /* Preferences Drawer */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '6px 0' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Control multi-channel delivery, operating system push subscriptions, and student quiet hours.
          </div>

          {/* Web Push Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface-subdued)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Operating System Push
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {pushStatus === 'granted'
                  ? 'Active browser push subscription'
                  : pushStatus === 'denied'
                  ? 'Permission blocked in browser settings'
                  : 'Receive background notifications even when tab is closed'}
              </div>
            </div>
            <button
              type="button"
              onClick={handleTogglePush}
              disabled={isRequestingPush}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: preferences.push_enabled ? 'var(--brand-primary)' : 'var(--border-subtle)',
                color: preferences.push_enabled ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isRequestingPush ? 'Requesting...' : preferences.push_enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>

          {/* In-App Alerts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>In-App Toast Alerts</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Floating alerts for high-priority events</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.in_app_enabled}
              onChange={() => handleTogglePref('in_app_enabled')}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          {/* Assignment Reminders */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Assignment Reminders</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>24h deadline warnings and new lab posts</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.assignment_reminders}
              onChange={() => handleTogglePref('assignment_reminders')}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          {/* Grade Alerts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Grade & Feedback Alerts</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Instant alert when teacher posts evaluation</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.grade_alerts}
              onChange={() => handleTogglePref('grade_alerts')}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          {/* Quiet Hours */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quiet Hours (8 PM - 8 AM)</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DPDP minor compliance: suppress audible alerts at night</div>
            </div>
            <input
              type="checkbox"
              checked={preferences.quiet_hours_enabled}
              onChange={() => handleTogglePref('quiet_hours_enabled')}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            style={{
              marginTop: '8px',
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Back to Notifications
          </button>
        </div>
      ) : (
        /* Notifications List View */
        <>
          {/* Quick Actions & Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(
                [
                  { id: 'all', label: `All (${notifications.length})` },
                  { id: 'unread', label: `Unread (${unreadCount})` },
                  { id: 'assignment', label: 'Tasks' },
                  { id: 'grade', label: 'Grades' },
                  { id: 'system', label: 'System' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  style={{
                    background: filter === tab.id ? 'var(--brand-primary)' : 'var(--bg-surface-subdued)',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: filter === tab.id ? 800 : 600,
                    color: filter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.7rem',
                  color: 'var(--brand-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 4px',
                }}
                title="Mark all as read"
              >
                <CheckCheck size={12} />
                <span>Read All</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
                title="Clear all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* List items */}
          <div
            style={{
              maxHeight: '340px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingRight: '2px',
            }}
          >
            {filteredNotifications.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                }}
              >
                No notifications in this view.
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: n.is_read ? 'var(--bg-surface)' : 'var(--bg-surface-subdued)',
                    border: n.is_read ? '1px solid var(--border-subtle)' : '1.5px solid var(--brand-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getCategoryIcon(n.category)}
                      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        {n.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getPriorityBadge(n.priority)}
                      {!n.is_read && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--brand-primary)',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginTop: '4px', lineHeight: 1.4 }}>
                    {n.message}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {n.action_view && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigate(n.action_view!, n.action_slug);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-primary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.7rem',
                          padding: 0,
                        }}
                      >
                        <span>{n.action_label || 'View in Workspace'}</span>
                        <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ====================================================================
// Floating Real-Time Toast Notifications Component
// ====================================================================

export const RealtimeToastStack: React.FC<{
  onNavigate: (view: string, slug?: string) => void;
}> = ({ onNavigate }) => {
  const [toasts, setToasts] = useState<AppNotification[]>([]);

  useEffect(() => {
    const unsub = backendEngine.notifications.onToast((notif) => {
      setToasts((prev) => [notif, ...prev.slice(0, 3)]); // Max 4 concurrent toasts
      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== notif.id));
      }, 6000);
    });
    return () => unsub();
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            backgroundColor: 'var(--bg-surface)',
            border: '1.5px solid var(--brand-primary)',
            borderRadius: '12px',
            padding: '12px 14px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.22)',
            animation: 'fadeInUp 0.25s ease-out',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-primary)',
                  boxShadow: '0 0 6px var(--brand-primary)',
                }}
              />
              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                {toast.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            {toast.message}
          </div>

          {toast.action_view && (
            <button
              type="button"
              onClick={() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
                onNavigate(toast.action_view!, toast.action_slug);
              }}
              style={{
                marginTop: '4px',
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                color: 'var(--brand-primary)',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {toast.action_label || 'View in Workspace →'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
