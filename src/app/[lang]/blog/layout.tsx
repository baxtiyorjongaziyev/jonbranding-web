
import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const isRu = lang === 'ru';
  const t = {
    uz: {
      title: "Blog | Jon.Branding",
      description: "Brending, marketing va dizayn olamidagi so'nggi yangiliklar, maslahatlar va tahliliy maqolalar. Biznesingizni o'stirishga yordam beramiz."
    },
    ru: {
      title: "Блог | Jon.Branding",
      description: "Последние новости, советы и аналитические статьи из мира брендинга, маркетинга и дизайна. Помогаем вашему бизнесу расти."
    },
    en: {
      title: "Blog | Jon.Branding",
      description: "Latest news, tips and analytical articles from the world of branding, marketing and design. We help your business grow."
    }
  };
  // @ts-ignore
  const translations = t[lang as keyof typeof t] || t.uz;
  const canonicalUrl = `https://jonbranding.uz/${lang === 'uz' ? '' : lang + '/'}blog`;

  return {
    metadataBase: new URL('https://jonbranding.uz'),
    title: translations.title,
    description: translations.description,
    openGraph: {
      title: translations.title,
      description: translations.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: 'https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2',
          width: 1200,
          height: 630,
          alt: translations.description,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.title,
      description: translations.description,
      images: ['https://img1.teletype.in/files/48/fb/48fbe9e5-c83d-46da-9425-aa8b8b18d501.jpeg?v=2'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://jonbranding.uz/blog',
        'ru': 'https://jonbranding.uz/ru/blog',
        'en': 'https://jonbranding.uz/en/blog',
      },
    },
  };
}

const BlogLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default BlogLayout;
