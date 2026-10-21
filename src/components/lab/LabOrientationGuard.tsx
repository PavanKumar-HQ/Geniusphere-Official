import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { RotateCw, Maximize2, ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';

export interface LabOrientationContextValue {
  isGuardActive: boolean;
  isBypassed: boolean;
  setBypassed: (val: boolean) => void;
}

export const LabOrientationContext = createContext<LabOrientationContextValue>({
  isGuardActive: false,
  isBypassed: false,
  setBypassed: () => {},
});

export const useLabOrientation = () => useContext(LabOrientationContext);

const SESSION_STORAGE_KEY = 'geniusphere_lab_portrait_bypassed';

interface LabOrientationGuardProps {
  children: React.ReactNode;
  labTitle?: string;
  forceLandscapeOnly?: boolean;
}

export const LabOrientationGuard: React.FC<LabOrientationGuardProps> = ({
  children,
  labTitle = 'Interactive Lab',
  forceLandscapeOnly = true,
}) => {
  const parentGuard = useContext(LabOrientationContext);

  // If an ancestor LabOrientationGuard is already mounted in the component hierarchy,
  // this child guard acts as a transparent passthrough to prevent nested/duplicate overlays.
  if (parentGuard.isGuardActive) {
    return <>{children}</>;
  }

  return (
    <RootLabOrientationGuard labTitle={labTitle} forceLandscapeOnly={forceLandscapeOnly}>
      {children}
    </RootLabOrientationGuard>
  );
};

const RootLabOrientationGuard: React.FC<LabOrientationGuardProps> = ({
  children,
  labTitle = 'Interactive Lab',
  forceLandscapeOnly = true,
}) => {
  const [isMobilePortrait, setIsMobilePortrait] = useState<boolean>(false);
  const [bypassed, setBypassedState] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const setBypassed = useCallback((val: boolean) => {
    setBypassedState(val);
    try {
      if (val) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      } else {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors in restricted iframes or privacy modes
    }
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;
      // Detect mobile screens (<768px) currently rendered in portrait orientation
      const isSmallScreen = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      setIsMobilePortrait(isSmallScreen && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleRequestFullscreenLandscape = async () => {
    try {
      const docEl = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
      };

      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }

      // Modern Screen Orientation API (Chromium/Android/PWA)
      if (screen.orientation && 'lock' in screen.orientation) {
        // @ts-ignore - lock method may not be in standard TypeScript lib.dom.d.ts
        await screen.orientation.lock('landscape').catch(() => {});
      }
    } catch {
      // Graceful fallback: some browsers (e.g. iOS Safari) disallow programmatic orientation lock
    }
  };

  const contextValue: LabOrientationContextValue = {
    isGuardActive: true,
    isBypassed: bypassed,
    setBypassed,
  };

  // If orientation is landscape, or wide screen, or user explicitly bypassed, render lab directly
  const showPrompt = forceLandscapeOnly && isMobilePortrait && !bypassed;

  return (
    <LabOrientationContext.Provider value={contextValue}>
      {showPrompt ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Rotate device to landscape"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#070B1A',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {/* Background glow effects */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 240, 255, 0.08)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              backgroundColor: 'rgba(124, 107, 255, 0.08)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '380px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Animated Phone Rotation Visual */}
            <div
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className="orientation-rotating-phone"
                style={{
                  width: '54px',
                  height: '84px',
                  borderRadius: '12px',
                  border: '2.5px solid #3BF0FF',
                  backgroundColor: 'rgba(59, 240, 255, 0.1)',
                  boxShadow: '0 0 25px rgba(59, 240, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px',
                  animation: 'rotatePhoneAnimation 2.8s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <div
                  style={{
                    width: '28px',
                    height: '18px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(59, 240, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RotateCw size={12} color="#3BF0FF" />
                </div>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              </div>
            </div>

            <style>{`
              @keyframes rotatePhoneAnimation {
                0%, 20% { transform: rotate(0deg); }
                50%, 75% { transform: rotate(90deg); }
                95%, 100% { transform: rotate(0deg); }
              }
            `}</style>

            {/* Badge & Title */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(59, 240, 255, 0.1)',
                  border: '1px solid rgba(59, 240, 255, 0.25)',
                  color: '#3BF0FF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <Smartphone size={12} />
                <span>Landscape Mode Recommended</span>
              </div>

              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                }}
              >
                Rotate Your Device
              </h2>

              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#94A3B8',
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                <strong style={{ color: '#E2E8F0' }}>{labTitle}</strong> contains wide interactive schematics, simulation stages, and telemetry that are best viewed in landscape mode.
              </p>
            </div>

            {/* Action Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleRequestFullscreenLandscape}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#3BF0FF',
                  color: '#070B1A',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(59, 240, 255, 0.35)',
                }}
              >
                <Maximize2 size={16} />
                <span>Switch to Fullscreen Landscape</span>
              </button>

              <button
                type="button"
                onClick={() => setBypassed(true)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>Continue in Portrait Anyway</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Security / Verification Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.7rem',
                color: 'rgba(255, 255, 255, 0.35)',
                marginTop: '4px',
              }}
            >
              <ShieldCheck size={13} color="#00FFA3" />
              <span>Optimized for Student Interaction</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Subtle banner if user chose portrait mode on a small screen */}
          {forceLandscapeOnly && isMobilePortrait && bypassed && (
            <div
              style={{
                backgroundColor: 'rgba(59, 240, 255, 0.08)',
                borderBottom: '1px solid rgba(59, 240, 255, 0.2)',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                color: '#3BF0FF',
                zIndex: 30,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={12} />
                Portrait Mode Active (Rotate sideways for best view)
              </span>
              <button
                type="button"
                onClick={handleRequestFullscreenLandscape}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3BF0FF',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Fullscreen
              </button>
            </div>
          )}
          {children}
        </>
      )}
    </LabOrientationContext.Provider>
  );
};

export default LabOrientationGuard;
