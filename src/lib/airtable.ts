
import Airtable, { type FieldSet, type Records } from 'airtable';

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


const getAirtableBase = () => {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    if (!apiKey || !baseId) {
        console.warn("Airtable environment variables (AIRTABLE_API_KEY, AIRTABLE_BASE_ID) are not set.");
        return null;
    }
    return new Airtable({ apiKey }).base(baseId);
};

export const getFaqItems = async (): Promise<FaqItem[]> => {
    const base = getAirtableBase();
    if (!base) {
        return [];
    }

    const table = process.env.AIRTABLE_TABLE_NAME_FAQ || 'FAQ';
    
    try {
        const records: Records<FieldSet> = await base(table).select({
            view: "Grid view",
            fields: ["Question", "Answer"], 
            filterByFormula: 'AND({Question} != "", {Answer} != "")'
        }).all();

        return records.map(record => ({
            question: record.get("Question") as string,
            answer: record.get("Answer") as string,
        }));
    } catch (error) {
        console.error(`Error fetching data from Airtable table ${table}:`, error);
        return [];
    }
};

export const getTestimonials = async (): Promise<Testimonial[] | null> => {
    const base = getAirtableBase();
     if (!base) {
        return null;
    }
    const table = process.env.AIRTABLE_TABLE_NAME_TESTIMONIALS || 'Testimonials';
    
    try {
        const records: Records<FieldSet> = await base(table).select({
            view: "Grid view",
            fields: ["name", "company", "avatar", "image", "imageHint", "quote", "videoUrl"],
            filterByFormula: 'AND({name} != "", {quote} != "")'
        }).all();

        return records.map(record => ({
            name: record.get("name") as string,
            company: record.get("company") as string,
            avatar: record.get("avatar") as string,
            image: record.get("image") as string,
            imageHint: record.get("imageHint") as string,
            quote: record.get("quote") as string,
            videoUrl: record.get("videoUrl") as string | undefined,
        }));
    } catch (error) {
        console.error(`Error fetching data from Airtable table ${table}:`, error);
        return null;
    }
}

    