import type { Metadata } from 'next';
import styles from './pro-preview.module.css';

type Props = {
  params: Promise<{ lang: string }>;
};

const stats = [
  { value: '120+', label: 'tadbirkor brendini tartibga keltirdi' },
  { value: '38', label: 'sohada nom, logo va strategiya ishlari' },
  { value: '24 soat', label: "ichida audit bo'yicha javob" },
  { value: '6 yil', label: 'bozor va xaridor psixologiyasi tajribasi' },
];

const painPoints = [
  'Logo bor, lekin xaridor nima uchun aynan sizni tanlashini tushunmaydi.',
  'Instagram, qadoq, sayt va reklama bir-biriga o\'xshamaydi.',
  'Brend arzon ko\'rinadi, narxni himoya qilish qiyinlashadi.',
  'Mijoz ishonishi uchun dalil kam, sotuv jamoasi ko\'p tushuntirishga majbur.',
];

const services = [
  {
    name: 'Brand Audit',
    detail: 'Nom, logo, qadoq, sayt va reklama mijoz ko\'zida qanchalik ishonch berishini tekshiramiz.',
  },
  {
    name: 'Brand Strategy',
    detail: 'Bozor pozitsiyasi, va\'da, tone of voice va taklifni bir tizimga keltiramiz.',
  },
  {
    name: 'Identity System',
    detail: 'Logo emas, ishlaydigan vizual tizim: rang, shrift, kompozitsiya va qo\'llash qoidalari.',
  },
  {
    name: 'Sales Assets',
    detail: 'Landing, qadoq, kartochka, prezentatsiya va reklama materiallarini sotuvga moslaymiz.',
  },
];

const cases = [
  {
    name: 'Prime Fit',
    category: 'Fitness mahsuloti',
    result: 'Qadoq va vizual til premium ko\'rinishga o\'tdi.',
  },
  {
    name: 'Den Aroma',
    category: 'Aroma mahsulotlari',
    result: 'Mahsulot hikoyasi va qiymat signali aniqroq bo\'ldi.',
  },
  {
    name: 'Fidda',
    category: 'FMCG brendi',
    result: 'Shelf impact kuchaydi, rang tizimi tartibga tushdi.',
  },
];

const process = [
  {
    step: '01',
    title: 'Tez diagnostika',
    text: 'Brendingiz xaridor qaroriga qayerda yordam bermayotganini topamiz.',
  },
  {
    step: '02',
    title: 'Strategik yo\'nalish',
    text: 'Kim uchun, nima va\'da, qanday ko\'rinish va qanday CTA ishlashini belgilaymiz.',
  },
  {
    step: '03',
    title: 'Vizual tizim',
    text: 'Sotuvga xizmat qiladigan identika, sahifa va materiallarni bir standartga keltiramiz.',
  },
];

const pricing = [
  {
    name: 'Audit',
    price: 'Bepul',
    description: '15-30 daqiqalik brend tahlili va birinchi yo\'nalish.',
    features: ['Sayt va vizual ko\'rinish tahlili', 'Ishonchni pasaytirayotgan joylar', 'Keyingi qadamlar ro\'yxati'],
  },
  {
    name: 'Strategy Sprint',
    price: 'Kelishiladi',
    description: 'Brend taklifi, pozitsiya va vizual yo\'nalishni tez yig\'ish.',
    features: ['Brand platforma', 'Vizual moodboard', 'Sotuv argumentlari', 'CTA va funnel taklifi'],
    featured: true,
  },
  {
    name: 'Full System',
    price: 'Premium',
    description: 'Brendni barcha nuqtalarda bir xil qimmat va ishonchli ko\'rsatish.',
    features: ['Logo va identika', 'Brandbook', 'Landing yoki sales assets', 'Launch materiallari'],
  },
];

const faqs = [
  {
    question: 'Auditdan keyin majburiy buyurtma berish kerakmi?',
    answer: 'Yo\'q. Audit sizga hozirgi muammo va imkoniyatni ko\'rsatish uchun. Qarorni keyin o\'zingiz qabul qilasiz.',
  },
  {
    question: 'Faqat logo kerak bo\'lsa ham murojaat qilsak bo\'ladimi?',
    answer: 'Bo\'ladi, lekin biz logoni alohida rasm emas, biznesingizni qimmatroq ko\'rsatadigan tizim ichida ko\'ramiz.',
  },
  {
    question: 'Saytni ham shu dizayn yo\'nalishiga o\'tkazish mumkinmi?',
    answer: 'Ha. Bu preview aynan yangi premium light/dark yo\'nalishni xavfsiz sinash uchun qurildi.',
  },
];

export const metadata: Metadata = {
  title: 'Jon Pro Preview | Jon.Branding',
  description: 'Jon.Branding uchun premium light/dark redesign preview.',
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return ['uz', 'ru', 'en', 'zh'].map((lang) => ({ lang }));
}

export default async function ProPreviewPage({ params }: Props) {
  const { lang } = await params;
  const safeLang = ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz';

  return (
    <main className={styles.preview}>
      <section className={styles.hero} aria-labelledby="pro-preview-title">
        <div className={styles.container}>
          <div className={styles.topbar} aria-label="Jon Pro preview navigation">
            <a className={styles.brand} href={`/${safeLang}`}>
              jon.
            </a>
            <nav className={styles.nav} aria-label="Preview bo'limlari">
              <a href="#proof">Isbot</a>
              <a href="#services">Xizmat</a>
              <a href="#cases">Ishlar</a>
              <a href="#pricing">Tarif</a>
            </nav>
            <a className={styles.topCta} href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noreferrer">
              Audit olish
            </a>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>System theme preview - light/dark avtomatik</p>
              <h1 id="pro-preview-title" className={styles.heroTitle}>
                Brendingiz <span>daromad</span> keltirsin.
              </h1>
              <p className={styles.heroText}>
                Logotip emas - sotuvchi brend tizimi. Nom topishdan tovar belgisigacha, bir paketda,
                bir jamoa qo'lida. Biznesingiz xaridor ko'zida qimmatroq va ishonchliroq ko'rinishi
                kerak.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noreferrer">
                  Bepul brend tahlili
                </a>
                <a className={styles.secondaryButton} href="#cases">
                  Ishlarni ko'rish
                </a>
              </div>
              <div className={styles.trustStrip} aria-label="Audit shartlari">
                <span>Bepul 30 daqiqalik tahlil</span>
                <span>Hech qanday majburiyat yo'q</span>
                <span>24 soat ichida javob</span>
              </div>
            </div>

            <div className={styles.heroVisual} aria-label="Jon.Branding case preview">
              <div className={styles.visualCardLarge}>
                <span>Prime Fit</span>
                <strong>brand system</strong>
                <div className={styles.packMockup} />
              </div>
              <div className={styles.visualCardSmall}>
                <span>Qadoq</span>
                <strong>+37%</strong>
              </div>
              <div className={styles.visualCardAccent}>
                <span>Brand Audit</span>
                <strong>15 min</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className={styles.statsSection} aria-label="Jon.Branding natijalar">
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((item) => (
              <div className={styles.statItem} key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.split}>
            <div>
              <p className={styles.eyebrow}>Muammo</p>
              <h2 className={styles.sectionTitle}>Ko'p brendlar yomon emas. Ular shunchaki qimmat ko'rinmaydi.</h2>
            </div>
            <div className={styles.painList}>
              {painPoints.map((point) => (
                <article className={styles.lineCard} key={point}>
                  {point}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Yechim</p>
            <h2 className={styles.sectionTitle}>Biz dizayn qilmaymiz. Biz xaridor sizni qanday qabul qilishini boshqaramiz.</h2>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <article className={styles.serviceItem} key={service.name}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.name}</h3>
                <p>{service.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cases" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.caseHeader}>
            <div>
              <p className={styles.eyebrow}>Proof</p>
              <h2 className={styles.sectionTitle}>Brend qimmat ko'rinsa, sotuv gapirishdan oldin boshlanadi.</h2>
            </div>
            <a className={styles.textLink} href={`/${safeLang}/#portfolio`}>
              Portfolio
            </a>
          </div>
          <div className={styles.caseGrid}>
            {cases.map((item) => (
              <article className={styles.caseCard} key={item.name}>
                <div className={styles.casePreview}>
                  <span>{item.name.slice(0, 2)}</span>
                </div>
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                <strong>{item.result}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.processPanel}>
            <div>
              <p className={styles.eyebrow}>Jarayon</p>
              <h2 className={styles.sectionTitle}>Tartibli jarayon. Kam gap. Aniq qaror.</h2>
            </div>
            <div className={styles.processList}>
              {process.map((item) => (
                <article className={styles.processItem} key={item.step}>
                  <span>{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Offer</p>
            <h2 className={styles.sectionTitle}>Avval brendingiz qayerda pul yo'qotayotganini ko'ramiz.</h2>
          </div>
          <div className={styles.pricingGrid}>
            {pricing.map((plan) => (
              <article className={`${styles.priceCard} ${plan.featured ? styles.featuredPrice : ''}`} key={plan.name}>
                {plan.featured ? <span className={styles.recommended}>Tavsiya qilinadi</span> : null}
                <h3>{plan.name}</h3>
                <strong>{plan.price}</strong>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noreferrer">
                  Konsultatsiya olish
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.quotePanel}>
            <p>
              "Premium dizayn degani bezak emas. U biznes egasiga narxini tushuntirishni yengillashtiradigan
              ishonch tizimi."
            </p>
            <span>Jon.Branding redesign direction</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.faqGrid}>
            <div>
              <p className={styles.eyebrow}>FAQ</p>
              <h2 className={styles.sectionTitle}>Qaror oldidan bilish kerak bo'lgan savollar.</h2>
            </div>
            <div className={styles.faqList}>
              {faqs.map((item) => (
                <details className={styles.faqItem} key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.finalPanel}>
            <div>
              <p className={styles.eyebrow}>Final CTA</p>
              <h2>Brendingiz bozorda qimmat ko'rinishi kerak.</h2>
              <p>
                Avval audit qilamiz. Keyin qaysi nuqta sotuvga halaqit berayotganini ko'rsatamiz.
              </p>
            </div>
            <a className={styles.primaryButton} href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noreferrer">
              Bepul auditga yozilish
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
