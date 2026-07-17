import { randomBytes } from 'node:crypto';
import { safeCompare } from '@/lib/security';

export const INSTAGRAM_OAUTH_STATE_COOKIE = 'instagram_oauth_state';
export const INSTAGRAM_OAUTH_STATE_TTL_SECONDS = 10 * 60;

function extractAdminSecret(authorization: string | null): string {
  if (!authorization) return '';

  if (/^Bearer\s+/i.test(authorization)) {
    return authorization.replace(/^Bearer\s+/i, '');
  }

  if (/^Basic\s+/i.test(authorization)) {
    try {
      const decoded = Buffer.from(authorization.replace(/^Basic\s+/i, ''), 'base64').toString('utf8');
      const separatorIndex = decoded.indexOf(':');
      return separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : '';
    } catch {
      return '';
    }
  }

  return '';
}

export function isInstagramOAuthAdmin(
  request: Request,
  configuredSecret = process.env.INSTAGRAM_OAUTH_ADMIN_SECRET?.trim() ?? '',
): boolean {
  if (!configuredSecret) return false;
  const providedSecret = extractAdminSecret(request.headers.get('authorization'));
  return Boolean(providedSecret) && safeCompare(providedSecret, configuredSecret);
}

export function createInstagramOAuthState(): string {
  return randomBytes(32).toString('base64url');
}

export function isValidInstagramOAuthState(
  returnedState: string | null,
  storedState: string | undefined,
): boolean {
  return Boolean(returnedState) && Boolean(storedState) && safeCompare(returnedState!, storedState!);
}
