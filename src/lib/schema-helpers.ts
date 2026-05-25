import { Locale } from './dictionaries';

export const getBaseUrl = () => 'https://www.jonbranding.uz';

export const getLocalizedUrl = (path: string, locale: Locale) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/${locale}${path}`;
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

export const generateBreadcrumbSchema = (
  items: BreadcrumbItem[],
  locale: Locale
) => {
  const breadcrumbItems = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: getLocalizedUrl(item.path, locale),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  url: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jon.Branding',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.jonbranding.uz/icon.svg',
        width: 256,
        height: 256,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
};

export const generateCreativeWorkSchema = (work: {
  name: string;
  description: string;
  image: string;
  url: string;
  creator: string;
  dateCreated: string;
  keywords?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.name,
    description: work.description,
    image: work.image,
    url: work.url,
    creator: {
      '@type': 'Organization',
      name: work.creator,
    },
    dateCreated: work.dateCreated,
    ...(work.keywords && { keywords: work.keywords }),
  };
};

export const generateLocalBusinessSchema = (business: {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.telephone,
    address: business.address,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    },
    priceRange: business.priceRange,
  };
};
