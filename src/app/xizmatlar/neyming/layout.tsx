
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

const APP_NAME = "Neyming | Jon.Branding";
const APP_DESCRIPTION = "Brend uchun unutilmas va kuchli nom tanlash. Yaxshi nom shunchaki chiroyli eshitilmaydi, u mohiyatni yetkazadi, esda qoladi va brendning raqobatchilar orasida ajralib turishiga yordam beradi.";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://jonbranding.uz/xizmatlar/neyming',
    siteName: 'Jon.Branding',
    images: [
      {
        url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2', // Replace with a relevant image
        width: 1200,
        height: 630,
        alt: APP_DESCRIPTION,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'], // Replace with a relevant image
  },
  alternates: {
    canonical: 'https://jonbranding.uz/xizmatlar/neyming',
  },
};

const NamingLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
}

export default NamingLayout;
