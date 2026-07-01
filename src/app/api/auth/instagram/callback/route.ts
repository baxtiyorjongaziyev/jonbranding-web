import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/integrations/firebase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: `Auth failed: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'OAuth credentials not set in env' }, { status: 500 });
  }

  try {
    // 1. Exchange authorization code for a short-lived access token
    const tokenUrl = 'https://api.instagram.com/oauth/access_token';
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', redirectUri);
    formData.append('code', code);

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: formData,
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('[Instagram Callback] Exchange short-lived token error:', errText);
      return NextResponse.json({ error: 'Failed to exchange code for short-lived token', details: errText }, { status: 400 });
    }

    const shortTokenData = await tokenResponse.json();
    const shortLivedToken = shortTokenData.access_token;

    // 2. Exchange short-lived token for a long-lived (60 days) access token
    const longLivedUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedToken}`;
    const longLivedResponse = await fetch(longLivedUrl);

    if (!longLivedResponse.ok) {
      const errText = await longLivedResponse.text();
      console.error('[Instagram Callback] Exchange long-lived token error:', errText);
      return NextResponse.json({ error: 'Failed to exchange for long-lived token', details: errText }, { status: 400 });
    }

    const longTokenData = await longLivedResponse.json();
    const longLivedToken = longTokenData.access_token;
    const expiresInSeconds = longTokenData.expires_in; // Normally 5184000 (60 days)

    // 3. Save the token to Firebase Firestore
    const db = getDb();
    await db.collection('settings').doc('instagram').set({
      accessToken: longLivedToken,
      expiresAt: Date.now() + (expiresInSeconds * 1000),
      updatedAt: Date.now(),
    });

    console.log('[Instagram Callback] Long-lived token saved to Firebase Firestore successfully');

    // 4. Return success HTML page
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
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

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (err: any) {
    console.error('[Instagram Callback] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error during token exchange', details: err.message }, { status: 500 });
  }
}
