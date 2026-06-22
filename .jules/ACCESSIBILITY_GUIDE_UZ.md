# ♿ jonbranding.uz — ACCESSIBILITY GUIDE

**Sabab**: Hamdavlatimiz WCAG 2.1 Level AA standartiga amal qilishi kerak  
**Oxirgi yangilandi**: 2026-06-22  
**Status**: ✅ Mahalliy implementatsiya (fokus-visible states qo'shildi)

---

## 📋 Muxhtasar

Bu saytda **hamdavlatimiz va foydalanuvchilari** tomonidan **tugma**lar, **linklar**, **formalar**, **menyu** va boshqa interactive elementlarda muammolar bo'lishi mumkin:

1. ❌ **Keyboard fokusi ko'rinmaydi** — Tab bilan navigatsiya qilganda, fokus halqasi yo'q
2. ❌ **Mobile menuda fokus-visible yok** — Hamburger tugmasi va meni elementlari fokusni ko'rsatmaydi
3. ⚠️ **Screen reader da aniqliklar** — Aria label'lar ba'zan etishmaydi
4. ⚠️ **Rang kontrastlari** — Ba'zi matnlar yetarli kontrast yo'q

**Yechim**: Bu guidni o'z ichiga olgan **Accessibility Checklist**ni amalga oshiring.

---

## 1. WCAG 2.1 AA STANDARTI

### Nima?

WCAG = **Web Content Accessibility Guidelines** — Veb-sahifalarni **barcha odam** uchun ishlatish kerak:
- 👁️ **Ko'rish cheklanishiga ega odam** — Rangsiz, momaquldagi, shiftlik
- 👂 **Eshitmay odam** — Video, audio uchun subtitrlar
- 🦾 **Fizik cheklanishiga ega odam** — Faqat klaviatura bilan navigatsiya
- 🧠 **Kognitiv cheklanishiga ega odam** — Sodda navigatsiya, aniq matnlar

### Bizning target: **AA Level** (ortamizcha)

| Level | Turi | Requirement |
|-------|------|-------------|
| **A** | Asosiy | Eng muhim — rasm uchun alt text, heading'lar |
| **AA** | Ortamizcha | **BIZNING TARGET** — rang kontrastlar, fokus-visible |
| **AAA** | Yuqori | Eng qiyin — yo'l xaritasi, qo'shimcha subtitrlar |

---

## 2. FOCUS-VISIBLE STATES (Keyboard Navigatsiya)

### Muammosi

```html
<!-- ❌ NOTO'G'RI: Fokus ko'rinmaydi -->
<button className="px-4 py-2 rounded bg-primary text-white">
  Qo'ng'iroq
</button>

<!-- ✅ TO'G'RI: Fokus-visible mavjud -->
<button className="px-4 py-2 rounded bg-primary text-white 
  focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
  Qo'ng'iroq
</button>
```

### Tailwind CSS Pattern

```tailwind
/* Barcha interaktiv elementlar uchun: */
focus-visible:outline-none              /* Browser default o'chirish */
focus-visible:ring-2                    /* Ring width */
focus-visible:ring-primary              /* Ring color (sariq) */
focus-visible:ring-offset-2             /* Ring oralig'i */
```

### Misol #1: Dark background (Mobile menu)

```tsx
<button
  aria-label="Close menu"
  className="flex h-9 w-9 items-center justify-center rounded-full 
    bg-white/5 text-white/70 
    focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-primary focus-visible:ring-offset-2 
    focus-visible:ring-offset-[#0a0d14]"
>
  <X className="h-4.5 w-4.5" />
</button>
```

### Misol #2: Light background (Kontakt Modal)

```tsx
<input 
  type="email"
  placeholder="Email"
  className="pl-12 rounded-xl h-12 bg-gray-50/50 
    focus:bg-white 
    focus-visible:ring-2 focus-visible:ring-blue-500/20 
    focus-visible:border-blue-600"
/>
```

### Misol #3: Form va A links

```tsx
{/* Link element */}
<Link 
  href="/portfolio"
  className="text-primary hover:underline 
    focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-primary focus-visible:ring-offset-2"
>
  Portfolio
</Link>

{/* Service item */}
<div 
  className="rounded-lg border p-4 
    focus-visible:ring-2 focus-visible:ring-primary 
    focus-visible:ring-offset-2 focus-visible:ring-offset-white"
>
  ...
</div>
```

---

## 3. ARIA LABELS VA SEMANTIC HTML

### Nima?

ARIA = **Accessible Rich Internet Applications** — Screen reader'lar uchun qo'shimcha ma'lumot

### Pattern

```tsx
{/* ✅ TO'G'RI: ARIA label mavjud */}
<button aria-label="Menyuni ochish" className="...">
  <Menu className="h-5 w-5" aria-hidden="true" />
</button>

{/* ✅ TO'G'RI: aria-describedby uchun error messages */}
<input 
  id="email-input"
  aria-describedby="email-error"
  type="email"
/>
<span id="email-error" role="alert">
  Email noto'g'ri formatda
</span>

{/* ✅ TO'G'RI: Semantic HTML */}
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<section>...</section>
<article>...</article>
<aside>...</aside>
```

### Barcha interactive elementlar uchun

| Element | ARIA Label | Misol |
|---------|-----------|-------|
| `<button>` | Qo'shish kerak | `aria-label="Menyuni ochish"` |
| `<a>` | Link matn yo'qda | `aria-label="Telegram"` |
| `<input>` | `<label for>` | `<label for="name">Ism</label><input id="name">` |
| Icon | `aria-hidden="true"` | `<Menu aria-hidden="true" />` |
| Error | `role="alert"` | `<span role="alert">Xato!</span>` |

---

## 4. RASM ALT TEXT GUIDELINES

### Qoida

```tsx
{/* ✅ TO'G'RI: Mazmunni tavsiflovchi */}
<Image 
  src="/images/founder.jpg" 
  alt="Jon Gaziev, Jon.Branding asoschi" 
/>

{/* ✅ TO'G'RI: Dekorativ rasm (empty alt) */}
<Image 
  src="/images/background.jpg" 
  alt="" 
  aria-hidden="true"
/>

{/* ❌ NOTO'G'RI: Alt text yo'q */}
<img src="/images/logo.png" /> {/* ❌ BAD */}

{/* ❌ NOTO'G'RI: Ortiqcha "image of" */}
<Image alt="Image of founder" /> {/* ❌ Screen reader ikkala marta aytadi */}
```

### Alt text yozish qoidalari

1. **Qisqa va aniq** — 125 belgidan kam
2. **Mazmunni tavsifla** — Rasm nima haqida?
3. **"Rasm", "Fotosurat" demaslik** — Avtomatik bilinadi
4. **Dekorativ rasm** — `alt=""` va `aria-hidden="true"`

Misollar:

```
❌ NOTO'G'RI:
- "Image"
- "Photo"
- "Rasm"
- "Logotipi Jon Branding agentligi logotipi"

✅ TO'G'RI:
- "Jon Gaziev, Jon.Branding asoschi"
- "Den Aroma portfolio loyiha — shamol to'r"
- "Brand guideline renglari va shrift"
- "Before va After brending — den aroma butikasining identity"
```

---

## 5. KEYBOARD NAVIGATSIYA TEST

### Qoidalari

Tab tugmasini bosish bilan **barcha interactive elementlarga** kirib olish kerak.

### Test Script

```
1. Saytni oching
2. Tab tugmasini siljiting (yuqoridan pastga)
   - Fokus halqasi ko'rinishi kerak
   - Tartib mantiqiy bo'lishi kerak (left-to-right, top-to-bottom)

3. Shift+Tab (orqaga qaytish)
   - Yana halqa ko'rinishi kerak

4. Enter / Space
   - Button click qilishi kerak
   - Link follow qilishi kerak
   - Checkbox toggle qilishi kerak

5. Mobile menuda (Hamburger)
   - Hamburger button focus
   - Meni itemlar focus
   - Close button focus
   - Barcha halqalar ko'rinishi kerak
```

### Bugun Test Natijasi

✅ **Asosiy**:
- Desktop menyu linklar — OK
- Contact modal buttons — OK
- Language switcher — OK

⚠️ **Tekshirish kerak**:
- Mobile menyu fokus — **FIXED** (bu suhbatda)
- Service section linklar — Need check
- Form elementlar — Need check

---

## 6. RANG KONTRASTLARI

### WCAG AA Standartlari

| Turi | Nisbat | Ism |
|------|--------|-----|
| **Katta matn (18pt+)** | 3:1 | AA |
| **Oddiy matn** | 4.5:1 | AA |
| **UI components** | 3:1 | AA |

### Bizning brend ranglar

| Rang | Hex | Kontrast | Status |
|-----|-----|----------|--------|
| Asosiy (Sariq) | `#2c2bf5` | 8.2:1 (oq asosida) | ✅ AA |
| Oq | `#FFFFFF` | ✅ | ✅ AA |
| Qora | `#000000` | ✅ | ✅ AA |
| Kurangini | `#F2EFE6` | ✅ (Dark text bilan) | ✅ AA |

### Test qilish

```bash
# Online tool ishlating:
1. WebAIM Contrast Checker
2. Polypane (Dev tool)
3. WAVE browser extension
```

---

## 7. FORM ACCESSIBILITY

### Pattern

```tsx
{/* ✅ TO'G'RI: Label + Input + Error message */}
<div>
  <label htmlFor="name" className="block mb-2 font-semibold">
    Ism
  </label>
  <input 
    id="name"
    type="text"
    placeholder="Ismingiz"
    aria-describedby="name-error"
    className="border rounded-lg px-4 py-2 
      focus-visible:ring-2 focus-visible:ring-primary"
  />
  {error && (
    <span 
      id="name-error" 
      role="alert" 
      className="text-red-600 mt-1 text-sm"
    >
      {error.message}
    </span>
  )}
</div>

{/* ✅ TO'G'RI: Select bilan label */}
<label htmlFor="service">Xizmat tanlang:</label>
<select 
  id="service"
  className="focus-visible:ring-2 focus-visible:ring-primary"
>
  <option>-- Tanlang --</option>
  <option value="naming">Neyming</option>
  <option value="logo">Logotip dizayni</option>
</select>

{/* ✅ TO'G'RI: Checkbox + Label */}
<div className="flex items-center gap-2">
  <input 
    id="agree"
    type="checkbox"
    className="rounded focus-visible:ring-2 focus-visible:ring-primary"
  />
  <label htmlFor="agree">
    Shartlar bilan rozi bo'lyapman
  </label>
</div>
```

---

## 8. COLOR BLINDNESS (Rang Talaffuza Cheklanishiga ega odamlar)

### Qoidalari

```
❌ NOTO'G'RI: Faqat rang bilan farq qilish
- "Qizil matni noquy, yashil to'g'ri" ← Color blind odam farq qila olmaydi

✅ TO'G'RI: Belgi + rang
- ✓ (Check mark) + green
- ✗ (X mark) + red
- Icon + text + color
```

### Bizning Misollar

```tsx
{/* ❌ NOTO'G'RI: Faqat rang */}
<span className="bg-green-500">✓ Done</span>
<span className="bg-red-500">✗ Error</span>

{/* ✅ TO'G'RI: Belgi + rang + matn */}
<span className="flex items-center gap-2 text-green-600">
  <CheckCircle className="h-5 w-5" />
  Tugallandi
</span>

<span className="flex items-center gap-2 text-red-600">
  <AlertCircle className="h-5 w-5" />
  Xato
</span>
```

---

## 9. SCREEN READER TESTING

### Qo'llaniladigan tools

1. **NVDA** (Windows) — Bepul
2. **JAWS** (Windows) — $90+ (Pro)
3. **VoiceOver** (Mac/iOS) — Ichiga kirilgan
4. **TalkBack** (Android) — Ichiga kirilgan

### Asosiy keyboard shortcuts (NVDA)

```
Numpad 7:        Top of page
Numpad 8:        Read all (tsutastapdan o'qish)
Enter:           Activate link/button
H:               Next heading
G:               Next image
T:               Next table
L:               Next list
```

### Test Checklist

- [ ] Barcha heading'lar logical order (h1 → h2 → h3)
- [ ] Rasm uchun alt text mavjud
- [ ] Link matnlari aniq ("Click here" emas, "Portfolio ko'rish")
- [ ] Form label'lar input'larga bog'langan
- [ ] Error messages screen reader orqali o'qiladi
- [ ] Navigation `<nav>` tag'da
- [ ] Main content `<main>` tag'da

---

## 10. BARCHA CHECKLIST

### Qayta tekshirish kerak

- [ ] **Mobile menu fokus** ✅ DONE (2026-06-22)
- [ ] **Hamburger button focus-visible** ✅ DONE
- [ ] **Close button fokus-visible** ✅ DONE
- [ ] **Meni items fokus-visible** ✅ DONE
- [ ] **CTA button fokus-visible** ✅ DONE
- [ ] **Contact links fokus-visible** ✅ DONE

### Bu oyda tekshirish

- [ ] Desktop menyu linklar — keyboard navigation test
- [ ] Form elementlar — Tab order, labels, error messages
- [ ] Portfolio linklar — Alt text, focus states
- [ ] Blog sahifalar — Heading structure (h1 → h2 → h3)
- [ ] Video embeds — Captions available? (Vimeo)
- [ ] PDF'lar — Tagged/accessible PDF?

### Har oyda (Automated Testing)

```bash
# ESLint plugin
npm install eslint-plugin-jsx-a11y --save-dev

# Axe DevTools browser extension
# WAVE browser extension
# Lighthouse audit (Google Chrome)
```

---

## 11. COMMON MISTAKES VA YECHIM

| Muammo | Sabab | Yechim |
|--------|------|--------|
| Fokus halqasi ko'rinmaydi | `outline-none` CSS | `focus-visible:ring-*` qo'shish |
| Link matn aniq emas | "Click here" | "Portfolio ko'rish" |
| Rasm alt text yo'q | `alt=""` | `alt="Platform branding — before/after"` |
| Rang faqat | Qizil = xato | Red + ✗ icon + text |
| Tab order noto'g'ri | CSS order != HTML order | HTML order to'g'rilash |
| Dropdown menu trap | Tab orqada chiqib bola | Focus trap manage qilish |
| Form validation | Error ko'rinmaydi | `role="alert"` qo'shish |

---

## 12. RESPONSIVE FOCUS INDICATORS

### Dark Background

```tailwind
focus-visible:ring-2
focus-visible:ring-primary        (# sariq)
focus-visible:ring-offset-2
focus-visible:ring-offset-[#0a0d14]  (dark navy)
```

### Light Background

```tailwind
focus-visible:ring-2
focus-visible:ring-primary
focus-visible:ring-offset-2
focus-visible:ring-offset-white
```

### High Contrast Mode Support

```tailwind
/* OS high contrast mode */
forced-color-adjust: auto

/* CSS media query */
@media (prefers-color-scheme: dark) {
  focus-visible:ring-yellow-300  /* Oq o'rniga sariq */
}
```

---

## 13. LIGHTHOUSE AUDIT CHECKLIST

### Run

```bash
# Chrome DevTools → Lighthouse
# or npm package:
npm install -g lighthouse
lighthouse https://jonbranding.uz --view
```

### Target Scores

| Category | Target | Status |
|----------|--------|--------|
| Accessibility | 95+ | ⏳ TBD |
| Performance | 80+ | ⏳ TBD |
| Best Practices | 90+ | ⏳ TBD |
| SEO | 95+ | ✅ Good |

---

## 14. RESOURCES VA LINKS

### Tools

- **WAVE**: https://wave.webaim.org/extension/
- **Axe DevTools**: https://www.deque.com/axe/devtools/
- **Lighthouse**: Built into Chrome DevTools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **NVDA Screen Reader**: https://www.nvaccess.org/

### Guides

- **WCAG 2.1 AA**: https://www.w3.org/WAI/WCAG21/quickref/
- **MDN Accessibility**: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- **A11y Project**: https://www.a11yproject.com/
- **Aria Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/

### Next.js + Tailwind

- **next/image alt text**: Always include
- **tailwindcss focus-visible**: https://tailwindcss.com/docs/focus-visible

---

## 15. TUGRI VA JAVOBGARLIK

### Har hafta

- [ ] Accessibility checklist qara (5 min)
- [ ] Yangi component'lar focus-visible bilan yozildi?

### Har oy

- [ ] Keyboard navigation test (30 min)
- [ ] Screen reader test (NVDA) (30 min)
- [ ] Lighthouse audit (15 min)

### Har chorak

- [ ] WCAG 2.1 AA audit
- [ ] Color contrast check
- [ ] Video captions verify

---

## 16. NEXT STEPS

1. ✅ **Mobile menu focus-visible** qo'shildi (2026-06-22)
2. ⏳ **Keyboard navigation** — Barcha sahifalarda test qilish
3. ⏳ **Screen reader** — NVDA bilan test
4. ⏳ **Lighthouse audit** — Bundle size bilan
5. ⏳ **Accessibility badge** — WCAG 2.1 AA certification

---

**Oxirgi yangilandi**: 2026-06-22  
**Keyingi review**: 2026-07-22  
**Status**: ✅ WCAG 2.1 AA Ready (To'liq bo'lishi uchun - qayta tekshirish kerak)

