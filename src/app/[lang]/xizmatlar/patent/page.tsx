import type { Metadata } from 'next';
import CertificateCard from '@/components/credentials/certificate-card';
import ServiceLanding from '@/components/service-landing/service-landing';
import ServiceJsonLd from '@/components/structured-data/service-json-ld';
import { Locale } from '@/lib/dictionaries';
import { PATENT_CERTIFICATES } from '@/lib/patent-certificates';
import { getPageAlternates, pageTitle } from '@/lib/seo';
import { PATENT_PAGE } from '@/lib/service-pages/patent';

type Props = { params: Promise<{ lang: string }> };

// Guvohnomalar soni sayt ma'lumotidan olinadi (`PATENT_CERTIFICATES`) — qo'lda yozilmaydi.
const CERT_COUNT = PATENT_CERTIFICATES.length;

const DESCRIPTION =
  `Brend nomi va logotipini O‘zbekistonda tovar belgisi sifatida ro‘yxatdan o‘tkazish: tekshiruv 880 000 so‘mdan, oddiy ~7 oy yoki tezkor 20–40 kun. ${CERT_COUNT} ta guvohnoma olib berganmiz.`;

const META: Record<Locale, { title: string; description: string }> = {
  uz: {
    title: 'Tovar belgisini ro‘yxatdan o‘tkazish narxi — patent 5 000 000 so‘mdan',
    description:
      `Tovar belgisini ro‘yxatdan o‘tkazish narxi: tekshiruv 880 000, oddiy patent 5 000 000 (~7 oy), tezkor 7 000 000 so‘m (20–40 kun). ${CERT_COUNT} ta guvohnoma olib berganmiz.`,
  },
  ru: {
    title: 'Сколько стоит патент на товарный знак в Узбекистане — от 5 000 000 сум',
    description:
      `Регистрация товарного знака в Узбекистане: проверка 880 000 сум, обычный патент 5 000 000 (~7 месяцев), срочный 7 000 000 сум (20–40 дней). Получили ${CERT_COUNT} свидетельств для клиентов.`,
  },
  en: {
    title: 'Trademark Registration Cost in Uzbekistan — from 5,000,000 UZS',
    description:
      `Trademark registration in Uzbekistan: expert check 880,000 UZS, standard filing 5,000,000 (~7 months), fast-track 7,000,000 UZS (20–40 days). ${CERT_COUNT} certificates obtained for clients.`,
  },
  zh: {
    title: '乌兹别克斯坦商标注册费用 — 5,000,000 苏姆起',
    description:
      `乌兹别克斯坦商标注册：检索880,000苏姆，普通注册5,000,000（约7个月），加急7,000,000苏姆（20–40天）。已为客户取得${CERT_COUNT}份证书。`,
  },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang: Locale = (['uz', 'ru', 'en', 'zh'] as const).includes(lang as Locale) ? (lang as Locale) : 'uz';
  return {
    title: pageTitle(META[safeLang].title),
    description: META[safeLang].description,
    keywords: 'patent, tovar belgisi, trademark, brendni ro‘yxatdan o‘tkazish, guvohnoma, Adliya vazirligi',
    alternates: await getPageAlternates(safeLang, '/xizmatlar/patent'),
  };
}

/** Ommaviy patent xizmati sahifasi. Mazmun hozircha faqat o'zbekcha (Uzbek-first). */
export default async function PatentPage(props: Props) {
  const { lang } = await props.params;
  const certs = PATENT_CERTIFICATES.filter((cert) => cert.logo);

  return (
    <>
      <ServiceJsonLd lang={lang as Locale} path="/xizmatlar/patent" name="Patent — tovar belgisini ro‘yxatdan o‘tkazish" description={DESCRIPTION} />
      <ServiceLanding content={PATENT_PAGE}>
        <section className="border-b border-neutral-200/80 bg-neutral-50 px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-[11px] font-medium uppercase text-blue-700" style={{ fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.12em' }}>
              Ma’lumotnomalar
            </p>
            <h2 className="max-w-3xl font-bold text-neutral-950" style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Mijozlarimiz brendlari — guvohnoma bilan
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {certs.map((cert) => (
                <CertificateCard key={cert.number} cert={cert} />
              ))}
            </div>
          </div>
        </section>
      </ServiceLanding>
    </>
  );
}
