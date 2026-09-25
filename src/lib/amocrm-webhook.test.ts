import { describe, expect, it } from 'vitest';
import { amoCrmLeadUrl, escapeTelegramHtml, parseBracketForm, readWebhookBody } from './amocrm-webhook';

describe('parseBracketForm', () => {
  it('turns amoCRM form fields into the same shape as the JSON payload', () => {
    const params = new URLSearchParams(
      'leads[status][0][id]=555&leads[status][0][status_id]=142&leads[status][1][id]=556&account[subdomain]=jon',
    );
    expect(parseBracketForm(params)).toEqual({
      leads: { status: [{ id: '555', status_id: '142' }, { id: '556' }] },
      account: { subdomain: 'jon' },
    });
  });

  it('ignores prototype-polluting keys', () => {
    const parsed = parseBracketForm(new URLSearchParams('__proto__[polluted]=1&a[constructor][x]=1'));
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(parsed).toEqual({});
  });
});

describe('readWebhookBody', () => {
  it('reads form-urlencoded bodies sent by amoCRM itself', async () => {
    const request = new Request('http://x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'leads[add][0][id]=7&leads[add][0][name]=Test',
    });
    expect(await readWebhookBody(request)).toEqual({ leads: { add: [{ id: '7', name: 'Test' }] } });
  });

  it('still reads JSON bodies from relays such as n8n', async () => {
    const request = new Request('http://x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: { status: [{ id: 1 }] } }),
    });
    expect(await readWebhookBody(request)).toEqual({ leads: { status: [{ id: 1 }] } });
  });
});

describe('telegram helpers', () => {
  it('escapes HTML special characters', () => {
    expect(escapeTelegramHtml('<b>A & B</b>')).toBe('&lt;b&gt;A &amp; B&lt;/b&gt;');
  });

  it('builds a lead link from a subdomain or a full domain', () => {
    expect(amoCrmLeadUrl(5, 'jonbranding')).toBe('https://jonbranding.amocrm.ru/leads/detail/5');
    expect(amoCrmLeadUrl('5', 'https://jon.kommo.com/')).toBe('https://jon.kommo.com/leads/detail/5');
    expect(amoCrmLeadUrl(5, undefined)).toBeNull();
  });
});
