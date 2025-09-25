
import { type Brand, type Project } from '@/lib/types';

export const staticBrands: Brand[] = [
    { name: 'Sarmilk', logo: 'https://img4.teletype.in/files/36/a0/36a05cc3-f4a4-4592-b025-d4ccf6d9b27f.png' }, 
    { name: 'M-Karim', logo: 'https://img4.teletype.in/files/ff/4e/ff4e4596-2b83-47f2-8fdd-59b36e6df4d5.png' }, 
    { name: 'Prime Fit', logo: 'https://img2.teletype.in/files/95/db/95dbe2db-423e-4df3-a09b-fe76af32ad40.png' }, 
    { name: 'Revo', logo: 'https://img4.teletype.in/files/75/02/7502c144-d092-4e18-9f26-782628ddc49c.png' }, 
    { name: 'To\'maris', logo: 'https://img1.teletype.in/files/8d/2e/8d2ea8a6-a110-4bfa-b726-081ae9d2194a.png' }, 
    { name: 'Aisha Mebel', logo: 'https://img1.teletype.in/files/ce/fb/cefb56b3-cedb-4d9e-8abc-93400078f498.png' }, 
    { name: 'Den Aroma', logo: 'https://img3.teletype.in/files/e2/90/e290fd28-87f2-4175-bc39-f15f945ac215.png' }, 
    { name: 'Velzo', logo: 'https://img1.teletype.in/files/c1/85/c185f779-620e-4ec7-bfe1-1580a000d80a.png' }, 
    { name: 'Bodomchi', logo: 'https://img4.teletype.in/files/ff/50/ff50be41-df24-49fa-95e7-7d50a7840f3e.png' },
    { name: 'Fidda by Sevara', logo: 'https://img4.teletype.in/files/36/31/36315fc2-fcda-4133-86a4-85362a8197ce.png' }, 
    { name: 'Boyarin', logo: 'https://img1.teletype.in/files/c1/05/c105eef2-f611-4004-8cab-aa96752fb767.png' }, 
    { name: 'Viton', logo: 'https://img2.teletype.in/files/9c/fc/9cfc9326-cfdc-4a0f-8262-9a69bdd6f0a2.png' }, 
    { name: 'Ravza Mebel', logo: 'https://img3.teletype.in/files/25/47/2547cc84-f669-43f0-b0a6-93421a65a68a.png' }, 
    { name: 'Dayan Color', logo: 'https://img3.teletype.in/files/e8/8d/e88d7cdc-7351-4c32-9d54-25a8994f3cb6.png' }, 
    { name: 'Bekbazar', logo: 'https://img3.teletype.in/files/e2/3e/e23e22a0-c573-4cda-8d5d-03c5648e16f9.png' }, 
    { name: 'InControl', logo: 'https://img4.teletype.in/files/39/cd/39cdc07a-f3ec-4cb7-abf8-8d80281621c0.png' }, 
    { name: 'Sunnah Products', logo: 'https://img1.teletype.in/files/0f/a6/0fa6fe98-f227-4046-9cfa-6e4114adfc84.png' }, 
    { name: 'Goodwell', logo: 'https://img3.teletype.in/files/ee/42/ee42432f-65c8-4f2a-a982-5f34a469d95b.png' }, 
    { name: 'Perfona', logo: 'https://img1.teletype.in/files/0c/2c/0c2c079a-40f7-4b0e-93f3-87fcf124ea5e.png' }, 
    { name: 'Esviro', logo: 'https://img3.teletype.in/files/a6/97/a6977482-12ab-43e9-a896-74475b97b869.png' }, 
    { name: 'Savod', logo: 'https://img4.teletype.in/files/bd/2e/bd2e4311-fe77-4b14-a784-5409028a305f.png' },
    { name: 'Sherzod Beknazarov', logo: 'https://img3.teletype.in/files/e0/be/e0bef570-3d46-43be-9479-3fb56e64e94f.png' }, 
    { name: 'O\'rman', logo: 'https://img4.teletype.in/files/f1/19/f11904e6-d300-4bd1-b9f0-a1d715eefc96.png' }, 
    { name: 'R Studio', logo: 'https://img2.teletype.in/files/d2/aa/d2aa2d6e-22e7-44c3-a941-6fc441560619.png' },
    { name: 'Jafiko light', logo: 'https://img2.teletype.in/files/16/ff/16ff7f19-7a74-4771-9c78-55b810979273.png' },
    { name: 'Vibro', logo: 'https://img3.teletype.in/files/ec/e4/ece494de-57e9-490d-989b-7aaa5ec5ef19.png' },
    { name: 'Russkiy les', logo: 'https://img1.teletype.in/files/86/d6/86d60b0b-bc17-4125-9f36-abf9c2013242.png' },
    { name: 'Rahimov School', logo: 'https://img3.teletype.in/files/ec/47/ec47862b-c93c-42e8-b13b-c072a9c3ffef.png' },
    { name: 'Doctor Herbal', logo: 'https://img3.teletype.in/files/28/a8/28a8bbe7-39cf-4796-906d-2fe5712d751f.png' },
    { name: 'Doctor Fresh', logo: 'https://img4.teletype.in/files/f6/e1/f6e1a215-6589-4141-a7e1-0d7b3264398e.png' },
    { name: 'online hamshira', logo: 'https://img2.teletype.in/files/d7/30/d730cbeb-390d-4d49-b392-856ef49ce60c.png' },
    { name: 'Korsun', logo: 'https://img4.teletype.in/files/fc/d0/fcd09308-b559-4818-8570-dc078bfa0915.png' }, 
    { name: 'Petron Polymer', logo: 'https://img4.teletype.in/files/bd/fe/bdfe27df-6f78-47a2-8c17-1642dc821a0e.png' }, 
    { name: 'Climart', logo: 'https://img4.teletype.in/files/b5/81/b581c892-50c0-4f9d-a146-17cd32d93597.png' }, 
];

export const projects: Project[] = [
    { 
        brand: "Fidda", 
        oldImg: "https://img2.teletype.in/files/9c/66/9c66a85f-486c-4f54-9682-fb4838061ab2.jpeg", 
        newImg: "https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png", 
        oldHint: "old logo design", 
        newHint: "modern new logo",
        galleryImages: [
            { src: 'https://img1.teletype.in/files/c1/27/c1276cf1-3338-47ab-a744-193da4049b4d.png', alt: 'Fidda Logotipi', hint: 'modern minimalist logo' }
        ]
    },
    { 
        brand: "Incontrol", 
        oldImg: "https://img1.teletype.in/files/83/47/83479180-eeb6-4e39-9169-c4f4fb22e375.jpeg", 
        newImg: "https://img2.teletype.in/files/17/9c/179c7811-8cf7-4ee9-87ad-66709208b115.png", 
        oldHint: "outdated branding", 
        newHint: "sleek professional branding",
        galleryImages: []
    },
    { 
        brand: "Barakah", 
        oldImg: "https://img2.teletype.in/files/55/fe/55fe2252-db0f-4fd2-8ee8-d674bffab68a.png", 
        newImg: "https://img2.teletype.in/files/dc/5c/dc5cd481-115e-4d57-ac2a-3ea3142e5f54.png", 
        newHint: "generic restaurant logo", 
        newHint: "unique restaurant branding",
        galleryImages: []
    },
    {
        brand: "Animatsion logolar",
        oldImg: "",
        newImg: "",
        oldHint: "",
        newHint: "",
        galleryImages: [
            { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/6747f48137e17a98411d6346_LOGO.gif', alt: 'Animatsion logo', hint: 'animated logo' },
            { src: 'https://cdn.prod.website-files.com/6732e36be7888a23d003baac/67513d8fe1caee5495e0f9bd_ezgif-6-3f24b1faa6.gif', alt: 'Animatsion logo 2', hint: 'gif logo' }
        ]
    },
    {
        brand: "Brending Identifikatsiyasi",
        oldImg: "",
        newImg: "",
        oldHint: "",
        newHint: "",
        galleryImages: [
            { src: 'https://img1.teletype.in/files/84/db/84dbe512-edc1-4386-a986-29114e8d8be2.png', alt: 'Loyiha 4', hint: 'corporate style' },
            { src: 'https://img1.teletype.in/files/84/76/8476f287-2ba0-4164-898a-d2d7c353a27e.jpeg', alt: 'Loyiha 5', hint: 'brandbook example' },
            { src: 'https://img1.teletype.in/files/88/92/8892f18d-a298-485d-8fe5-7d0444defd89.png', alt: 'Loyiha 3', hint: 'branding identity' },
            { src: 'https://img2.teletype.in/files/19/49/1949747d-4381-489d-87bf-753a9fac573a.jpeg', alt: 'Loyiha 7', hint: 'website branding' },
            { src: 'https://img1.teletype.in/files/83/c2/83c2c300-af89-482e-8052-15189ac22aff.jpeg', alt: 'Loyiha 6', hint: 'logo concept' },
            { src: 'https://img2.teletype.in/files/51/45/5145b60e-aca5-4225-8564-a4d601a148a7.jpeg', alt: 'Loyiha 8', hint: 'minimalist logo' },
        ]
    }
];
