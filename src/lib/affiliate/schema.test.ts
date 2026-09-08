import { describe, expect, it } from 'vitest';
import { affiliateRegisterSchema } from './schema';

describe('affiliateRegisterSchema', () => {
  it('accepts a valid payload and normalizes the phone', () => {
    const parsed = affiliateRegisterSchema.parse({
      fullName: 'Sherbek Aliyev',
      phone: '901234567',
      telegramUsername: '@sherbek_a',
    });
    expect(parsed.fullName).toBe('Sherbek Aliyev');
    expect(parsed.phone).toBe('+998901234567');
    expect(parsed.telegramUsername).toBe('sherbek_a');
  });

  it('allows omitting telegram', () => {
    const parsed = affiliateRegisterSchema.parse({ fullName: 'Muborak', phone: '+998907776655' });
    expect(parsed.telegramUsername).toBeUndefined();
  });

  it('rejects a short name', () => {
    expect(() => affiliateRegisterSchema.parse({ fullName: 'A', phone: '+998901234567' })).toThrow();
  });

  it('rejects an invalid phone', () => {
    expect(() => affiliateRegisterSchema.parse({ fullName: 'Sherbek', phone: '123' })).toThrow();
  });

  it('rejects an invalid telegram username', () => {
    expect(() =>
      affiliateRegisterSchema.parse({ fullName: 'Sherbek', phone: '+998901234567', telegramUsername: 'a b' }),
    ).toThrow();
  });
});
