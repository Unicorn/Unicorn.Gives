import { describe, it, expect } from 'vitest';
import { entryContentName } from './entryBundle';

const OLD = 'entry-c109a9bf3d124b9814bd8ae2141b5a29.js';

describe('entryContentName', () => {
  it('changes the name when the contents change', () => {
    const a = entryContentName(OLD, 'routes: { "[id]": "[id]-8cb02f68.js" }');
    const b = entryContentName(OLD, 'routes: { "[id]": "[id]-37dc34c1.js" }');
    expect(a).toMatch(/^entry-[0-9a-f]{32}\.js$/);
    expect(a).not.toBe(b);
  });

  it('is stable for the same contents, so a rerun renames nothing', () => {
    const named = entryContentName(OLD, 'same');
    expect(entryContentName(named, 'same')).toBe(named);
  });

  it('leaves other bundles alone', () => {
    expect(entryContentName('__common-b202d7e6df3362fa2d61ded953305659.js', 'x')).toBe('__common-b202d7e6df3362fa2d61ded953305659.js');
  });
});
