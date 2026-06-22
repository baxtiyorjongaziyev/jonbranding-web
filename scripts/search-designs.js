const fs = require('fs');
const readline = require('readline');

async function search() {
  const fileStream = fs.createReadStream('C:/Users/baxti/.gemini/antigravity/brain/c34a5cd5-4d6f-4467-af28-406cd7d05604/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const matches = [];
  for await (const line of rl) {
    if (line.includes('"type":"USER_INPUT"')) {
      const json = JSON.parse(line);
      const content = json.content;
      if (content.match(/Atelier|Brutalist|Editorial|Immersive|Pro/i)) {
        matches.push(`[Step ${json.step_index}]: ${content}`);
      }
    }
  }

  fs.writeFileSync('C:/Users/baxti/.gemini/antigravity/brain/c34a5cd5-4d6f-4467-af28-406cd7d05604/scratch/design_matches.txt', matches.join('\n\n'));
  console.log(`Found ${matches.length} matches. Written to scratch/design_matches.txt`);
}

search();
