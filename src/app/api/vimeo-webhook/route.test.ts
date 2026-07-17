import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { NextRequest } from 'next/server';
import { isAuthorizedVimeoWebhook } from './route';

describe('Vimeo webhook authentication', () => {
  it('fails closed when no server secret is configured', () => {
    const request = new NextRequest('https://example.com/api/vimeo-webhook');
    expect(isAuthorizedVimeoWebhook(request, '{}', '')).toBe(false);
  });

  it('accepts an exact HMAC-SHA256 signature over the raw body', () => {
    const body = JSON.stringify({ webhook_type: 'video-created', data: { video_uri: '/videos/1' } });
    const signature = createHmac('sha256', 'shared-secret').update(body).digest('hex');
    const request = new NextRequest('https://example.com/api/vimeo-webhook', {
      headers: { 'X-Webhook-Signature': signature },
    });
    expect(isAuthorizedVimeoWebhook(request, body, 'shared-secret')).toBe(true);
    expect(isAuthorizedVimeoWebhook(request, `${body} `, 'shared-secret')).toBe(false);
  });

  it('does not accept query-string or bearer secrets', () => {
    const queryOnlyRequest = new NextRequest('https://example.com/api/vimeo-webhook?secret=shared-secret');
    const bearerRequest = new NextRequest('https://example.com/api/vimeo-webhook', {
      headers: { Authorization: 'Bearer shared-secret' },
    });
    expect(isAuthorizedVimeoWebhook(queryOnlyRequest, '{}', 'shared-secret')).toBe(false);
    expect(isAuthorizedVimeoWebhook(bearerRequest, '{}', 'shared-secret')).toBe(false);
  });
});
