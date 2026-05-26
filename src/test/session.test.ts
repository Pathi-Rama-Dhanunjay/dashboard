import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writeUser, readUser, logout, writeOnboarded, readOnboarded } from '../lib/session';

beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
});

describe('session helpers', () => {
  it('writeUser stores user and readUser returns it', () => {
    writeUser({ name: 'Test User', role: 'Admin', initials: 'TU' });
    expect(readUser()).toMatchObject({ name: 'Test User', role: 'Admin', initials: 'TU' });
  });

  it('writeUser dispatches biassense:user event', () => {
    writeUser({ name: 'Test User', role: 'Admin', initials: 'TU' });
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'biassense:user' })
    );
  });

  it('readUser returns null when no session exists', () => {
    expect(readUser()).toBeNull();
  });

  it('logout clears user from storage', () => {
    writeUser({ name: 'Test User', role: 'Analyst', initials: 'TU' });
    logout();
    expect(readUser()).toBeNull();
  });

  it('logout dispatches biassense:user event', () => {
    logout();
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'biassense:user' })
    );
  });

  it('readUser returns null for an expired entry', () => {
    sessionStorage.setItem('biassense.user', JSON.stringify({
      value: { name: 'Old', role: 'Viewer', initials: 'OL' },
      expiresAt: Date.now() - 1,
    }));
    expect(readUser()).toBeNull();
  });
});

describe('onboarding helpers', () => {
  it('writeOnboarded marks workspace as set up', () => {
    writeOnboarded();
    expect(readOnboarded()).toBe(true);
  });

  it('readOnboarded returns false when not set', () => {
    expect(readOnboarded()).toBe(false);
  });

  it('readOnboarded returns false for an expired entry', () => {
    sessionStorage.setItem('biassense.onboarded', JSON.stringify({
      value: true,
      expiresAt: Date.now() - 1,
    }));
    expect(readOnboarded()).toBe(false);
  });
});
