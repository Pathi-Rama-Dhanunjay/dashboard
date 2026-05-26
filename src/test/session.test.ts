import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writeUser, readUser, logout } from '../lib/session';

beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
});

describe('session helpers', () => {
  it('writeUser stores user and readUser returns it', () => {
    writeUser({ name: 'Test User', role: 'Admin', initials: 'TU' });
    expect(readUser()).toMatchObject({ name: 'Test User', role: 'Admin', initials: 'TU' });
  });

  it('readUser returns null when no session exists', () => {
    expect(readUser()).toBeNull();
  });

  it('logout clears user from storage', () => {
    writeUser({ name: 'Test User', role: 'Analyst', initials: 'TU' });
    logout();
    expect(readUser()).toBeNull();
  });

  it('readUser returns null for an expired entry', () => {
    sessionStorage.setItem('biassense.user', JSON.stringify({
      value: { name: 'Old', role: 'Viewer', initials: 'OL' },
      expiresAt: Date.now() - 1,
    }));
    expect(readUser()).toBeNull();
  });
});
