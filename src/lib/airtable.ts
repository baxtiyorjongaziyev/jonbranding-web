import Airtable, { type FieldSet, type Records } from 'airtable';

export interface FaqItem {
    question: string;
    answer: string;
}

const getAirtableBase = () => {
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
        throw new Error("AIRTABLE_API_KEY is not defined in environment variables.");
    }
    return new Airtable({ apiKey }).base(process.env.AIRTABLE_BASE_ID || '');
};

export const getFaqItems = async (): Promise<FaqItem[]> => {
    const base = getAirtableBase();
    const table = process.env.AIRTABLE_TABLE_NAME || 'FAQ';
    
    try {
        const records: Records<FieldSet> = await base(table).select({
            view: "Grid view",
            // You can add more options here like sorting, filtering, etc.
            fields: ["Question", "Answer"], // Specify fields to fetch
            filterByFormula: 'AND({Question} != "", {Answer} != "")' // Ensure both fields are not empty
        }).all();

        return records.map(record => ({
            question: record.get("Question") as string,
            answer: record.get("Answer") as string,
        }));
    } catch (error) {
        console.error(`Error fetching data from Airtable table ${table}:`, error);
        // Return an empty array or re-throw, depending on desired error handling
        return [];
    }
};
