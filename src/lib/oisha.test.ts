import { describe, expect, it } from 'vitest';
import { containsContact } from './oisha';

describe('containsContact', () => {
  it.each([
    '+998 90 123 45 67',
    'raqamim 901234567',
    'menga yozing @jon_mijoz',
    't.me/jonbranding',
  ])('finds a contact in "%s"', (text) => {
    expect(containsContact(text)).toBe(true);
  });

  it.each([
    'Logo narxi qancha?',
    'Brendbuk 40 betdan iborat bo‘ladimi?',
    '2026 yil uchun narx',
    'email@a',
  ])('does not treat "%s" as a contact', (text) => {
    expect(containsContact(text)).toBe(false);
  });
});
