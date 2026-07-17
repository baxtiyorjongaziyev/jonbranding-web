import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/integrations/firebase';
import {
  INSTAGRAM_OAUTH_STATE_COOKIE,
  isValidInstagramOAuthState,
} from '@/lib/instagram-oauth';

function finishOAuthResponse(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.cookies.set(INSTAGRAM_OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/instagram/callback',
    maxAge: 0,
  });
  return response;
}

function oauthError(message: string, status: number) {
  return finishOAuthResponse(NextResponse.json({ error: message }, { status }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnedState = searchParams.get('state');
  const storedState = request.cookies.get(INSTAGRAM_OAUTH_STATE_COOKIE)?.value;

  if (!isValidInstagramOAuthState(returnedState, storedState)) {
    return oauthError('Invalid or expired OAuth state.', 400);
  }

  const providerError = searchParams.get('error');
  const code = searchParams.get('code');

  if (providerError) {
    return oauthError('Instagram authorization was not completed.', 400);
  }

  if (!code) {
    return oauthError('No authorization code provided.', 400);
  }

  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID?.trim();
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET?.trim();
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI?.trim();

  if (!clientId || !clientSecret || !redirectUri) {
    return oauthError('Instagram OAuth server configuration is incomplete.', 503);
  }

  try {
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code);

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(10_000),
    });

    if (!tokenResponse.ok) {
      console.error('[Instagram Callback] Short-lived token exchange failed:', tokenResponse.status);
      return oauthError('Failed to exchange the Instagram authorization code.', 400);
    }

    const shortTokenData = await tokenResponse.json() as Record<string, unknown>;
    const shortLivedToken =
      typeof shortTokenData.access_token === 'string' ? shortTokenData.access_token : '';

    if (!shortLivedToken) {
      return oauthError('Instagram returned an invalid short-lived token.', 502);
    }

    const longLivedUrl = new URL('https://graph.instagram.com/access_token');
    longLivedUrl.searchParams.set('grant_type', 'ig_exchange_token');
    longLivedUrl.searchParams.set('client_secret', clientSecret);
    longLivedUrl.searchParams.set('access_token', shortLivedToken);

    const longLivedResponse = await fetch(longLivedUrl, {
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });

    if (!longLivedResponse.ok) {
      console.error('[Instagram Callback] Long-lived token exchange failed:', longLivedResponse.status);
      return oauthError('Failed to exchange the long-lived Instagram token.', 400);
    }

    const longTokenData = await longLivedResponse.json() as Record<string, unknown>;
    const longLivedToken =
      typeof longTokenData.access_token === 'string' ? longTokenData.access_token : '';
    const expiresInSeconds = Number(longTokenData.expires_in);

    if (!longLivedToken || !Number.isFinite(expiresInSeconds) || expiresInSeconds <= 0) {
      return oauthError('Instagram returned an invalid long-lived token.', 502);
    }

    const now = Date.now();
    const db = getDb();
    await db.collection('settings').doc('instagram').set(
      {
        accessToken: longLivedToken,
        expiresAt: now + expiresInSeconds * 1000,
        updatedAt: now,
      },
      { merge: true },
    );

    console.log('[Instagram Callback] Long-lived token saved successfully.');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Instagram Connected</title>
        <style>
          body { font-family: -apple-system, sans-serif; text-align: center; padding: 50px; background: #fafafa; }
          .card { background: white; padding: 30px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h1 { color: #E1306C; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Instagram connected!</h1>
          <p>Your Instagram account has been successfully linked to <b>Jon Branding</b>.</p>
          <p>You can close this tab now.</p>
        </div>
      </body>
      </html>
    `;

    return finishOAuthResponse(new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }));
  } catch (error) {
    console.error('[Instagram Callback] OAuth exchange failed:', error);
    return oauthError('Instagram connection failed.', 500);
  }
}
