import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-14',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function run() {
  try {
    await client.delete('hJHhLJbyZKMyFfwQLdOSBL');
    console.log('Deleted Azamat Muxammedov');
    await client.delete('hJHhLJbyZKMyFfwQLdOSTn');
    console.log('Deleted Akrom Raxmonov');
  } catch (error) {
    console.error("Deletion failed:", error);
  }
}
run();
