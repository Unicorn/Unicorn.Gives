import { describe, it, expect } from 'vitest';
import {
  DEFAULT_MODULE_FLAGS,
  moduleForAdminPath,
  moduleForPublicPath,
  normalizeFlags,
} from './featureModules';

describe('normalizeFlags', () => {
  it('returns defaults for null, undefined, and non-objects', () => {
    expect(normalizeFlags(null)).toEqual(DEFAULT_MODULE_FLAGS);
    expect(normalizeFlags(undefined)).toEqual(DEFAULT_MODULE_FLAGS);
    expect(normalizeFlags('games')).toEqual(DEFAULT_MODULE_FLAGS);
    expect(normalizeFlags(42)).toEqual(DEFAULT_MODULE_FLAGS);
  });

  it('applies known boolean keys over defaults', () => {
    expect(normalizeFlags({ municipal: false })).toEqual({
      ...DEFAULT_MODULE_FLAGS,
      municipal: false,
    });
    expect(normalizeFlags({ municipal: false, games: false })).toEqual({
      municipal: false,
      community: true,
      directory: true,
      games: false,
    });
  });

  it('ignores unknown keys and non-boolean values', () => {
    expect(normalizeFlags({ bogus: false, municipal: 'no', games: 0 })).toEqual(
      DEFAULT_MODULE_FLAGS,
    );
  });

  it('returns a fresh object, never the defaults reference', () => {
    const out = normalizeFlags({});
    expect(out).not.toBe(DEFAULT_MODULE_FLAGS);
  });
});

describe('moduleForAdminPath', () => {
  it('matches exact section paths and nested routes', () => {
    expect(moduleForAdminPath('/admin/departments')).toBe('municipal');
    expect(moduleForAdminPath('/admin/departments/some-id')).toBe('municipal');
    expect(moduleForAdminPath('/admin/bingo-games/abc/squares')).toBe('games');
    expect(moduleForAdminPath('/admin/events/new')).toBe('community');
  });

  it('does not confuse sibling prefixes', () => {
    expect(moduleForAdminPath('/admin/partners')).toBe('directory');
    expect(moduleForAdminPath('/admin/partner-pages')).toBe('directory');
    expect(moduleForAdminPath('/admin/partner-pages/new')).toBe('directory');
  });

  it('returns null for core admin paths', () => {
    expect(moduleForAdminPath('/admin')).toBeNull();
    expect(moduleForAdminPath('/admin/settings')).toBeNull();
    expect(moduleForAdminPath('/admin/settings/modules')).toBeNull();
    expect(moduleForAdminPath('/admin/pages')).toBeNull();
    expect(moduleForAdminPath('/admin/users')).toBeNull();
  });
});

describe('moduleForPublicPath', () => {
  it('maps public route trees to modules', () => {
    expect(moduleForPublicPath('/government')).toBe('municipal');
    expect(moduleForPublicPath('/government/clare-county/lincoln-township/minutes')).toBe(
      'municipal',
    );
    expect(moduleForPublicPath('/guides/some-guide')).toBe('community');
    expect(moduleForPublicPath('/home/events/summer-fest')).toBe('community');
    expect(moduleForPublicPath('/home/news')).toBe('community');
    expect(moduleForPublicPath('/directory/contacts')).toBe('directory');
    expect(moduleForPublicPath('/partners/the-mane')).toBe('directory');
    expect(moduleForPublicPath('/bingo/board/abc')).toBe('games');
  });

  it('returns null for core paths', () => {
    expect(moduleForPublicPath('/')).toBeNull();
    expect(moduleForPublicPath('/home')).toBeNull();
    expect(moduleForPublicPath('/home/history')).toBeNull();
    expect(moduleForPublicPath('/sign-in')).toBeNull();
    // prefix must match on a segment boundary
    expect(moduleForPublicPath('/governmentx')).toBeNull();
  });
});
