export interface SanityPortfolioItem {
  _type: 'portfolio';
  title: string;
  slug: { _type: 'slug', current: string };
  client: string;
  category: string;
  tags: string[];
  description: string;
  body: any[]; // block content
  results: { metric: string, value: string }[];
}

export class GeminiProcessor {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("GEMINI_API_KEY is required");
    this.apiKey = apiKey;
  }

  async generatePortfolioData(text: string): Promise<SanityPortfolioItem> {
    console.log(`[Gemini] Processing case study text...`);
    
    const prompt = `You are an expert copywriter for a branding agency called "Jon Branding".
    Extract and generate the following fields for a portfolio CMS (Sanity) based on the input text:
    
    1. "title": The name of the project.
    2. "slug": A URL friendly version of the title.
    3. "client": The name of the client.
    4. "category": Must be one of: "brand-strategy", "logo-design", "brandbook", "corporate-style", "packaging", "naming".
    5. "tags": Array of 3-5 keywords.
    6. "description": A short, catchy 2-sentence description of what was done.
    7. "results": Array of metric/value objects if mentioned (e.g. { metric: "Sales", value: "+40%" }).
    
    Input Text:
    ${text}
    
    Output strictly in valid JSON format matching this schema:
    {
      "title": "string",
      "slug": { "_type": "slug", "current": "string" },
      "client": "string",
      "category": "string",
      "tags": ["string"],
      "description": "string",
      "results": [{ "metric": "string", "value": "string" }]
    }`;

    // Here we use the generic "gemini-2.5-flash"
    // For a real package, you might need to use the REST API directly or the correct SDK structure
    // Since we are mocking the structure with `@google/genai` (or generic AI), we use a placeholder REST fetch:
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
        })
    });
    
    const data = await res.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
        throw new Error("Failed to generate content from Gemini");
    }
    
    const parsed = JSON.parse(resultText);
    
    return {
      _type: 'portfolio',
      ...parsed,
      body: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: text, marks: [] }],
          markDefs: [],
          style: 'normal'
        }
      ]
    };
  }
}
