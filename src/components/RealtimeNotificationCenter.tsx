// ====================================================================
// Geniusphere 2.0 — Real-Time Notification Center & Toast Alert Stack
// Live unread counter, priority categorization, interactive toast alerts
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
} from 'lucide-react';
import { AppNotification } from '../backend/types';
import { backendEngine } from '../backend/RealtimeOrchestrator';

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
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const refreshList = () => {
    setNotifications([...backendEngine.notifications.getUserNotifications(userId)]);
  };

  useEffect(() => {
    refreshList();
    // Subscribe to real-time notification events for this user
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

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

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
        return <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--error, #EF4444)', textTransform: 'uppercase' }}>Urgent</span>;
      case 'high':
        return <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber, #F59E0B)', textTransform: 'uppercase' }}>High</span>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '48px',
        right: 0,
        width: '360px',
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: 'var(--brand-primary)' }} />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Live Notifications
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.72rem',
              color: 'var(--brand-primary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
            title="Mark all as read"
          >
            <CheckCheck size={13} />
            <span>Read All</span>
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
            }}
            title="Clear all notifications"
          >
            <Trash2 size={13} />
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '8px',
        }}
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' ? 'var(--bg-surface-subdued)' : 'none',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: filter === 'all' ? 700 : 500,
            color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          style={{
            background: filter === 'unread' ? 'var(--bg-surface-subdued)' : 'none',
            border: 'none',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: filter === 'unread' ? 700 : 500,
            color: filter === 'unread' ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div
        style={{
          maxHeight: '340px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 16px',
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
                border: n.is_read ? '1px solid var(--border-subtle)' : '1px solid var(--brand-primary)',
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
                    <span>{n.action_label || 'View'}</span>
                    <ExternalLink size={10} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
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
