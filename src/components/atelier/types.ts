export interface SectionProps {
  dictionary: any;
  onOpen: () => void;
}

export interface ATNavProps {
  dictionary: any;
  onOpen: () => void;
  theme: string;
  setTheme: (t: string) => void;
}

export interface ATFeaturedProps {
  dictionary: any;
  comparison?: any;
  lang: string;
}

export interface ATShowcaseProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
}

export interface ATGalleryProject {
  _id: string;
  slug: string;
  title: string;
  client: string;
  category?: string;
  city?: string;
  industry?: string;
  coverImage: string;
  results?: { metric: string; value: string }[];
  featured?: boolean;
  order?: number;
  publishedAt?: string;
}

export interface ATGalleryProps {
  dictionary: any;
  onOpen: () => void;
  comparisons?: any[];
  lang: string;
  projects?: ATGalleryProject[];
}

export interface ATLossCalcProps {
  dictionary: any;
  onOpen: () => void;
  lang?: string;
}

export interface ATQuotesProps {
  dictionary: any;
  testimonials?: any[];
  lang: string;
}

export interface ATTweaksProps {
  visible: boolean;
  onClose: () => void;
  theme: string;
  setTheme: (t: string) => void;
  grain: boolean;
  setGrain: (g: boolean) => void;
  accent: string;
  setAccent: (a: string) => void;
}
