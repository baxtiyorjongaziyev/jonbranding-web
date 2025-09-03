
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
