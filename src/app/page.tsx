
import type { FC } from 'react';
import dynamic from 'next/dynamic';
import PageClient from '@/components/page-client';
import Offer from '@/components/sections/offer';
import Airtable, { type FieldSet, type Records, type Attachment } from 'airtable';
import { type Brand } from '@/lib/airtable';

// Dynamically import components that are not immediately visible
const Testimonials = dynamic(() => import('@/components/sections/testimonials'));
const Faq = dynamic(() => import('@/components/sections/faq'));


const staticBrands: Brand[] = [
  { name: 'Korsun', logo: null }, { name: 'Boyarin', logo: null }, { name: 'Sarmilk', logo: null }, { name: 'M-Karim', logo: null }, { name: 'Prime Fit', logo: null }, { name: 'Revo', logo: null }, { name: 'To\'maris', logo: null }, 
  { name: 'Aisha Mebel', logo: null }, { name: 'Den Aroma', logo: null }, { name: 'Velzo', logo: null }, { name: 'Bodomchi', logo: null },
  { name: 'Fidda by Sevara', logo: null }, { name: 'Viton', logo: null }, { name: 'Ravza Mebel', logo: null }, { name: 'Coloray', logo: null }, { name: 'Dayan Color', logo: null }, { name: 'Bekbazar', logo: null }, 
  { name: 'Climart', logo: null }, { name: 'Sunnah Products', logo: null }, { name: 'Petron Polymer', logo: null }, { name: 'Perfona', logo: null }, { name: 'Esviro', logo: null }, { name: 'Savod', logo: null }
];


const getBrands = async (): Promise<Brand[]> => {
    // Hardcoding credentials for server-side fetching to ensure reliability.
    // This code runs only on the server, so these keys are not exposed to the client.
    const apiKey = 'keyek4uDxgA6oZsBO';
    const baseId = 'app8xoyx1XCumYFXV';
    const tableName = 'Brands';

    if (!apiKey || !baseId) {
        console.error("Airtable config is hardcoded but missing.");
        return staticBrands;
    }

    try {
        const base = new Airtable({ apiKey }).base(baseId);
        const records: Records<FieldSet> = await base(tableName).select({
            view: "Grid view",
            fields: ["Name", "Logo"],
            filterByFormula: '{Name} != ""'
        }).all();
        
        const brands = records.map(record => {
            const logoField = record.get("Logo") as Attachment[];
            const logoUrl = (logoField && logoField.length > 0) ? logoField[0].url : null;
            
            return {
                name: record.get("Name") as string,
                logo: logoUrl
            };
        });

        return brands.length > 0 ? brands : staticBrands;

    } catch(error) {
        console.error(`Error fetching data from Airtable table ${tableName}:`, error);
        return staticBrands;
    }
}


const Home: FC = async () => {
  const brands = await getBrands();

  return (
    <>
      <PageClient brands={brands}>
          <Testimonials />
          <Faq />
      </PageClient>
    </>
  );
};

export default Home;
