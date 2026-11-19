import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXCLUDED_TURSO_TABLES,
  decryptBuffer,
  encryptBuffer,
  shouldExportTurso,
} from './backup-offsite.mjs';

const TEST_KEY = 'synthetic-backup-passphrase-2026';

describe('backup-offsite security controls', () => {
  it('encrypts and decrypts payloads cleanly with AES-256-GCM', () => {
    const plain = Buffer.from(JSON.stringify({ ok: true, docs: [1, 2, 3] }), 'utf8');
    const encrypted = encryptBuffer(plain, TEST_KEY);
    assert.notEqual(encrypted.toString('utf8').includes('docs'), true);
    const decrypted = decryptBuffer(encrypted, TEST_KEY);
    assert.deepEqual(decrypted, plain);
  });

  it('fails closed on wrong passphrase or tampered ciphertext (authTag check)', () => {
    const plain = Buffer.from('sensitive-lead-row', 'utf8');
    const encrypted = encryptBuffer(plain, TEST_KEY);

    assert.throws(() => decryptBuffer(encrypted, 'wrong-passphrase-12345'));

    const tampered = Buffer.from(encrypted);
    tampered[tampered.length - 1] ^= 0xff;
    assert.throws(() => decryptBuffer(tampered, TEST_KEY));
  });

  it('rejects passphrases shorter than 16 characters', () => {
    assert.throws(() => encryptBuffer(Buffer.from('data'), 'too-short'));
    assert.throws(() => decryptBuffer(Buffer.alloc(64), 'too-short'));
  });

  it('fails closed on Turso export in --ci-public-safe mode without encryption key', () => {
    assert.equal(
      shouldExportTurso({ ciPublicSafe: true, hasTursoCreds: true, hasEncryptionKey: false }),
      false,
    );
    assert.equal(
      shouldExportTurso({ ciPublicSafe: true, hasTursoCreds: true, hasEncryptionKey: true }),
      true,
    );
    assert.equal(
      shouldExportTurso({ ciPublicSafe: false, hasTursoCreds: false, hasEncryptionKey: true }),
      false,
    );
    assert.equal(EXCLUDED_TURSO_TABLES.has('oauth_tokens'), true);
    assert.equal(EXCLUDED_TURSO_TABLES.has('rate_limits'), true);
  });
});
