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

    // 1. Verify cron secret to protect the endpoint
    if (!configuredSecret || secret !== configuredSecret) {
      return NextResponse.json({ error: 'Unauthorized secret key' }, { status: 401 });
    }

    console.log('--- Calls Analysis Pipeline Triggered ---');

    // 2. Fetch valid AmoCRM token
    let accessToken: string;
    try {
      accessToken = await getValidAccessToken();
    } catch (tokenError: any) {
      console.error('Firestore token fetch failed for call processing:', tokenError);
      return NextResponse.json({ error: 'Failed to retrieve AmoCRM token from Firestore' }, { status: 500 });
    }

    // 3. Fetch latest 15 leads with contacts embedded
    const leadsRes = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads?limit=15&with=contacts`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (leadsRes.status === 204) {
      return NextResponse.json({ message: 'No leads found to process' }, { status: 200 });
    }

    if (!leadsRes.ok) {
      const errText = await leadsRes.text();
      return NextResponse.json({ error: `AmoCRM leads API failed: ${errText}` }, { status: leadsRes.status });
    }

    const leadsData = await leadsRes.json();
    const leads = leadsData._embedded?.leads || [];
    const processedLeads: any[] = [];

    console.log(`Analyzing ${leads.length} latest leads for call recordings...`);

    for (const lead of leads) {
      const contacts = lead._embedded?.contacts || [];
      let callNotes: any[] = [];
      let hasSummaryAlready = false;

      const leadNotesRes = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/${lead.id}/notes`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (leadNotesRes.status === 200) {
        const leadNotesData = await leadNotesRes.json();
        const notes = leadNotesData._embedded?.notes || [];
        for (const note of notes) {
          if (note.note_type === 'common' && note.params?.text && note.params.text.includes('📞 MUHOKAMA XULOSASI')) {
            hasSummaryAlready = true;
            break;
          }
        }
      }

      if (hasSummaryAlready) {
        console.log(`Lead ID ${lead.id} already has a call summary. Skipping...`);
        continue;
      }

      for (const contact of contacts) {
        const contactNotesRes = await fetch(`https://${subdomain}.amocrm.ru/api/v4/contacts/${contact.id}/notes`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (contactNotesRes.status === 200) {
          const notesData = await contactNotesRes.json();
          const notes = notesData._embedded?.notes || [];
          for (const note of notes) {
            if ((note.note_type === 'call_in' || note.note_type === 'call_out') && note.params?.link) {
              callNotes.push({
                noteId: note.id,
                phone: note.params.phone,
                duration: note.params.duration,
                direction: note.note_type === 'call_in' ? 'Kiruvchi' : 'Chiquvchi',
                link: note.params.link
              });
            }
          }
        }
      }

      if (callNotes.length === 0) {
        continue;
      }

      console.log(`Lead ID ${lead.id} ("${lead.name}") has ${callNotes.length} call recording(s). Processing...`);

      const latestCall = callNotes[callNotes.length - 1];

      try {
        const audioRes = await fetch(latestCall.link);
        if (!audioRes.ok) {
          console.error(`Failed to download audio for Lead ID ${lead.id}: ${audioRes.status}`);
          continue;
        }

        const audioBuffer = Buffer.from(await audioRes.arrayBuffer());

        console.log(`Sending call recording to Gemini 1.5 Flash for Lead ID ${lead.id}...`);
        const analysis = await analyzeCallAudio(audioBuffer, 'audio/mp3');

        console.log(`Gemini analysis completed for Lead ID ${lead.id}. Category: ${analysis.category}`);

        const noteText = `📞 MUHOKAMA XULOSASI (${analysis.category}):\n\n${analysis.summary}\n\n📝 TO'LIQ TRANSKRIPT:\n"""\n${analysis.transcript}\n"""\n\n📌 Tahlil qilingan sana: ${new Date().toLocaleString('uz-UZ')}`;

        const noteWriteRes = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/${lead.id}/notes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([
            {
              note_type: 'common',
              params: {
                text: noteText
              }
            }
          ])
        });

        const tagUpdateRes = await fetch(`https://${subdomain}.amocrm.ru/api/v4/leads/${lead.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: lead.id,
            tags_to_add: [
              { name: analysis.category }
            ]
          })
        });

        processedLeads.push({
          leadId: lead.id,
          leadName: lead.name,
          category: analysis.category,
          noteStatus: noteWriteRes.status,
          tagStatus: tagUpdateRes.status
        });

        console.log(`✅ Lead ID ${lead.id} processed successfully!`);

      } catch (processingError: any) {
        console.error(`Error processing call for Lead ID ${lead.id}:`, processingError.message);
      }
    }

    return NextResponse.json({
      message: 'Calls analysis process completed',
      processedLeadsCount: processedLeads.length,
      processedLeads
    }, { status: 200 });

  } catch (error: any) {
    console.error('Call processing fatal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
