import 'dotenv/config';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';

const API_ID = parseInt(process.env.TG_API_ID!, 10);
const API_HASH = process.env.TG_API_HASH!;

async function main() {
  if (!API_ID || !API_HASH) {
    console.error('TG_API_ID and TG_API_HASH must be set in .env');
    process.exit(1);
  }

  const session = new StringSession('');
  const client = new TelegramClient(session, API_ID, API_HASH, { connectionRetries: 3 });

  await client.start({
    phoneNumber: () => input.text('Phone number (+998...): '),
    password: () => input.text('2FA password (or Enter): '),
    phoneCode: () => input.text('SMS/app code: '),
    onError: (err) => console.error(err),
  });

  const sessionString = client.session.save() as unknown as string;
  console.log('\n✅ Session string (copy to TG_SESSION in .env):');
  console.log(sessionString);

  await client.disconnect();
}

main().catch(console.error);
