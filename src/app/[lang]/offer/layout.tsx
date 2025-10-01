import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const title = "Maxsus Taklif | Jon.Branding";
  const description = "Brending xizmatlari uchun cheklangan vaqtli maxsus taklif. Bonuslarni qo'ldan boy bermang va biznesingizni bugunoq keyingi bosqichga olib chiqing.";
  const url = "https://jonbranding.uz/offer";

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Jon.Branding',
      images: [
        {
          url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
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
      images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
    },
     // Tell search engines not to index this page
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

const OfferLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
}

export default OfferLayout;
