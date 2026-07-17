import { NextRequest, NextResponse } from 'next/server';
import {
  createInstagramOAuthState,
  INSTAGRAM_OAUTH_STATE_COOKIE,
  INSTAGRAM_OAUTH_STATE_TTL_SECONDS,
  isInstagramOAuthAdmin,
} from '@/lib/instagram-oauth';

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID?.trim();
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI?.trim();
  const adminSecret = process.env.INSTAGRAM_OAUTH_ADMIN_SECRET?.trim();

  if (!clientId || !redirectUri || !adminSecret) {
    return NextResponse.json(
      { error: 'Instagram OAuth server configuration is incomplete.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (!isInstagramOAuthAdmin(request, adminSecret)) {
    return NextResponse.json(
      { error: 'Admin authentication required.' },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store',
          'WWW-Authenticate': 'Basic realm="Instagram OAuth", charset="UTF-8"',
        },
      },
    );
  }

  const state = createInstagramOAuthState();
  const authorizationUrl = new URL('https://api.instagram.com/oauth/authorize');
  authorizationUrl.searchParams.set('client_id', clientId);
  authorizationUrl.searchParams.set('redirect_uri', redirectUri);
  authorizationUrl.searchParams.set('scope', 'user_profile,user_media');
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizationUrl);
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(INSTAGRAM_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/instagram/callback',
    maxAge: INSTAGRAM_OAUTH_STATE_TTL_SECONDS,
  });
  return response;
}
