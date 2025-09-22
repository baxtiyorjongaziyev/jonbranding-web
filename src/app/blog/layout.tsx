
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

const APP_NAME = "Blog | Jon.Branding";
const APP_DESCRIPTION = "Brending, marketing va dizayn olamidagi so'nggi yangiliklar, maslahatlar va tahliliy maqolalar. Biznesingizni o'stirishga yordam beramiz.";

export const metadata: Metadata = {
  metadataBase: new URL('https://jonbranding.uz'),
  title: APP_NAME,
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://jonbranding.uz/blog',
    siteName: 'Jon.Branding',
    images: [
      {
        url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
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
    images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
  },
  alternates: {
    canonical: 'https://jonbranding.uz/blog',
  },
};

const BlogLayout: FC<Readonly<{ children: ReactNode }>> = ({ children }) => {
  return <>{children}</>;
}

export default BlogLayout;
`