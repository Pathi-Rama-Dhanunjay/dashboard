const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export interface SessionUser {
  name: string;
  role: string;
  initials: string;
}

interface SessionEntry<T> {
  value: T;
  expiresAt: number;
}

function writeSession<T>(key: string, value: T): void {
  try {
    const entry: SessionEntry<T> = { value, expiresAt: Date.now() + SESSION_TTL_MS };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    console.error('[BiasSense] Storage write failed:', err);
  }
}

function readSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: SessionEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.value;
  } catch (_) {
    return null;
  }
}

function clearSession(): void {
  try {
    sessionStorage.removeItem('biassense.user');
    sessionStorage.removeItem('biassense.workspace');
    sessionStorage.removeItem('biassense.onboarded');
  } catch (_) {}
}

export function writeUser(user: SessionUser): void {
  writeSession('biassense.user', user);
  window.dispatchEvent(new Event('biassense:user'));
}

export function readUser(): SessionUser | null {
  return readSession<SessionUser>('biassense.user');
}

export function writeOnboarded(): void {
  writeSession('biassense.onboarded', true);
}

export function readOnboarded(): boolean {
  return readSession<boolean>('biassense.onboarded') === true;
}

export function logout(): void {
  clearSession();
  window.dispatchEvent(new Event('biassense:user'));
}
