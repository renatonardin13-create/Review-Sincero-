// Real presence tracker: tracks real global sessions across all visitors without Math.random

interface PresenceState {
  isOnline: boolean;
  activeSessionCount: number;
}

const HEARTBEAT_INTERVAL_MS = 12000;

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    const existing = sessionStorage.getItem('rs_presence_session_id');
    if (existing && existing.length > 5) return existing;
  } catch {}

  let newId: string;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    newId = 'sess_' + crypto.randomUUID();
  } else {
    const now = Date.now().toString(36);
    const perf = (typeof performance !== 'undefined' ? performance.now().toFixed(0) : '0');
    newId = `sess_${now}_${perf}`;
  }

  try {
    sessionStorage.setItem('rs_presence_session_id', newId);
  } catch {}

  return newId;
}

export function initPresenceTracker(onChange: (state: PresenceState) => void): () => void {
  let isSubscribed = true;
  const sessionId = getOrCreateSessionId();

  const sendHeartbeat = async () => {
    if (!navigator.onLine) {
      if (isSubscribed) {
        onChange({ isOnline: false, activeSessionCount: 1 });
      }
      return;
    }

    try {
      const resp = await fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (isSubscribed && typeof data.activeSessionCount === 'number') {
          onChange({
            isOnline: true,
            activeSessionCount: data.activeSessionCount
          });
        }
      }
    } catch {
      // Fallback se rede local oscilar temporariamente
      if (isSubscribed) {
        onChange({
          isOnline: navigator.onLine,
          activeSessionCount: 0
        });
      }
    }
  };

  // Initial heartbeat
  sendHeartbeat();

  const interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

  const handleOnlineStatus = () => {
    if (isSubscribed) {
      sendHeartbeat();
    }
  };

  const handlePageUnload = () => {
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ sessionId })], { type: 'application/json' });
        navigator.sendBeacon('/api/presence/leave', blob);
      }
    } catch {}
  };

  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
  window.addEventListener('beforeunload', handlePageUnload);
  window.addEventListener('pagehide', handlePageUnload);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOnlineStatus);
    window.removeEventListener('beforeunload', handlePageUnload);
    window.removeEventListener('pagehide', handlePageUnload);
    handlePageUnload();
  };
}
