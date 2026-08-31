import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const title = 'Siz 0.1misiz yoki 1.9mi? — Biznes uslub testi | Jon.Branding';
  const description = 'Biznesdagi tabiiy ish uslubingizni aniqlang: Visionary (0.1) yoki Integrator (1.9). 16 ta savol, 2 daqiqada natija.';
  const canonicalUrl = `https://www.jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}uslub-test`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const StyleTestLayout: FC<Readonly<{ children: ReactNode; params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
};

export default StyleTestLayout;
