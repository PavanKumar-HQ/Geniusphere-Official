import React from 'react';
import {
  X,
  Palette,
  Check,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  ThemeId,
  THEME_DEFINITIONS,
  ThemeDefinition,
  applyTheme,
} from '../utils/themeEngine';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  const handleSelectTheme = (themeId: ThemeId) => {
    applyTheme(themeId);
    onThemeChange(themeId);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px',
        animation: 'fadeIn 0.18s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card-elevated"
        style={{
          width: '100%',
          maxWidth: '760px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.28)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--brand-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)',
              }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: 0,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                Appearance & Theme Palette
              </h2>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                }}
              >
                Customize color temperature, high-contrast modes, and visual aesthetics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-subdued)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label="Close Theme Settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Themes Grid */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '12px',
            }}
          >
            {THEME_DEFINITIONS.map((theme: ThemeDefinition) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: isSelected
                      ? '2px solid var(--brand-primary)'
                      : '1.5px solid var(--border-subtle)',
                    backgroundColor: isSelected
                      ? 'var(--brand-surface)'
                      : 'var(--bg-canvas)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative',
                    boxShadow: isSelected
                      ? '0 4px 12px rgba(67, 168, 91, 0.18)'
                      : 'none',
                  }}
                >
                  {/* Top Row: Icon + Name + Active Pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {theme.id === 'system' ? (
                        <Laptop size={16} color="var(--brand-primary)" />
                      ) : theme.isDark ? (
                        <Moon size={16} color="var(--brand-primary)" />
                      ) : (
                        <Sun size={16} color="var(--brand-primary)" />
                      )}

                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {theme.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'var(--brand-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '100px',
                        }}
                      >
                        <Check size={12} />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {theme.subtitle}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {theme.description}
                  </div>

                  {/* Color Swatch Preview Chips */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Palette:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        title={`Background: ${theme.previewColors.bg}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: theme.previewColors.bg,
                          border: '1px solid rgba(0,0,0,0.15)',
                        }}
                      />
                      <div
                        title={`Surface: ${theme.previewColors.surface}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: theme.previewColors.surface,
                          border: '1px solid rgba(0,0,0,0.15)',
                        }}
                      />
                      <div
                        title={`Primary: ${theme.previewColors.primary}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: theme.previewColors.primary,
                        }}
                      />
                      <div
                        title={`Accent: ${theme.previewColors.accent}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: theme.previewColors.accent,
                        }}
                      />
                      <div
                        title={`Text: ${theme.previewColors.text}`}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: theme.previewColors.text,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={14} color="var(--brand-primary)" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Themes are applied instantly and saved across browser sessions.
            </span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={onClose}
            style={{
              padding: '0 20px',
              height: '38px',
              fontSize: '0.86rem',
              fontWeight: 800,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
