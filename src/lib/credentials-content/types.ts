/**
 * `/credentials` taqdimotining matnlari.
 *
 * Narx, xizmat tarkibi va kafolatlar bu yerda emas — ular
 * `src/lib/sales-content/` da, `/narxlar` bilan bitta manbadan.
 * Bu fayl faqat slaydlarga xos sarlavha va yorliqlarni saqlaydi.
 */

export type CredentialsCopy = {
  meta: {
    title: string;
    description: string;
  };
  /** Pastki panelda ko'rinadigan qisqa slayd nomlari. */
  nav: {
    cover: string;
    clients: string;
    problem: string;
    solution: string;
    naming: string;
    services: string;
    packages: string;
    process: string;
    guarantees: string;
    quote: string;
    cta: string;
  };
  cover: {
    eyebrow: string;
    /** Har bir satr alohida `<br />` bilan chiqadi. */
    title: string[];
    subtitle: string;
    stats: {
      years: string;
      clients: string;
      projects: string;
    };
  };
  clients: {
    eyebrow: string;
    title: string;
  };
  problem: {
    eyebrow: string;
    title: string;
  };
  solution: {
    eyebrow: string;
    title: string;
  };
  naming: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Brend nomi (katta harf) → soha. Nomlar `sales-content` dagi naming proof'dan olinadi. */
    fields: Record<string, string>;
    facts: { value: string; label: string }[];
  };
  cases: {
    eyebrow: string;
    fallbackCategory: string;
  };
  services: {
    eyebrow: string;
  };
  packages: {
    eyebrow: string;
    title: string;
    cta: string;
    note: string;
  };
  process: {
    eyebrow: string;
    title: string;
    paymentLabel: string;
  };
  guarantees: {
    eyebrow: string;
    title: string;
  };
  quote: {
    eyebrow: string;
  };
  cta: {
    eyebrow: string;
    /** Har bir satr alohida `<br />` bilan chiqadi. */
    title: string[];
    subtitle: string;
    button: string;
  };
};
