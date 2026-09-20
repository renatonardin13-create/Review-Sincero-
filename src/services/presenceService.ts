// Real presence tracker: tracks real sessions without artificial Math.random generation

interface PresenceState {
  isOnline: boolean;
  activeSessionCount: number;
}

const PRESENCE_STORAGE_KEY = 'rs_presence_heartbeats';
const SESSION_ID = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
const HEARTBEAT_INTERVAL_MS = 15000;
const SESSION_EXPIRY_MS = 45000;

export function initPresenceTracker(onChange: (state: PresenceState) => void): () => void {
  let isSubscribed = true;

  const updateHeartbeat = () => {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
      const heartbeats: Record<string, number> = raw ? JSON.parse(raw) : {};

      // Register this session
      heartbeats[SESSION_ID] = now;

      // Purge expired sessions
      const validSessions: Record<string, number> = {};
      let count = 0;
      for (const [id, time] of Object.entries(heartbeats)) {
        if (now - time < SESSION_EXPIRY_MS) {
          validSessions[id] = time;
          count++;
        }
      }

      localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(validSessions));

      if (isSubscribed) {
        onChange({
          isOnline: window.navigator.onLine,
          activeSessionCount: Math.max(1, count)
        });
      }
    } catch {
      if (isSubscribed) {
        onChange({
          isOnline: window.navigator.onLine,
          activeSessionCount: 1
        });
      }
    }
  };

  // Initial heartbeat
  updateHeartbeat();

  const interval = setInterval(updateHeartbeat, HEARTBEAT_INTERVAL_MS);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === PRESENCE_STORAGE_KEY && e.newValue) {
      try {
        const now = Date.now();
        const data: Record<string, number> = JSON.parse(e.newValue);
        let count = 0;
        for (const [, time] of Object.entries(data)) {
          if (now - time < SESSION_EXPIRY_MS) count++;
        }
        if (isSubscribed) {
          onChange({
            isOnline: window.navigator.onLine,
            activeSessionCount: Math.max(1, count)
          });
        }
      } catch {}
    }
  };

  const handleOnlineStatus = () => {
    if (isSubscribed) {
      updateHeartbeat();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('online', handleOnlineStatus);
    window.removeEventListener('offline', handleOnlineStatus);

    // Remove session on leave
    try {
      const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
      if (raw) {
        const heartbeats: Record<string, number> = JSON.parse(raw);
        delete heartbeats[SESSION_ID];
        localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(heartbeats));
      }
    } catch {}
  };
}
