export interface ParsedProject {
  title: string;
  client: string;
  category: 'logo-design' | 'naming' | 'brandbook' | 'corporate-style' | 'packaging' | 'brand-strategy';
  description: string;
  tags: string[];
  results: Array<{ metric: string; value: string }>;
  driveFolderUrl: string | null;
  driveFolderId: string | null;
}

export interface SanityImageAsset {
  _type: 'reference';
  _ref: string;
}

export interface PortfolioPayload {
  _type: 'portfolio';
  title: string;
  slug: { _type: 'slug'; current: string };
  client: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: { _type: 'image'; asset: SanityImageAsset };
  galleryImages: Array<{ _type: 'image'; asset: SanityImageAsset }>;
  results: Array<{ _key: string; metric: string; value: string }>;
  featured: boolean;
  publishedAt: string;
}
