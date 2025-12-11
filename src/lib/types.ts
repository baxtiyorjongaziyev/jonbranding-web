
export interface FaqItem {
    question: string;
    answer: string;
}

export interface Testimonial {
    name: string;
    company: string;
    avatar: string;
    image: string;
    imageHint: string;
    quote: string;
    videoUrl?: string;
}

export interface Brand {
    name: string;
    logo: string | null;
}

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    image: string;
    imageHint: string;
    htmlContent?: string;
}

export interface GalleryImage {
    src: string;
    alt: string;
    hint: string;
    unoptimized?: boolean;
}

export interface Project {
    brand: string;
    oldImg: string;
    newImg: string;
    oldHint: string;
    newHint: string;
    galleryImages: GalleryImage[];
}
