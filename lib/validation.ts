const SESSION_ID_REGEX = /^[a-zA-Z0-9_-]{8,128}$/;

export const MEAL_CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;
export const NUDGE_URGENCY = ['low', 'medium', 'high'] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function asObject(value: unknown): Record<string, unknown> | null {
  return isObject(value) ? value : null;
}

export function asTrimmedString(value: unknown, maxLength = 256): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

export function parseSessionId(value: unknown): string | null {
  const sessionId = asTrimmedString(value, 128);
  if (!sessionId || !SESSION_ID_REGEX.test(sessionId)) {
    return null;
  }
  return sessionId;
}

export function isInEnum<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === 'string' && allowed.includes(value);
}
