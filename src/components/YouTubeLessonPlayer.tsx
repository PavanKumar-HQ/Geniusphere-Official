import React, { useState, useEffect } from 'react';
import {
  Play,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Video,
} from 'lucide-react';
import { VideoLesson } from '../curriculum/types';

export interface YouTubeLessonPlayerProps {
  lesson: VideoLesson;
  isCompleted: boolean;
  onMarkCompleted: (lessonId: string) => void;
  className?: string;
}

export const YouTubeLessonPlayer: React.FC<YouTubeLessonPlayerProps> = ({
  lesson,
  isCompleted,
  onMarkCompleted,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedTimedOut, setEmbedTimedOut] = useState(false);

  // Reset states when lesson changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setEmbedTimedOut(false);

    // Timeout safety net: if iframe hasn't loaded in 8 seconds, offer fallback
    const timer = setTimeout(() => {
      setEmbedTimedOut(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, [lesson.youtubeVideoId]);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    lesson.youtubeVideoId
  )}?rel=0&modestbranding=1&enablejsapi=1`;

  const youtubeDirectUrl =
    lesson.youtubeUrl || `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}`;

  return (
    <div
      className={`card ${className}`}
      style={{
        padding: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle, #E5F0DF)',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(38, 53, 42, 0.04)',
      }}
      data-testid="youtube-lesson-player"
    >
      {/* Top Header: Video Lesson Title & Source Verification Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--brand-surface, #F0F7ED)',
              color: 'var(--brand-primary, #43A85B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Video size={18} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted, #6B7280)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Lesson {lesson.orderIndex} of 10 • {lesson.channelTitle}
            </div>
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--text-primary, #111827)',
                margin: '2px 0 0 0',
                lineHeight: 1.3,
              }}
            >
              {lesson.title}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            className="badge badge-neutral"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Clock size={12} /> {lesson.durationMinutes} min
          </span>

          {lesson.verificationStatus === 'VERIFIED' ? (
            <span
              className="badge badge-success"
              style={{
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
              }}
              title="Verified authentic educational video via YouTube oEmbed API"
            >
              <ShieldCheck size={12} /> Verified Source
            </span>
          ) : (
            <span
              className="badge"
              style={{
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
              }}
              title="Curated curriculum reference link; fallback player active"
            >
              <AlertCircle size={12} /> External Reference
            </span>
          )}

          <a
            href={youtubeDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              height: '32px',
              padding: '0 10px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
            }}
            title="Open video directly on YouTube in a new tab"
          >
            <ExternalLink size={12} /> Open in YouTube
          </a>
        </div>
      </div>

      {/* Responsive Video Container (16:9 Aspect Ratio) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9 ratio
          height: 0,
          backgroundColor: '#0F172A',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}
      >
        {/* Loading Indicator */}
        {isLoading && !hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0F172A',
              color: '#94A3B8',
              zIndex: 2,
              gap: '12px',
            }}
          >
            <RefreshCw
              size={28}
              className="animate-spin"
              style={{ animation: 'spin 1.2s linear infinite' }}
            />
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Connecting to YouTube secure player...
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Channel: {lesson.channelTitle}
            </div>
          </div>
        )}

        {/* Error Fallback State */}
        {hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              padding: '24px',
              textAlign: 'center',
              zIndex: 3,
              gap: '12px',
            }}
          >
            <AlertCircle size={36} color="#F59E0B" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
              Video Embed Restricted by Host or Network
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#CBD5E1', maxWidth: '420px' }}>
              This video ({lesson.title}) may have third-party iframe embedding restrictions. You
              can watch the complete verified lecture directly on YouTube.
            </p>
            <a
              href={youtubeDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                height: '38px',
                padding: '0 16px',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                marginTop: '8px',
              }}
            >
              <ExternalLink size={14} /> Watch on YouTube ({lesson.channelTitle})
            </a>
          </div>
        )}

        {/* Embedded Iframe */}
        {!hasError && (
          <iframe
            key={lesson.youtubeVideoId}
            src={embedUrl}
            title={lesson.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </div>

      {/* Fallback Notice if Slow */}
      {embedTimedOut && isLoading && !hasError && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <span>Taking longer than expected? You can watch directly on YouTube.</span>
          <a
            href={youtubeDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontWeight: 700,
              color: '#B45309',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Open Video <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Lesson Details: Description, Objectives & Honest Completion Trigger */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: '20px',
          alignItems: 'start',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle, #E5F0DF)',
        }}
      >
        <div>
          <h4
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-muted, #6B7280)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            Lesson Summary & Core Takeaways
          </h4>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary, #4B5563)',
              lineHeight: 1.5,
              marginBottom: '12px',
            }}
          >
            {lesson.description}
          </p>

          {/* Key Takeaways */}
          {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {lesson.keyTakeaways.map((takeaway, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    backgroundColor: 'var(--brand-surface, #F0F7ED)',
                    color: 'var(--brand-primary, #43A85B)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  ✓ {takeaway}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Completion Control */}
        <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            className={isCompleted ? 'btn-secondary' : 'btn-primary'}
            onClick={() => onMarkCompleted(lesson.id)}
            style={{
              height: '42px',
              padding: '0 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: isCompleted ? '#DCFCE7' : undefined,
              borderColor: isCompleted ? '#86EFAC' : undefined,
              color: isCompleted ? '#15803D' : undefined,
              cursor: 'pointer',
            }}
            data-testid="mark-lesson-completed-btn"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} /> Completed
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Mark as Watched
              </>
            )}
          </button>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted, #9CA3AF)',
              textAlign: 'center',
            }}
          >
            {isCompleted ? 'Progress recorded to profile' : 'Student-confirmed completion'}
          </div>
        </div>
      </div>
    </div>
  );
};
