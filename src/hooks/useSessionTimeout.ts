import { useState, useEffect, useCallback, useRef } from 'react';

const TIMEOUT_DURATION_MS = 20 * 60 * 1000; // 20 minutes
const WARNING_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutes warning before expiration
const STORAGE_KEY_LAST_ACTIVE = 'deepscript_last_active';
const STORAGE_KEY_AUTH = 'deepscript_auth';

interface UseSessionTimeoutProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onSessionExpired?: () => void;
}

export function useSessionTimeout({ isLoggedIn, onLogout, onSessionExpired }: UseSessionTimeoutProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(WARNING_THRESHOLD_MS / 1000);
  
  const lastThrottleRef = useRef<number>(0);
  const onLogoutRef = useRef(onLogout);
  const onSessionExpiredRef = useRef(onSessionExpired);

  useEffect(() => {
    onLogoutRef.current = onLogout;
    onSessionExpiredRef.current = onSessionExpired;
  }, [onLogout, onSessionExpired]);

  // Update the last active timestamp
  const recordActivity = useCallback(() => {
    if (!isLoggedIn) return;
    const now = Date.now();
    
    // Throttle writes to localStorage to once every 1000ms
    if (now - lastThrottleRef.current > 1000) {
      lastThrottleRef.current = now;
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(now));
      
      // If warning modal is open and user actively moves or types, we can extend the session
      if (showWarning) {
        setShowWarning(false);
      }
    }
  }, [isLoggedIn, showWarning]);

  // Manually extend session (e.g. clicking "Stay Logged In")
  const extendSession = useCallback(() => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(now));
    setShowWarning(false);
    setSecondsRemaining(WARNING_THRESHOLD_MS / 1000);
  }, []);

  // Dismiss expired modal
  const dismissExpiredModal = useCallback(() => {
    setShowExpired(false);
  }, []);

  // Set initial timestamp when logging in
  useEffect(() => {
    if (isLoggedIn) {
      const existing = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
      const now = Date.now();
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, String(now));
      }
    } else {
      setShowWarning(false);
    }
  }, [isLoggedIn]);

  // Monitor user activity events
  useEffect(() => {
    if (!isLoggedIn) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'];
    
    const handleUserActivity = () => {
      // Don't auto-dismiss warning by tiny background events; user must click "Stay Logged In" or explicitly interact
      if (!showWarning) {
        recordActivity();
      }
    };

    events.forEach(evt => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(evt => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [isLoggedIn, showWarning, recordActivity]);

  // Sync across tabs with storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_AUTH && !e.newValue && isLoggedIn) {
        // User logged out in another tab
        onLogoutRef.current();
      } else if (e.key === STORAGE_KEY_LAST_ACTIVE && isLoggedIn) {
        // Activity detected in another tab
        setShowWarning(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isLoggedIn]);

  // Check timeout ticker every second
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      const storedLastActive = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
      const lastActiveTime = storedLastActive ? parseInt(storedLastActive, 10) : Date.now();
      const now = Date.now();
      const elapsed = now - lastActiveTime;
      const timeLeftMs = TIMEOUT_DURATION_MS - elapsed;

      if (timeLeftMs <= 0) {
        // Session has expired
        setShowWarning(false);
        setShowExpired(true);
        if (onSessionExpiredRef.current) {
          onSessionExpiredRef.current();
        }
        onLogoutRef.current();
      } else if (timeLeftMs <= WARNING_THRESHOLD_MS) {
        // Show warning countdown
        setShowWarning(true);
        setSecondsRemaining(Math.max(1, Math.ceil(timeLeftMs / 1000)));
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return {
    showWarning,
    showExpired,
    secondsRemaining,
    extendSession,
    dismissExpiredModal
  };
}
