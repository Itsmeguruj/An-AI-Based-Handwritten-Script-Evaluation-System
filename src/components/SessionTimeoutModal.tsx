import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, RefreshCw, LogOut, Lock } from 'lucide-react';

interface SessionTimeoutModalProps {
  showWarning: boolean;
  showExpired: boolean;
  secondsRemaining: number;
  onExtendSession: () => void;
  onLogout: () => void;
  onDismissExpired: () => void;
  role?: 'coordinator' | 'admin';
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  showWarning,
  showExpired,
  secondsRemaining,
  onExtendSession,
  onLogout,
  onDismissExpired,
  role = 'coordinator'
}) => {
  if (!showWarning && !showExpired) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 120 seconds total warning time
  const percentRemaining = Math.max(0, Math.min(100, (secondsRemaining / 120) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {/* WARNING MODAL: Expiring Soon */}
      {showWarning && !showExpired && (
        <div
          className="glass-panel"
          style={{
            maxWidth: '460px',
            width: '100%',
            background: 'var(--panel-bg-solid, #18181c)',
            border: '1px solid rgba(245, 158, 11, 0.28)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative'
          }}
        >
          {/* Header & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#f59e0b'
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Session Timeout Warning
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {role === 'admin' ? 'Administrator Workspace' : 'Coordinator Evaluation Studio'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            You have been inactive. For data security and evaluation integrity, your session will automatically terminate in:
          </p>

          {/* Timer Highlight Box */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '13px', fontWeight: '600' }}>
              <AlertTriangle size={16} />
              <span>Time Remaining</span>
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '22px',
                fontWeight: '800',
                color: secondsRemaining <= 30 ? '#ef4444' : '#f59e0b',
                letterSpacing: '1px'
              }}
            >
              {formatTime(secondsRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${percentRemaining}%`,
                height: '100%',
                backgroundColor: secondsRemaining <= 30 ? '#ef4444' : '#f59e0b',
                transition: 'width 1s linear, background-color 0.3s'
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              onClick={onExtendSession}
              className="btn-gta-primary"
              style={{
                flex: 1,
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} />
              Stay Logged In
            </button>
            <button
              onClick={onLogout}
              className="btn-gta-secondary"
              style={{
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '12px',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* EXPIRED MODAL: Session Expired */}
      {showExpired && (
        <div
          className="glass-panel"
          style={{
            maxWidth: '440px',
            width: '100%',
            background: 'var(--panel-bg-solid, #18181c)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(239, 68, 68, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '18px',
            animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444'
            }}
          >
            <Lock size={26} />
          </div>

          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Session Expired
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              20-Minute Inactivity Limit Reached
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            Your active {role === 'admin' ? 'Admin' : 'Coordinator'} session was automatically terminated to protect exam confidentiality and system security.
          </p>

          <button
            onClick={onDismissExpired}
            className="btn-gta-primary"
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '12px',
              marginTop: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShieldAlert size={16} />
            Sign In Again
          </button>
        </div>
      )}
    </div>
  );
};
