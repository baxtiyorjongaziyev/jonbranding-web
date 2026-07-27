# OISHA-OS Loyihasi (Self-Improving System)

## Asosiy Maqsad
Oisha-OS — bu o'zini o'zi tahlil qilib, kamchiliklarni topib, AI agentlar yordamida avtomatik tuzatib boradigan **avtonom rivojlantirish tizimi** hisoblanadi.

## Tizim Arxitekturasi (6 Modul)
1. **Self-Audit Modules:** Kodni (CodeAuditor), telemetriyani (Runtime Telemetry), biznes logikani va arxitekturani tekshiradigan tizimlar.
2. **Improvement Proposal Engine:** Kamchiliklarni topib, ularni ustuvorlik (ICE scoring) asosida vazifalarga (ImprovementTask) aylantiradi.
3. **AI Agent Orchestrator:** 6 ta maxsus AI agentlaridan iborat jamoa (`refactorer`, `tester`, `security`, `perf`, `documenter`, `architect`). Ular topilgan muammolarni avtomatik tuzatadi.
4. **Execution Pipeline (Autonomous Loop):** Har kuni avtomatik ravishda `audit -> propose -> execute -> verify -> learn` siklida ishlaydi.
5. **Knowledge Base (Vector Memory):** Qilingan xatolar va ularning yechimlari ChromaDB (Vector store) da "tajriba" sifatida saqlanib boriladi.
6. **Integration:** Telegram komandalari (`/improve status`, `/improve run`) va Github cron joblar orqali boshqariladi.

## Inson ishtiroki (Sizning rolingiz)
Ushbu loyihada siz (**[[Baxtiyorjon_Gaziyev]]**) faqatgina **tasdiqlovchi va strateg** rolasiz:
- Yuqori riskli (Security, Arch, Data_migration) o'zgarishlarga ruxsat berasiz.
- Qaysi muammolar birinchi hal qilinishini (ustuvorlikni) hal qilasiz.
- Boshqa hamma ishni — kod yozish, test qilish, xato qidirish va xato to'g'irlashni AI agentlari avtomatlashtirilgan tarzda bajaradi!
