#!/usr/bin/env bash
# Reels Zavodi harness tekshiruvi. Har bir vazifani "review"ga o'tkazishdan oldin ishga tushiriladi.
set -euo pipefail
cd "$(dirname "$0")/../.."

echo "▶ feature_list.json sintaksisi"
node -e "const f=require('./docs/reels-factory/feature_list.json');
const ids=new Set(f.features.map(x=>x.id));
for (const x of f.features){
  for (const d of x.deps||[]) if(!ids.has(d)) throw new Error(x.id+': noma\'lum dep '+d);
  if (x.status==='done' && !x.evidence) throw new Error(x.id+': done, lekin evidence yo\'q');
}
const wip=f.features.filter(x=>x.status==='in_progress');
const owners=wip.map(x=>x.owner); if(new Set(owners).size!==owners.length) throw new Error('Bitta agentda 2+ in_progress');
console.log('  ok:', f.features.length, 'vazifa,', wip.length, 'in_progress');"

echo "▶ case-reels typecheck"
( cd services/case-reels && { [ -d node_modules ] || npm ci --no-audit --no-fund; } && npx tsc --noEmit )

if [ -f services/case-reels/vitest.config.ts ] || ls services/case-reels/scripts/*.test.ts >/dev/null 2>&1; then
  echo "▶ case-reels testlar"
  ( cd services/case-reels && npx vitest run )
fi

echo "▶ sayt tezkor harness"
npm run -s verify:fast

echo "✅ reels-factory verify o'tdi"
