// Agentlik haqidagi rasmiy raqamlar — yagona manba. Batafsil: docs/FAKTLAR.md.
// Saytdagi yil, tajriba, mijoz va loyiha sonlari faqat shu yerdan olinadi.

/** Professional faoliyat boshlangan sana: 2018-yil 27-noyabr. */
export const FOUNDED_AT = new Date('2018-11-27T00:00:00+05:00');
export const FOUNDED_YEAR = 2018;

/** Topshirilgan ishlar bo'yicha tasdiqlangan raqamlar. */
export const CLIENTS_COUNT = 600;
export const PROJECTS_COUNT = 1200;

/** To'liq yillar soni — har yili 27-noyabrda avtomatik bittaga oshadi. */
export function yearsOfExperience(now: Date = new Date()): number {
  let years = now.getFullYear() - FOUNDED_AT.getFullYear();
  const anniversary = new Date(FOUNDED_AT);
  anniversary.setFullYear(now.getFullYear());
  if (now < anniversary) years -= 1;
  return years;
}

export const yearsLabel = (now?: Date) => `${yearsOfExperience(now)}+`;
export const clientsLabel = `${CLIENTS_COUNT}+`;
export const projectsLabel = `${PROJECTS_COUNT}+`;

/** Lug'at matnlaridagi {{years}}, {{clients}}, {{projects}}, {{founded}} belgilarini almashtiradi. */
export function fillFacts<T>(value: T, now?: Date): T {
  const json = JSON.stringify(value)
    .replaceAll('{{years}}', yearsLabel(now))
    .replaceAll('{{clients}}', clientsLabel)
    .replaceAll('{{projects}}', projectsLabel)
    .replaceAll('{{founded}}', String(FOUNDED_YEAR));
  return JSON.parse(json) as T;
}
