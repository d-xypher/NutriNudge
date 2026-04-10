const SESSION_KEY = 'nutrinudge_session_id';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, newId);
  return newId;
}

export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return localStorage.getItem(SESSION_KEY) || '';
}
