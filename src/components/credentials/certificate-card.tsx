import Image from 'next/image';
import type { FC } from 'react';
import { formatCertDate, validUntil, type PatentCertificate } from '@/lib/patent-certificates';

const BLUE = '#1677ff';

/**
 * Guvohnoma ma'lumotnomasi — rasmiy guvohnomaning tiniq, brendlangan nusxasi.
 * Barcha o'lchamlar `cqw` da: karta qaysi kenglikda turmasin, matn va logo
 * proporsiyasi bir xil qoladi (slayd panjarasida ham, katta ko'rinishda ham).
 */
const CertificateCard: FC<{ cert: PatentCertificate }> = ({ cert }) => {
  const rows: [string, string][] = [
    ['Guvohnoma egasi', cert.owner],
    ['Talabnoma raqami', cert.application],
    ['Talabnoma kelib tushgan sana', formatCertDate(cert.filed)],
    ['Amal qilish muddati', validUntil(cert)],
    ['Tovarlar va xizmatlar xalqaro tasnifi', cert.classes.join(', ')],
  ];

  return (
    <div className="w-full" style={{ containerType: 'inline-size' }}>
      <article
        className="relative flex aspect-[1/1.414] w-full flex-col items-center overflow-hidden bg-white text-center"
        style={{
          borderRadius: '5cqw',
          padding: '7cqw 7cqw 5cqw',
          color: '#1d1d1f',
          boxShadow: `inset 0.6cqw 0.6cqw 0 -0.1cqw ${BLUE}55, 0 1px 2px rgba(0,0,0,.06), 0 12px 32px -12px rgba(0,0,0,.18)`,
          fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
        }}
      >
        <p style={{ fontSize: '2.6cqw', fontWeight: 700, letterSpacing: '0.01em' }}>
          TOVAR BELGISI VA XIZMAT KO‘RSATISH BELGISIGA DOIR
        </p>
        <p style={{ fontSize: '7.6cqw', fontWeight: 800, color: BLUE, lineHeight: 1.1, marginTop: '1.4cqw' }}>
          MA’LUMOTNOMA
        </p>
        <p style={{ fontSize: '2cqw', fontWeight: 600, marginTop: '2.4cqw', opacity: 0.8 }}>
          Jon Branding patentlash agentligi tomonidan olib berildi
        </p>
        <p style={{ fontSize: '2.2cqw', fontWeight: 700, marginTop: '2.6cqw' }}>№ {cert.number}</p>

        <div className="relative flex w-full flex-1 items-center justify-center" style={{ margin: '3cqw 0' }}>
          {cert.logo ? (
            <div className="relative h-full w-[74%]" style={{ maxHeight: '44cqw' }}>
              <Image
                src={cert.logo}
                alt={`${cert.brand} — ro‘yxatdan o‘tgan tovar belgisi`}
                fill
                sizes="(max-width: 640px) 60vw, 640px"
                className="object-contain"
                style={{ borderRadius: '2cqw' }}
              />
            </div>
          ) : null}
        </div>

        <dl className="grid w-full text-left" style={{ gridTemplateColumns: '1fr 1.15fr', rowGap: '2.2cqw', columnGap: '3cqw', fontSize: '2.1cqw' }}>
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt style={{ opacity: 0.75 }}>{label}:</dt>
              <dd style={{ fontWeight: 700, textTransform: 'uppercase' }}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex w-full items-end justify-between" style={{ marginTop: '5cqw' }}>
          <div className="text-left leading-none">
            <img src="/assets/logos/logo-black.svg" alt="Jon Branding" style={{ height: '4.4cqw', width: 'auto' }} />
            <p style={{ fontSize: '1.5cqw', letterSpacing: '0.32em', marginTop: '1cqw', opacity: 0.7 }}>
              PATENTLASH AGENTLIGI
            </p>
          </div>
          <Stamp />
        </div>
      </article>
    </div>
  );
};

/** Dumaloq muhr — SVG, shuning uchun har qanday o'lchamda tiniq. */
const Stamp: FC = () => (
  <svg viewBox="0 0 100 100" style={{ width: '20cqw', height: '20cqw', transform: 'rotate(-12deg)' }} aria-hidden>
    <defs>
      <path id="cert-stamp-ring" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
    </defs>
    <circle cx="50" cy="50" r="47" fill="none" stroke={BLUE} strokeWidth="2" />
    <circle cx="50" cy="50" r="27" fill="none" stroke={BLUE} strokeWidth="1" strokeDasharray="2 2" />
    <text fill={BLUE} fontSize="8.2" fontWeight="700" letterSpacing="1.6">
      <textPath href="#cert-stamp-ring">JON BRANDING · PATENTLASH AGENTLIGI ·</textPath>
    </text>
    <image href="/assets/logos/logo-black.svg" x="27" y="46.4" width="46" height="7.4" preserveAspectRatio="xMidYMid meet" />
  </svg>
);

export default CertificateCard;
