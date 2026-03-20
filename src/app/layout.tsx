
import type { Metadata } from 'next';
import './globals.css';
import type { FC, ReactNode } from 'react';

const BASE_URL = 'https://jonbranding.uz';
const OG_IMAGE_URL = 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Jon.Branding | Toshkentdagi Professional Brending Agentligi",
    template: "%s | Jon.Branding"
  },
  description: "Biznesingiz uchun natijali brend strategiyasi, neyming va logotip dizayni.",
  openGraph: {
    type: 'website',
    locale: 'uz_UZ',
    url: BASE_URL,
    siteName: 'Jon.Branding',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'Jon Branding Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [OG_IMAGE_URL],
  },
};

const RootLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  // This root layout is a pass-through to localized layouts to avoid duplicate html/body tags
  return children;
}

export default RootLayout;
