import type { Metadata } from 'next';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const safeLang = ['uz', 'ru', 'en', 'zh'].includes(lang) ? lang : 'uz';
  const t: Record<string, { title: string; description: string }> = {
    uz: {
      title: "Blog | Jon.Branding",
      description: "Brending, marketing va dizayn olamidagi so'nggi yangiliklar, maslahatlar va tahliliy maqolalar. Biznesingizni o'stirishga yordam beramiz."
    },
    ru: {
      title: "\u0411\u043B\u043E\u0433 | Jon.Branding",
      description: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0438, \u0441\u043E\u0432\u0435\u0442\u044B \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438 \u0438\u0437 \u043C\u0438\u0440\u0430 \u0431\u0440\u0435\u043D\u0434\u0438\u043D\u0433\u0430, \u043C\u0430\u0440\u043A\u0435\u0442\u0438\u043D\u0433\u0430 \u0438 \u0434\u0438\u0437\u0430\u0439\u043D\u0430. \u041F\u043E\u043C\u043E\u0433\u0430\u0435\u043C \u0432\u0430\u0448\u0435\u043C\u0443 \u0431\u0438\u0437\u043D\u0435\u0441\u0443 \u0440\u0430\u0441\u0442\u0438."
    },
    en: {
      title: "Blog | Jon.Branding",
      description: "Latest news, tips and analytical articles from the world of branding, marketing and design. We help your business grow."
    },
    zh: {
      title: "\u535A\u5BA2 | Jon.Branding",
      description: "\u6765\u81EA\u54C1\u724C\u3001\u8425\u9500\u548C\u8BBE\u8BA1\u4E16\u754C\u7684\u6700\u65B0\u65B0\u95FB\u3001\u6280\u5DE7\u548C\u5206\u6790\u6587\u7AE0\u3002\u6211\u4EEC\u5E2E\u52A9\u60A8\u7684\u4E1A\u52A1\u589E\u957F\u3002"
    }
  };
  const translations = t[safeLang] || t.uz;
  const canonicalUrl = `https://www.jonbranding.uz/${safeLang === 'uz' ? '' : safeLang + '/'}blog`;

  return {
    metadataBase: new URL('https://www.jonbranding.uz'),
    title: translations.title,
    description: translations.description,
    openGraph: {
      title: translations.title,
      description: translations.description,
      url: canonicalUrl,
      siteName: 'Jon.Branding',
      images: [
        {
          url: '/images/cms/og-image.jpeg',
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
      images: ['/images/cms/og-image.jpeg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'uz': 'https://www.jonbranding.uz/blog',
        'ru': 'https://www.jonbranding.uz/ru/blog',
        'en': 'https://www.jonbranding.uz/en/blog',
        'zh': 'https://www.jonbranding.uz/zh/blog',
      },
    },
  };
}

const BlogLayout: FC<Readonly<{ children: ReactNode, params: Promise<{ lang: string }> }>> = ({ children }) => {
  return <>{children}</>;
}

export default BlogLayout;
