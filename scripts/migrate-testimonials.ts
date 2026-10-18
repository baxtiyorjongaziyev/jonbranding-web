import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'h6ymmj0v',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-14',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const testimonials = [
  {
    name: "Hikmatulloh Toxirov",
    company: {
      uz: "Almaz Shoes Asoschisi",
      ru: "Основатель Almaz Shoes",
      en: "Founder of Almaz Shoes",
      zh: "Almaz Shoes 创始人"
    },
    quote: {
      uz: "Sotuvlarimiz juda zo'r bo'ldi, natijadan xursandmiz. Bozorda eng zo'ri bo'lishingizga ishonamiz.",
      ru: "Наши продажи значительно выросли, мы очень довольны результатом.",
      en: "Our sales have been great, we are very happy with the result.",
      zh: "我们的销售额非常好，我们对结果非常满意。"
    },
    videoUrl: "https://player.vimeo.com/video/1205182267"
  },
  {
    name: "Azamat Muxammedov",
    company: {
      uz: "Mountain Suvlari Asoschisi",
      ru: "Основатель Mountain Water",
      en: "Founder of Mountain Water",
      zh: "Mountain Water 创始人"
    },
    quote: {
      uz: "Juda kuchli jamoa, biz ularning xizmatlaridan minnatdormiz.",
      ru: "Очень сильная команда, мы благодарны за их услуги.",
      en: "A very strong team, we are grateful for their services.",
      zh: "一个非常强大的团队，我们感谢他们的服务。"
    },
    videoUrl: "https://player.vimeo.com/video/1047125304"
  },
  {
    name: "Akrom Raxmonov",
    company: {
      uz: "Nur Sopol Direktori",
      ru: "Директор Nur Sopol",
      en: "Director of Nur Sopol",
      zh: "Nur Sopol 总监"
    },
    quote: {
      uz: "Yangi qadoqdan keyin sotuvlarimiz x2 ga oshdi.",
      ru: "После новой упаковки наши продажи выросли в 2 раза.",
      en: "After the new packaging, our sales doubled.",
      zh: "新包装后，我们的销售额翻了一番。"
    },
    videoUrl: "https://player.vimeo.com/video/1047125032"
  }
];

async function migrate() {
  console.log("Starting migration of testimonials to Sanity...");
  try {
    for (let index = 0; index < testimonials.length; index++) {
      const t = testimonials[index];
      const doc = {
        _type: 'testimonial',
        name: t.name,
        company: t.company,
        quote: t.quote,
        videoUrl: t.videoUrl,
        order: index + 1
      };
      const res = await client.create(doc);
      console.log(`Created testimonial for ${t.name}: ${res._id}`);
    }
    console.log("Migration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
