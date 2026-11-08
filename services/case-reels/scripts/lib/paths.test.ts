import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { inOut } from './paths';

describe('inOut', () => {
  it('accepts paths inside out/', () => expect(inOut('out/a-uz.mp4')).toBe(resolve('out/a-uz.mp4')));
  it('rejects traversal out of out/', () => expect(() => inOut('out/../../etc/passwd')).toThrow(/out\//));
  it('rejects absolute paths elsewhere', () => expect(() => inOut('/etc/passwd')).toThrow(/out\//));
  it('rejects sibling directories that share the prefix', () => expect(() => inOut('out-evil/x.mp4')).toThrow(/out\//));
});
