# Arxiv — eski `/xizmatlar` mijoz komponentlari (2026-09)

Bu fayllar **ishlatilmaydi**. Ular asosiy `src/` dan bu yerga ko'chirildi, chunki
narxlar sahifasi `/narxlar` ga o'tganda va `/xizmatlar` `xizmatlar-interactive`
ga ko'chganda ular hech qaysi sahifadan chaqirilmay qoldi.

O'chirilmadi — keyin kerak bo'lishi mumkin.

## Ichida nima bor

| Fayl | Nima qiladi |
|---|---|
| `package-builder.tsx` | **Interaktiv paket kalkulyatori** — xizmat tanlanadi, summa jonli hisoblanadi, promokod qo'llanadi |
| `comparison.tsx` | Raqobatchilar bilan taqqoslash jadvali |
| `queue-status.tsx` | "Navbatda nechta loyiha bor" bloki |
| `urgency-block.tsx` | Shoshilinch buyurtma bloki |
| `personal-offer-block.tsx` | Shaxsiy taklif bloki |
| `services-hero.tsx` | Eski xizmatlar sahifasi hero'si |
| `xizmatlar-client.*.tsx` | Yuqoridagilarni yig'uvchi uch nusxa (uchalasi ham chaqirilmagan) |

## ⚠️ Qaytarishdan oldin: narxlar eskirgan

`package-builder` narxni `src/lib/pricing.ts` dan oladi — u yerda **dollarda**
yozilgan va 12 700 ga ko'paytiriladi. Saytdagi haqiqiy narxlar esa
`src/lib/sales-content.ts` da **so'mda**. Ikkalasi mos emas:

| Xizmat | Kalkulyator ko'rsatadi | Haqiqiy narx |
|---|---|---|
| Logo (VIP) | $2 950 ≈ 37,5 mln so'm | 8 mln so'm |
| Naming (Premium) | $980 ≈ 12,4 mln so'm | 10 mln so'm |

Shuning uchun uni shundayligicha qaytarib bo'lmaydi — avval `sales-content.ts`
dan narx o'qiydigan qilish kerak.

## Qaytarish tartibi

1. Kerakli faylni `src/components/sections/` ga qaytarish
2. `package-builder` narx manbasini `sales-content.ts` ga o'tkazish
3. Sahifaga ulash va `npm run build` bilan tekshirish
