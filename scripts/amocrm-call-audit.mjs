import { execFileSync, execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PROJECT_ID = 'jonbranding-85662071-ea38e';
const FIRESTORE_DB = 'ai-studio-cab24ca1-84fa-4f82-b5cb-5ab2ebac8a44';
const AMO_HOST = 'jonbrandingagency.amocrm.ru';
const MARKER = 'AI_CALL_ANALYSIS';
const CATEGORY_TAGS = new Set(['Mijoz', 'Jamoa', 'Shaxsiy', 'Oila', 'Boshqa']);
const MAX_INLINE_AUDIO_BYTES = 18 * 1024 * 1024;

const args = new Set(process.argv.slice(2));
const getArg = (name, fallback) => {
  const prefix = `${name}=`;
  const item = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
};

const LIMIT = Number(getArg('--limit', '10'));
const MAX_RECORDINGS = Number(getArg('--max-recordings', '0'));
const WRITE = args.has('--write');
const INCLUDE_TRANSCRIPT = args.has('--include-transcript');
const STT_PROVIDER = getArg('--stt', args.has('--gemini-audio') ? 'gemini-audio' : 'openrouter');
const WHISPER_MODEL = getArg('--whisper-model', 'base');
const GOOGLE_STT_LOCATION = getArg('--google-stt-location', 'us');
const GOOGLE_STT_MODEL = getArg('--google-stt-model', 'chirp_3');
const GOOGLE_STT_LANGUAGES = getArg('--google-stt-languages', 'uz-UZ')
  .split(',')
  .map((language) => language.trim())
  .filter(Boolean);
const GOOGLE_STT_SYNC_LIMIT_SECONDS = Number(getArg('--google-stt-sync-limit-seconds', '59'));
const GOOGLE_STT_BUCKET = getArg('--google-stt-bucket', 'jonbranding-85662071-ea38e-n8n-data');
const GOOGLE_STT_GCS_PREFIX = getArg('--google-stt-gcs-prefix', 'amocrm-call-audit');
const GOOGLE_STT_BATCH_TIMEOUT_MS = Number(getArg('--google-stt-batch-timeout-ms', '600000'));
const GOOGLE_STT_BATCH_POLL_MS = Number(getArg('--google-stt-batch-poll-ms', '5000'));
const GOOGLE_STT_FORCE_BATCH = args.has('--google-stt-force-batch');

function shellQuote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function run(command, args) {
  const cmd = [command, ...args.map(shellQuote)].join(' ');
  return execSync(cmd, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).replace(/^\uFEFF/, '').trim();
}

function secret(name) {
  try {
    return run('gcloud', [
      'secrets',
      'versions',
      'access',
      'latest',
      `--secret=${name}`,
      `--project=${PROJECT_ID}`,
    ]);
  } catch {
    return '';
  }
}

function firestoreValue(field) {
  if (!field) return null;
  return field.stringValue ?? field.integerValue ?? field.doubleValue ?? field.booleanValue ?? null;
}

async function readFirestoreToken() {
  const gcpAccessToken = run('gcloud', ['auth', 'print-access-token']);
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${FIRESTORE_DB}/documents/amocrm/website_tokens`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${gcpAccessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Firestore token read failed: ${response.status}`);
  }
  const doc = await response.json();
  const fields = doc.fields || {};
  return {
    access_token: firestoreValue(fields.access_token),
    refresh_token: firestoreValue(fields.refresh_token),
    expires_at: Number(firestoreValue(fields.expires_at) || 0),
  };
}

async function writeFirestoreToken(tokenData) {
  const gcpAccessToken = run('gcloud', ['auth', 'print-access-token']);
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${FIRESTORE_DB}/documents/amocrm/website_tokens`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${gcpAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        access_token: { stringValue: tokenData.access_token },
        refresh_token: { stringValue: tokenData.refresh_token },
        expires_at: { integerValue: String(tokenData.expires_at) },
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Firestore token write failed: ${response.status}`);
  }
}

async function refreshAmoToken(current) {
  const clientId = secret('AMOCRM_CLIENT_ID');
  const clientSecret = secret('AMOCRM_CLIENT_SECRET');
  const redirectUri = secret('AMOCRM_REDIRECT_URI') || secret('AMOCRM_REDIRECT_URL');
  if (!clientId || !clientSecret || !redirectUri || !current.refresh_token) {
    throw new Error('AmoCRM refresh credentials are missing');
  }

  const response = await fetch(`https://${AMO_HOST}/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: current.refresh_token,
      redirect_uri: redirectUri,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`AmoCRM refresh failed: ${response.status} ${body.slice(0, 200)}`);
  }
  const fresh = JSON.parse(body);
  const tokenData = {
    access_token: fresh.access_token,
    refresh_token: fresh.refresh_token,
    expires_at: Date.now() + Number(fresh.expires_in || 86400) * 1000,
  };
  await writeFirestoreToken(tokenData);
  return tokenData;
}

async function getAmoToken() {
  let tokenData = await readFirestoreToken();
  if (!tokenData.access_token || tokenData.expires_at < Date.now() + 5 * 60 * 1000) {
    tokenData = await refreshAmoToken(tokenData);
  }
  return tokenData.access_token;
}

async function amoFetch(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `https://${AMO_HOST}${pathOrUrl}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${await getAmoToken()}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!response.ok) {
    throw new Error(`AmoCRM ${response.status}: ${(json?.detail || json?.title || text).slice(0, 220)}`);
  }
  return json;
}

async function getLeads(limit) {
  const leads = [];
  let page = 1;
  while (leads.length < limit) {
    const data = await amoFetch(`/api/v4/leads?limit=${Math.min(50, limit - leads.length)}&page=${page}&with=contacts`);
    const batch = data?._embedded?.leads || [];
    leads.push(...batch);
    if (!data?._links?.next?.href || !batch.length) break;
    page += 1;
  }
  return leads.slice(0, limit);
}

async function getNotes(entityType, entityId) {
  const notes = [];
  let page = 1;
  while (true) {
    const data = await amoFetch(`/api/v4/${entityType}/${entityId}/notes?limit=250&page=${page}`);
    const batch = data?._embedded?.notes || [];
    notes.push(...batch);
    if (!data?._links?.next?.href || !batch.length) break;
    page += 1;
  }
  return notes;
}

function isAnalyzed(leadNotes, callId) {
  return leadNotes.some((note) => {
    const text = String(note?.params?.text || '');
    return text.includes(MARKER) && text.includes(`Call ID: ${callId}`);
  });
}

function extractCallNotes(notes) {
  return notes
    .filter((note) => ['call_in', 'call_out', 'call'].includes(note.note_type))
    .map((note) => {
      const params = note.params || {};
      return {
        noteId: note.id,
        callId: String(params.uniq || note.id),
        type: note.note_type,
        phone: params.phone || '',
        duration: Number(params.duration || 0),
        link: params.link || params.file_url || params.attachment?.link || '',
        createdAt: Number(note.created_at || 0),
      };
    })
    .filter((call) => call.duration > 0 && call.link);
}

async function downloadAudio(url) {
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${await getAmoToken()}` },
  });
  if (!response.ok) response = await fetch(url);
  if (!response.ok) throw new Error(`Audio download failed: ${response.status}`);
  const contentType = response.headers.get('content-type') || 'audio/mpeg';
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) throw new Error('Audio download returned empty file');
  if (buffer.length > MAX_INLINE_AUDIO_BYTES) {
    throw new Error(`Audio file too large for inline Gemini request: ${buffer.length} bytes`);
  }
  return { buffer, contentType };
}

function parseGeminiJson(text) {
  const trimmed = String(text || '').trim();
  const cleaned = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

function audioExtension(contentType) {
  const type = String(contentType || '').toLowerCase();
  if (type.includes('wav')) return '.wav';
  if (type.includes('ogg')) return '.ogg';
  if (type.includes('mpeg') || type.includes('mp3')) return '.mp3';
  if (type.includes('mp4') || type.includes('m4a')) return '.m4a';
  return '.mp3';
}

async function transcribeWithWhisper(buffer, contentType) {
  const dir = await mkdtemp(join(tmpdir(), 'jonbranding-call-'));
  const audioPath = join(dir, `recording${audioExtension(contentType)}`);
  await writeFile(audioPath, buffer);

  const code = `
import json
import sys
from faster_whisper import WhisperModel

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

audio_path = sys.argv[1]
model_name = sys.argv[2]
model = WhisperModel(model_name, device="cpu", compute_type="int8")
segments, info = model.transcribe(audio_path, beam_size=5, vad_filter=True)
text = " ".join(segment.text.strip() for segment in segments if segment.text.strip())
print(json.dumps({"language": info.language, "text": text}, ensure_ascii=True))
`;

  try {
    const output = execFileSync('python', ['-c', code, audioPath, WHISPER_MODEL], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 20 * 1024 * 1024,
    });
    const result = JSON.parse(output.trim());
    if (!result.text) throw new Error('Whisper returned empty transcript');
    return result;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function analyzeTranscriptWithOpenRouter(transcript, call, lead) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://openrouter.ai/api').replace(/\/$/, '');
  if (!apiKey) throw new Error('OpenRouter key is missing in ANTHROPIC_API_KEY');

  const prompt = `
Quyidagi telefon suhbat transkriptini tahlil qil. Transkript avtomatik STTdan olingan, xatolar bo'lishi mumkin.

Kategoriyalar:
- Mijoz: mijoz, lead, savdo, loyiha, brending/dizayn/web/marketing xizmati
- Jamoa: ichki ish, xodim, vazifa, loyiha koordinatsiyasi
- Oila: oila, uy, farzand, qarindosh
- Shaxsiy: do'st, tanish, shaxsiy suhbat
- Boshqa: noaniq yoki yuqoridagilarga tushmaydi

Lead konteksti:
ID: ${lead.id}
Nomi: ${lead.name}
Telefon: ${call.phone}
Davomiylik: ${call.duration} sekund

Transkript:
${transcript}

Faqat valid JSON qaytar:
{
  "category": "Mijoz | Jamoa | Oila | Shaxsiy | Boshqa",
  "summary_uz": "2-4 gapli o'zbekcha xulosa",
  "next_steps_uz": "aniq keyingi qadamlar yoki CRMdan ajratish tavsiyasi",
  "mood": "Positive | Neutral | Negative | N/A",
  "transcript_uz": "transkriptni o'zbek tilida tozalangan shakli; ruscha bo'lsa tarjima qil",
  "confidence": 0.0
}`;

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jonbranding.uz',
      'X-Title': 'JonBranding CRM Call Audit',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const content = data?.choices?.[0]?.message?.content || '';
  const analysis = parseGeminiJson(content);
  const category = CATEGORY_TAGS.has(analysis.category) ? analysis.category : 'Boshqa';
  return { ...analysis, category };
}

async function transcribeWithOpenRouter(buffer, contentType) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://openrouter.ai/api').replace(/\/$/, '');
  if (!apiKey) throw new Error('OpenRouter key is missing in ANTHROPIC_API_KEY');

  const format = audioExtension(contentType).slice(1).replace('m4a', 'mp4') || 'mp3';
  const response = await fetch(`${baseUrl}/v1/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://jonbranding.uz',
      'X-Title': 'JonBranding CRM Call Audit',
    },
    body: JSON.stringify({
      model: 'openai/whisper-large-v3',
      input_audio: {
        data: buffer.toString('base64'),
        format,
      },
    }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || JSON.stringify(data);
    throw new Error(`OpenRouter STT ${response.status}: ${message}`);
  }
  if (!data?.text) throw new Error('OpenRouter STT returned empty transcript');
  return { language: 'auto', text: data.text };
}

function googleSpeechBaseUrl() {
  if (GOOGLE_STT_LOCATION === 'global') return 'https://speech.googleapis.com/v2';
  return `https://${GOOGLE_STT_LOCATION}-speech.googleapis.com/v2`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function googleSpeechPost(resource, body) {
  const accessToken = run('gcloud', ['auth', 'print-access-token']);
  const response = await fetch(`${googleSpeechBaseUrl()}/${resource}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || JSON.stringify(data);
    throw new Error(`Google STT ${response.status}: ${message}`);
  }
  return data;
}

async function googleSpeechGet(resource) {
  const accessToken = run('gcloud', ['auth', 'print-access-token']);
  const response = await fetch(`${googleSpeechBaseUrl()}/${resource}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || JSON.stringify(data);
    throw new Error(`Google STT operation ${response.status}: ${message}`);
  }
  return data;
}

function googleRecognitionConfig() {
  return {
    autoDecodingConfig: {},
    languageCodes: GOOGLE_STT_LANGUAGES,
    model: GOOGLE_STT_MODEL,
    features: {
      enableAutomaticPunctuation: true,
    },
  };
}

function googleTranscriptFromResults(data) {
  const results = data?.results || [];
  const text = results
    .map((result) => result?.alternatives?.[0]?.transcript || '')
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const language = results.find((result) => result?.languageCode)?.languageCode || GOOGLE_STT_LANGUAGES[0] || 'auto';
  return { language, text };
}

function googleRecognizer() {
  return `projects/${PROJECT_ID}/locations/${GOOGLE_STT_LOCATION}/recognizers/_`;
}

async function transcribeWithGoogleSync(buffer) {
  const data = await googleSpeechPost(`${googleRecognizer()}:recognize`, {
    config: googleRecognitionConfig(),
    configMask: '*',
    content: buffer.toString('base64'),
  });

  const transcript = googleTranscriptFromResults(data);
  if (!transcript.text) throw new Error('Google STT returned empty transcript');
  return transcript;
}

async function uploadGoogleSttAudio(buffer, contentType) {
  if (!GOOGLE_STT_BUCKET) {
    throw new Error('Google STT batch uchun --google-stt-bucket kerak');
  }

  const dir = await mkdtemp(join(tmpdir(), 'jonbranding-google-stt-'));
  const fileName = `${randomUUID()}${audioExtension(contentType)}`;
  const audioPath = join(dir, fileName);
  const gcsUri = `gs://${GOOGLE_STT_BUCKET}/${GOOGLE_STT_GCS_PREFIX.replace(/^\/+|\/+$/g, '')}/${fileName}`;
  await writeFile(audioPath, buffer);

  try {
    run('gcloud', ['storage', 'cp', audioPath, gcsUri, `--project=${PROJECT_ID}`, '--quiet']);
    return {
      gcsUri,
      cleanup: async () => {
        try {
          run('gcloud', ['storage', 'rm', gcsUri, `--project=${PROJECT_ID}`, '--quiet']);
        } catch {
          // Temporary audio cleanup failure should not hide the STT result.
        }
        await rm(dir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    await rm(dir, { recursive: true, force: true });
    throw error;
  }
}

async function waitGoogleOperation(operationName) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < GOOGLE_STT_BATCH_TIMEOUT_MS) {
    const operation = await googleSpeechGet(operationName);
    if (operation.done) {
      if (operation.error) {
        throw new Error(`Google STT operation failed: ${operation.error.message || JSON.stringify(operation.error)}`);
      }
      return operation;
    }
    await sleep(GOOGLE_STT_BATCH_POLL_MS);
  }

  throw new Error(`Google STT batch timeout: ${Math.round(GOOGLE_STT_BATCH_TIMEOUT_MS / 1000)}s`);
}

function googleBatchTranscriptFromOperation(operation, gcsUri) {
  const fileResults = operation?.response?.results || {};
  const fileResult = fileResults[gcsUri] || Object.values(fileResults)[0];
  if (!fileResult) throw new Error('Google STT batch returned no file result');
  if (fileResult.error) {
    throw new Error(`Google STT file error: ${fileResult.error.message || JSON.stringify(fileResult.error)}`);
  }

  const transcriptPayload = fileResult.inlineResult?.transcript || fileResult.transcript;
  const transcript = googleTranscriptFromResults(transcriptPayload);
  if (!transcript.text) throw new Error('Google STT batch returned empty transcript');
  return transcript;
}

async function transcribeWithGoogleBatch(buffer, contentType) {
  const uploaded = await uploadGoogleSttAudio(buffer, contentType);
  try {
    const operation = await googleSpeechPost(`${googleRecognizer()}:batchRecognize`, {
      config: googleRecognitionConfig(),
      configMask: '*',
      files: [{ uri: uploaded.gcsUri }],
      recognitionOutputConfig: { inlineResponseConfig: {} },
    });
    if (!operation?.name) throw new Error('Google STT batch did not return operation name');
    const completed = await waitGoogleOperation(operation.name);
    return googleBatchTranscriptFromOperation(completed, uploaded.gcsUri);
  } finally {
    await uploaded.cleanup();
  }
}

async function transcribeWithGoogle(buffer, contentType, call) {
  if (!GOOGLE_STT_FORCE_BATCH && (!call?.duration || call.duration <= GOOGLE_STT_SYNC_LIMIT_SECONDS)) {
    return transcribeWithGoogleSync(buffer);
  }

  return transcribeWithGoogleBatch(buffer, contentType);
}
    body: JSON.stringify({
      config: googleRecognitionConfig(),
      configMask: '*',
      content: buffer.toString('base64'),
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.error?.message || JSON.stringify(data);
    throw new Error(`Google STT ${response.status}: ${message}`);
  }

  const transcript = googleTranscriptFromResults(data);
  if (!transcript.text) throw new Error('Google STT returned empty transcript');
  return transcript;
}

async function analyzeAudio(call, lead) {
  const { buffer, contentType } = await downloadAudio(call.link);

  if (STT_PROVIDER === 'openrouter') {
    const transcript = await transcribeWithOpenRouter(buffer, contentType);
    const analysis = await analyzeTranscriptWithOpenRouter(transcript.text, call, lead);
    return {
      ...analysis,
      detected_language: transcript.language,
      raw_transcript: transcript.text,
    };
  }

  if (STT_PROVIDER === 'google') {
    const transcript = await transcribeWithGoogle(buffer, call);
    const analysis = await analyzeTranscriptWithOpenRouter(transcript.text, call, lead);
    return {
      ...analysis,
      detected_language: transcript.language,
      raw_transcript: transcript.text,
    };
  }

  if (STT_PROVIDER === 'whisper') {
    const transcript = await transcribeWithWhisper(buffer, contentType);
    const analysis = await analyzeTranscriptWithOpenRouter(transcript.text, call, lead);
    return {
      ...analysis,
      detected_language: transcript.language,
      raw_transcript: transcript.text,
    };
  }

  if (STT_PROVIDER !== 'gemini-audio') {
    throw new Error(`Unknown STT provider: ${STT_PROVIDER}`);
  }

  const apiKey = secret('GEMINI_API_KEY') || secret('oisha-gemini-api-key');
  if (!apiKey) throw new Error('GEMINI_API_KEY secret is missing');
  const prompt = `
Telefon qo'ng'irog'i yozuvini tingla. Suhbat o'zbekcha, ruscha yoki aralash bo'lishi mumkin.
Vazifa:
1) Suhbatni o'zbek tilida transkript qil.
2) Suhbatni quyidagi kategoriyalardan biriga ajrat:
   - Mijoz: mijoz, lead, savdo, loyiha, brending/dizayn/web/marketing xizmati
   - Jamoa: ichki ish, xodim, vazifa, loyiha koordinatsiyasi
   - Oila: oila, uy, farzand, qarindosh
   - Shaxsiy: do'st, tanish, shaxsiy suhbat
   - Boshqa: noaniq yoki yuqoridagilarga tushmaydi
3) 2-4 gapli o'zbekcha xulosa yoz.
4) Keyingi qadamlarni yoz. Agar biznesga aloqasi bo'lmasa, "CRMdan ajratish / arxivlash" kabi tavsiya ber.
5) Kayfiyatni belgila.

Lead konteksti:
ID: ${lead.id}
Nomi: ${lead.name}
Telefon: ${call.phone}
Davomiylik: ${call.duration} sekund

Faqat valid JSON qaytar:
{
  "category": "Mijoz | Jamoa | Oila | Shaxsiy | Boshqa",
  "summary_uz": "...",
  "next_steps_uz": "...",
  "mood": "Positive | Neutral | Negative | N/A",
  "transcript_uz": "...",
  "confidence": 0.0
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: contentType.split(';')[0] || 'audio/mpeg',
                data: buffer.toString('base64'),
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.15,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`Gemini ${response.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
  const analysis = parseGeminiJson(text);
  const category = CATEGORY_TAGS.has(analysis.category) ? analysis.category : 'Boshqa';
  return { ...analysis, category };
}

function formatNote({ call, lead, analysis }) {
  const date = call.createdAt ? new Date(call.createdAt * 1000).toISOString().slice(0, 19).replace('T', ' ') : 'N/A';
  const transcript = INCLUDE_TRANSCRIPT
    ? `\n\nTranskript (UZ):\n${String(analysis.transcript_uz || '').slice(0, 4500)}`
    : '';

  return [
    `[${MARKER}] Call ID: ${call.callId}`,
    `Sdelka: ${lead.name} (#${lead.id})`,
    `Sana: ${date}`,
    `Telefon: ${call.phone || 'N/A'}`,
    `Davomiylik: ${call.duration}s`,
    `Toifa: ${analysis.category}`,
    `Kayfiyat: ${analysis.mood || 'N/A'}`,
    '',
    `Suhbat xulosasi: ${analysis.summary_uz || 'N/A'}`,
    '',
    `Keyingi qadamlar: ${analysis.next_steps_uz || 'N/A'}`,
    transcript,
  ].filter(Boolean).join('\n');
}

async function addLeadNote(leadId, text) {
  return amoFetch(`/api/v4/leads/${leadId}/notes`, {
    method: 'POST',
    body: JSON.stringify([{ note_type: 'common', params: { text } }]),
  });
}

async function addLeadTag(leadId, tagName) {
  return amoFetch(`/api/v4/leads/${leadId}`, {
    method: 'PATCH',
    body: JSON.stringify({ _embedded: { tags: [{ name: tagName }] } }),
  });
}

async function main() {
  const sttDetails =
    STT_PROVIDER === 'whisper'
      ? `:${WHISPER_MODEL}`
      : STT_PROVIDER === 'google'
        ? `:${GOOGLE_STT_MODEL}/${GOOGLE_STT_LOCATION}/${GOOGLE_STT_LANGUAGES.join('+')}`
        : '';
  console.log(`Mode=${WRITE ? 'WRITE' : 'DRY-RUN'} limit=${LIMIT} maxRecordings=${MAX_RECORDINGS || 'all'} includeTranscript=${INCLUDE_TRANSCRIPT} stt=${STT_PROVIDER}${sttDetails}`);
  const account = await amoFetch('/api/v4/account');
  console.log(`AmoCRM OK: ${account.name} (${account.subdomain})`);

  const leads = await getLeads(LIMIT);
  let recordingsFound = 0;
  let processed = 0;
  let skipped = 0;

  for (const lead of leads) {
    const leadNotes = await getNotes('leads', lead.id);
    const contactIds = (lead._embedded?.contacts || []).map((contact) => contact.id).filter(Boolean);
    const contactNotesNested = await Promise.all(contactIds.map((contactId) => getNotes('contacts', contactId)));
    const calls = extractCallNotes([...leadNotes, ...contactNotesNested.flat()]);

    if (!calls.length) {
      console.log(`- lead ${lead.id}: recording yo'q`);
      continue;
    }

    for (const call of calls) {
      if (MAX_RECORDINGS && processed + skipped >= MAX_RECORDINGS) break;
      recordingsFound += 1;
      if (isAnalyzed(leadNotes, call.callId)) {
        skipped += 1;
        console.log(`- lead ${lead.id} call ${call.callId}: oldin tahlil qilingan`);
        continue;
      }

      console.log(`- lead ${lead.id} call ${call.callId}: ${call.duration}s tahlil qilinyapti`);
      try {
        const analysis = await analyzeAudio(call, lead);
        const note = formatNote({ call, lead, analysis });
        console.log(`  => ${analysis.category} | ${String(analysis.summary_uz || '').slice(0, 160)}`);

        if (WRITE) {
          await addLeadNote(lead.id, note);
          await addLeadTag(lead.id, analysis.category);
          console.log(`  yozildi: note + tag ${analysis.category}`);
        }
        processed += 1;
      } catch (error) {
        skipped += 1;
        console.error(`  xato: ${error.message}`);
      }
    }

    if (MAX_RECORDINGS && processed + skipped >= MAX_RECORDINGS) break;
  }

  console.log(JSON.stringify({ leads_scanned: leads.length, recordings_found: recordingsFound, processed, skipped, write: WRITE }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
