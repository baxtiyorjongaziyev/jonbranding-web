#!/usr/bin/env node

/**
 * Local Lead Capture Mock Runner
 * 
 * Usage:
 *   node scripts/harness/mock-lead.mjs [url]
 * Default url: http://localhost:9002/api/submit-form
 */

const targetUrl = process.argv[2] || 'http://localhost:9002/api/submit-form';

async function testLead() {
  console.log(`Sending test lead to: ${targetUrl}`);
  const payload = {
    fullName: 'Harness Smoke Test',
    phone: '+998901234567',
    telegram: 'harness_smoke',
    source: 'harness_cli',
    lang: 'uz',
    packageSummary: 'VIP Brending',
    totalPrice: 48000000,
  };

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const status = res.status;
    const data = await res.json().catch(() => null);

    console.log(`Response Status: ${status}`);
    console.log('Response Body:', JSON.stringify(data, null, 2));

    if (res.ok && data?.ok) {
      console.log('✓ Mock lead submission verified successfully!');
      process.exit(0);
    } else {
      console.error('✗ Lead submission failed or returned error');
      process.exit(1);
    }
  } catch (error) {
    console.error('Network / fetch error:', error.message);
    console.log('\nMake sure local dev server is running on port 9002 (npm run dev)');
    process.exit(1);
  }
}

testLead();
