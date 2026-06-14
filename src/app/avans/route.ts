const HTML = `<!DOCTYPE html>
<html lang="uz" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JON BRANDING | Xavfsiz Avans Kalkulyatori</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: { jakarta: ['Plus Jakarta Sans', 'sans-serif'] },
          colors: {
            base:    '#0B0F17',
            card:    '#131A26',
            cardHov: '#1A2336',
            border:  '#1E2A3E',
            amber:   { DEFAULT: '#F5A623', light: '#FFD580', dark: '#C47D0A' },
            mint:    { DEFAULT: '#34D399', light: '#A7F3D0', dark: '#059669' },
            danger:  { DEFAULT: '#EF4444', light: '#FCA5A5', dark: '#991B1B' },
            muted:   '#6B7A99',
            subtle:  '#8A9AB8',
          },
        },
      },
    };
  <\/script>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0B0F17; color: #E2E8F0; }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    input[type=number] { -moz-appearance: textfield; }
    input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
      border-radius: 9999px; background: #1E2A3E; outline: none; cursor: pointer; }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 20px; height: 20px; border-radius: 50%;
      background: #F5A623; border: 3px solid #0B0F17;
      box-shadow: 0 0 0 2px #F5A623; cursor: pointer; transition: transform .15s; }
    input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
    input[type=range]::-moz-range-thumb {
      width: 20px; height: 20px; border-radius: 50%;
      background: #F5A623; border: 3px solid #0B0F17; cursor: pointer; }
    .amber-glow { box-shadow: 0 0 32px -4px rgba(245, 166, 35, 0.25); }
    .mint-glow  { box-shadow: 0 0 24px -4px rgba(52, 211, 153, 0.20); }
    .danger-glow{ box-shadow: 0 0 24px -4px rgba(239, 68, 68, 0.25); }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .fade-in { animation: fadeInDown .3s ease; }
    .field-input:focus { outline: none; border-color: #F5A623; box-shadow: 0 0 0 3px rgba(245,166,35,.15); }
  </style>
</head>
<body class="min-h-screen py-10 px-4">
  <header class="max-w-2xl mx-auto mb-10 flex items-center justify-between">
    <div>
      <div class="flex items-center gap-3 mb-1">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="7" fill="#F5A623"/>
          <path d="M7 20V10h4a3 3 0 0 1 0 6H7m10 4V10" stroke="#0B0F17" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-white font-extrabold tracking-widest text-sm uppercase">Jon Branding</span>
      </div>
      <h1 class="text-2xl md:text-3xl font-extrabold text-white leading-tight">
        Xavfsiz Avans <span class="text-amber">Kalkulyatori</span>
      </h1>
      <p class="text-muted text-sm mt-1">Xodimga avans berishdan oldin kassa xavfsizligini tekshiring</p>
    </div>
    <span class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber/10 text-amber border border-amber/20 whitespace-nowrap">
      <span class="w-2 h-2 rounded-full bg-amber animate-pulse"></span>
      Moliya Tizimi
    </span>
  </header>
  <main class="max-w-2xl mx-auto space-y-4">
    <section class="bg-card border border-border rounded-2xl p-6 space-y-5">
      <h2 class="text-xs font-bold uppercase tracking-widest text-muted mb-1">Kirish ma'lumotlari</h2>
      <div class="space-y-1.5">
        <label class="block text-sm font-semibold text-subtle" for="salary">
          Oylik sof maosh <span class="text-muted font-normal">(UZS)</span>
        </label>
        <div class="relative">
          <input id="salary" type="number" value="6000000" step="500000" min="0"
            class="field-input w-full bg-base border border-border rounded-xl px-4 py-3 pr-16 text-white font-semibold text-base transition-all duration-200" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">UZS</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-semibold text-subtle" for="totalDays">Jami ish kunlari</label>
          <input id="totalDays" type="number" value="22" min="1" max="31"
            class="field-input w-full bg-base border border-border rounded-xl px-4 py-3 text-white font-semibold text-base transition-all duration-200" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-semibold text-subtle" for="workedDays">Ishlab berilgan kunlar</label>
          <input id="workedDays" type="number" value="10" min="0"
            class="field-input w-full bg-base border border-border rounded-xl px-4 py-3 text-white font-semibold text-base transition-all duration-200" />
        </div>
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-semibold text-subtle" for="safety">Kassa xavfsizlik koeffitsiyenti</label>
          <span id="safetyLabel" class="px-2.5 py-0.5 rounded-lg bg-amber/15 text-amber text-sm font-bold border border-amber/20">75%</span>
        </div>
        <input id="safety" type="range" min="50" max="80" value="75" />
        <p class="text-xs text-muted">Kassa uzilishining oldini olish uchun <span class="text-subtle font-medium">70–75%</span> tavsiya etiladi.</p>
      </div>
      <div class="space-y-1.5">
        <label class="block text-sm font-semibold text-subtle" for="requested">
          Xodim so'rayotgan avans miqdori <span class="text-muted font-normal">(UZS)</span>
        </label>
        <div class="relative">
          <input id="requested" type="number" value="2000000" step="100000" min="0"
            class="field-input w-full bg-base border border-border rounded-xl px-4 py-3 pr-16 text-white font-semibold text-base transition-all duration-200" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-xs font-medium">UZS</span>
        </div>
      </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-card border border-border rounded-2xl p-5 mint-glow">
        <p class="text-xs font-bold uppercase tracking-widest text-muted mb-3">Ishlab topilgan haq</p>
        <div class="flex items-end gap-2"><span id="accrued" class="text-2xl font-extrabold text-mint">—</span></div>
        <p class="text-xs text-muted mt-2">Kunlik ish haqi × ishlab berilgan kunlar</p>
        <div class="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted">
          <span>Kunlik haq</span>
          <span id="dailyWage" class="text-subtle font-semibold">—</span>
        </div>
      </div>
      <div class="bg-card border border-amber/30 rounded-2xl p-5 amber-glow">
        <p class="text-xs font-bold uppercase tracking-widest text-amber/70 mb-3">Xavfsiz maksimal avans</p>
        <span id="maxSafe" class="text-2xl font-extrabold text-amber">—</span>
        <p class="text-xs text-muted mt-2">Ishlab topilgan haq × xavfsizlik koeffitsiyenti</p>
        <div class="mt-3 pt-3 border-t border-amber/20 flex justify-between text-xs text-muted">
          <span>Koeffitsiyent</span>
          <span id="safetyDisplay" class="text-amber font-semibold">75%</span>
        </div>
      </div>
    </section>
    <div id="statusBar" class="hidden bg-card border border-border rounded-2xl p-5"></div>
    <div id="warning" class="hidden fade-in bg-danger/10 border border-danger/40 rounded-2xl p-5 danger-glow">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-9 h-9 rounded-xl bg-danger/20 flex items-center justify-center mt-0.5">
          <svg class="w-5 h-5 text-danger" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <div>
          <p class="text-danger font-bold text-sm mb-1">Diqqat: Kassa Xavfi!</p>
          <p class="text-danger/80 text-sm leading-relaxed">Xodim so'rayotgan miqdor xavfsizlik limitidan yuqori. Bu kassa uzilishiga <strong class="font-semibold">(cash crunch)</strong> sabab bo'lishi mumkin.</p>
          <p id="warningDelta" class="mt-2 text-xs text-danger/60 font-medium"></p>
        </div>
      </div>
    </div>
    <div id="safeMsg" class="hidden fade-in bg-mint/10 border border-mint/30 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-mint/20 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-mint" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <p class="text-mint font-semibold text-sm">So'ralgan avans xavfsizlik limitida</p>
          <p id="safeDelta" class="text-mint/60 text-xs mt-0.5"></p>
        </div>
      </div>
    </div>
    <p class="text-center text-xs text-muted py-2">Jon Branding Agency · Moliya tizimi · <span id="currentDate"></span></p>
  </main>
  <script>
    function fmt(n) {
      if (isNaN(n) || !isFinite(n)) return '—';
      return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';
    }
    const $ = id => document.getElementById(id);
    const inSalary = $('salary'), inTotalDays = $('totalDays'), inWorked = $('workedDays');
    const inSafety = $('safety'), inRequested = $('requested');
    const outAccrued = $('accrued'), outMaxSafe = $('maxSafe'), outDaily = $('dailyWage');
    const outSafetyD = $('safetyDisplay'), outSafetyL = $('safetyLabel');
    const elWarning = $('warning'), elWarnDelta = $('warningDelta');
    const elSafeMsg = $('safeMsg'), elSafeDelta = $('safeDelta'), elStatus = $('statusBar');
    function calculate() {
      const salary = parseFloat(inSalary.value) || 0;
      const total = parseInt(inTotalDays.value) || 1;
      const worked = Math.min(parseInt(inWorked.value) || 0, total);
      const safety = parseInt(inSafety.value) || 75;
      const requested = parseFloat(inRequested.value) || 0;
      if (parseInt(inWorked.value) > total) inWorked.value = total;
      const dailyWage = salary / total;
      const accrued = dailyWage * worked;
      const maxSafe = accrued * (safety / 100);
      outDaily.textContent = fmt(dailyWage);
      outAccrued.textContent = fmt(accrued);
      outMaxSafe.textContent = fmt(maxSafe);
      outSafetyD.textContent = safety + '%';
      outSafetyL.textContent = safety + '%';
      if (requested > 0 && maxSafe > 0) {
        const diff = requested - maxSafe;
        if (diff > 0) {
          elWarning.classList.remove('hidden'); elWarning.classList.add('fade-in');
          elSafeMsg.classList.add('hidden');
          elWarnDelta.textContent = 'Limit dan ' + fmt(diff) + " ortiq so'raldi.";
        } else {
          elSafeMsg.classList.remove('hidden'); elSafeMsg.classList.add('fade-in');
          elWarning.classList.add('hidden');
          elSafeDelta.textContent = 'Limitdan ' + fmt(Math.abs(diff)) + ' kam — kassa xavfsiz.';
        }
        const pct = Math.min((requested / maxSafe) * 100, 150);
        const color = pct > 100 ? '#EF4444' : pct > 85 ? '#F5A623' : '#34D399';
        const label = pct > 100 ? 'Xavfli zona' : pct > 85 ? 'Ehtiyot zona' : 'Xavfsiz zona';
        elStatus.classList.remove('hidden');
        elStatus.innerHTML = '<div class="flex justify-between items-center mb-2"><span class="text-xs font-semibold text-muted uppercase tracking-widest">So\'rov darajasi</span><span class="text-xs font-bold" style="color:' + color + '">' + label + ' · ' + Math.round(pct) + '%</span></div><div class="w-full h-2.5 bg-base rounded-full overflow-hidden"><div class="h-full rounded-full transition-all duration-500" style="width:' + Math.min(pct,100) + '%;background:' + color + ';"></div></div><div class="flex justify-between mt-2 text-xs text-muted"><span>0</span><span class="text-amber font-medium">' + fmt(maxSafe) + ' (limit)</span></div>';
      } else {
        elWarning.classList.add('hidden');
        elSafeMsg.classList.add('hidden');
        elStatus.classList.add('hidden');
      }
    }
    [inSalary, inTotalDays, inWorked, inSafety, inRequested].forEach(el => el.addEventListener('input', calculate));
    $('currentDate').textContent = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    calculate();
  <\/script>
</body>
</html>`;

export const dynamic = 'force-dynamic';

export function GET() {
  return new Response(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
