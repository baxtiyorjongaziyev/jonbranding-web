import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/amocrm-token';
import { analyzeCallAudio } from '@/lib/gemini';

const TOKENS_DOC = 'amocrm/website_tokens';
const subdomain = 'jonbrandingagency';

function cleanSecret(value: string | undefined) {
  return String(value || '').replace(/^﻿/, '').trim();
}

export async function GET(request: Request) {
  return handleCallProcessing(request);
}

export async function POST(request: Request) {
  return handleCallProcessing(request);
}

async function handleCallProcessing(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const configuredSecret = cleanSecret(process.env.AMOCRM_CRON_SECRET);

    if (!configuredSecret || secret !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized secret key' }, { status: 401 });
    }
