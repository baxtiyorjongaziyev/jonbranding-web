// Menejer patent kalkulyatori: hisob-kitobni mijozga yuborish uchun PNG rasm.
// Tashqi kutubxonasiz — to'g'ridan-to'g'ri Canvas'da chiziladi.

export type EstimateSection = {
  title: string;
  rows: [string, number][];
  total: [string, number];
};

export type EstimateImageData = {
  title: string;
  client: string;
  brand: string;
  meta: string;
  totalTitle: string;
  total: string;
  currency: string;
  sections: EstimateSection[];
  footer: string;
  fileName: string;
};

const W = 1080;
const PAD = 64;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const INK = '#0f172a';
const MUTED = '#64748b';
const PRIMARY = '#1d4ed8';

const money = (n: number, cur: string) => `${Number(n).toLocaleString('fr-FR')} ${cur}`;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function draw(ctx: CanvasRenderingContext2D | null, d: EstimateImageData): number {
  // ctx === null — faqat balandlikni o'lchash uchun yurish.
  const measure = document.createElement('canvas').getContext('2d')!;
  const c = ctx ?? measure;
  let y = 0;

  // Sarlavha bloki
  const headerH = 360 + (d.client ? 40 : 0) + (d.brand ? 40 : 0);
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, W, headerH);
    g.addColorStop(0, PRIMARY);
    g.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, headerH);
    ctx.fillStyle = '#fff';
    ctx.font = `800 34px ${FONT}`;
    ctx.fillText('JON.BRANDING', PAD, 88);
    ctx.font = `500 26px ${FONT}`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(d.title, PAD, 136);
    ctx.globalAlpha = 1;
  }
  y = 136;
  for (const line of [d.client, d.brand].filter(Boolean)) {
    y += 40;
    if (ctx) {
      ctx.font = `600 28px ${FONT}`;
      ctx.fillText(line, PAD, y);
    }
  }
  if (ctx) {
    ctx.font = `500 24px ${FONT}`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(d.totalTitle, PAD, y + 64);
    ctx.globalAlpha = 1;
    ctx.font = `800 72px ${FONT}`;
    ctx.fillText(d.total, PAD, y + 144);
    ctx.font = `500 24px ${FONT}`;
    ctx.globalAlpha = 0.85;
    ctx.fillText(d.meta, PAD, y + 188);
    ctx.globalAlpha = 1;
  }
  y = headerH + 56;

  // Bosqichlar
  for (const s of d.sections) {
    if (ctx) {
      ctx.fillStyle = PRIMARY;
      ctx.font = `700 28px ${FONT}`;
      ctx.fillText(s.title, PAD, y);
    }
    y += 16;
    for (const [label, value] of [...s.rows, s.total]) {
      const isTotal = label === s.total[0] && value === s.total[1];
      y += 46;
      if (ctx) {
        ctx.fillStyle = isTotal ? INK : MUTED;
        ctx.font = `${isTotal ? 700 : 500} 26px ${FONT}`;
        ctx.textAlign = 'left';
        ctx.fillText(label, PAD, y);
        ctx.fillStyle = INK;
        ctx.textAlign = 'right';
        ctx.fillText(money(value, d.currency), W - PAD, y);
        ctx.textAlign = 'left';
        if (isTotal) {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(PAD, y - 38, W - PAD * 2, 2);
        }
      }
    }
    y += 64;
  }

  // Izoh
  c.font = `400 22px ${FONT}`;
  const lines = wrap(c, d.footer, W - PAD * 2);
  for (const line of lines) {
    if (ctx) {
      ctx.fillStyle = MUTED;
      ctx.fillText(line, PAD, y);
    }
    y += 32;
  }
  y += 16;
  if (ctx) {
    ctx.fillStyle = PRIMARY;
    ctx.font = `700 24px ${FONT}`;
    ctx.fillText('jonbranding.uz', PAD, y);
  }
  return y + PAD;
}

export function downloadEstimateImage(d: EstimateImageData) {
  const height = draw(null, d);
  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, height);
  draw(ctx, d);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = d.fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}
