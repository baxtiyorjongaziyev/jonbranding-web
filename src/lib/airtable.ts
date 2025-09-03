
import Airtable, { type FieldSet, type Records, type Attachment } from 'airtable';

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


const getAirtableBase = () => {
    const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
    const baseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    
    if (!apiKey) {
        throw new Error("Airtable API Key is not set in environment variables.");
    }
    if (!baseId) {
        throw new Error("Airtable Base ID is not set in environment variables.");
    }
    
    return new Airtable({ apiKey }).base(baseId);
};

export const getFaqItems = async (): Promise<FaqItem[]> => {
    try {
        const base = getAirtableBase();
        const table = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME_FAQ || 'FAQ';
        
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
        console.error(`Error fetching data from Airtable table FAQ:`, error);
        return [];
    }
};

export const getTestimonials = async (): Promise<Testimonial[] | null> => {
    try {
        const base = getAirtableBase();
        const table = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME_TESTIMONIALS || 'Testimonials';
        
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
        console.error(`Error fetching data from Airtable table Testimonials:`, error);
        return null;
    }
}

export const getBrands = async (): Promise<Brand[] | null> => {
    try {
        const base = getAirtableBase();
        const table = process.env.NEXT_PUBLIC_AIRTABLE_TABLE_NAME_BRANDS || 'Brands';

        const records: Records<FieldSet> = await base(table).select({
            view: "Grid view",
            fields: ["Name", "Logo"],
            filterByFormula: '{Name} != ""'
        }).all();
        
        return records.map(record => {
            const logoField = record.get("Logo") as Attachment[];
            const logoUrl = (logoField && logoField.length > 0) ? logoField[0].url : null;
            
            return {
                name: record.get("Name") as string,
                logo: logoUrl
            };
        });

    } catch(error) {
        console.error(`Error fetching data from Airtable table ${table}:`, error);
        return null;
    }
}
