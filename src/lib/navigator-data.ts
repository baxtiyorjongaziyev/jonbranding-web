export interface PainPoint {
  id: string
  title: string
  description: string
}

export interface DesiredResult {
  id: string
  title: string
}

export interface DiagnosticQuestion {
  id: string
  category: 'Moliya' | 'Savdo' | 'Marketing' | 'Mijoz' | 'Jamoa' | 'Biznes tizimi'
  text: string
}

export const PAIN_POINTS: PainPoint[] = [
  { id: 'p1', title: 'Savdo bor, lekin foyda kam', description: 'Mijozlar ko‘p narx tushirishni so‘raydi.' },
  { id: 'p2', title: 'Biznes yaxshi, lekin oddiy ko‘rinadi', description: 'Tashqi taassurot biznesning haqiqiy darajasiga mos emas.' },
  { id: 'p3', title: 'Mijozlar farqimizni tushunmaydi', description: 'Nima uchun aynan bizni tanlash kerakligi aniq emas.' },
  { id: 'p4', title: 'Reklamaga pul ketadi, natija kam', description: 'Odamlar reklamani ko‘radi, lekin murojaat yoki xarid qilmaydi.' },
  { id: 'p5', title: 'Har bir ish qaytadan boshlanadi', description: 'Jamoada tayyor qoida va yagona tizim yo‘q.' },
  { id: 'p6', title: 'Oldin ham pul sarfladik, natija chiqmadi', description: 'Pudratchilar bilan ishlash cho‘zilgan yoki natija ishlatilmay qolgan.' },
  { id: 'p7', title: 'Biznesni yangi bosqichga olib chiqmoqchimiz', description: 'Yangi filial, yangi hudud yoki yirik mijozlarga chiqish rejalashtirilgan.' },
  { id: 'p8', title: 'Nomimiz bo‘yicha xavotir bor', description: 'Nom boshqa birovniki bo‘lishi yoki keyin almashtirilishi mumkin.' },
  { id: 'p9', title: 'Bozorda bizni tanishmaydi', description: 'Odamlar biznes nomini eslab qolmaydi.' },
  { id: 'p10', title: 'Hamma ish biznes egasiga bog‘langan', description: 'Rahbar har bir kichik qarorga aralashishga majbur.' }
]

export const DESIRED_RESULTS: DesiredResult[] = [
  { id: 'r1', title: 'Savdo va foydani oshirish' },
  { id: 'r2', title: 'Narxni tushirmasdan sotish' },
  { id: 'r3', title: 'Yirik mijozlar ishonchini olish' },
  { id: 'r4', title: 'Raqobatchilardan ajralish' },
  { id: 'r5', title: 'Bozorda tanilish' },
  { id: 'r6', title: 'Jamoani tartibli ishlatish' },
  { id: 'r7', title: 'Ko‘proq erkin vaqtga ega bo‘lish' },
  { id: 'r8', title: 'Yangi bozorga chiqish' },
  { id: 'r9', title: 'Biznes nomini himoyalash' },
  { id: 'r10', title: 'Professional imidj va obro‘ga ega bo‘lish' }
]

export const QUESTIONS: DiagnosticQuestion[] = [
  // Moliya
  { id: 'q1', category: 'Moliya', text: 'Oylik sof foydangizni aniq bilasizmi?' },
  { id: 'q2', category: 'Moliya', text: 'Qaysi mahsulot yoki xizmat eng ko‘p foyda olib kelishini bilasizmi?' },
  { id: 'q3', category: 'Moliya', text: 'Bitta yangi mijoz sizga qanchaga tushishini bilasizmi (CAC)?' },
  // Savdo
  { id: 'q4', category: 'Savdo', text: 'Sotuv jarayoni qadam-baqadam yozib qo‘yilganmi?' },
  { id: 'q5', category: 'Savdo', text: 'Sotuv biznes egasisiz ham barqaror davom etadimi?' },
  { id: 'q6', category: 'Savdo', text: 'Mijozlarning qayta xarid qilish ko‘rsatkichi o‘lchanadimi?' },
  // Marketing
  { id: 'q7', category: 'Marketing', text: 'Reklamaga sarflangan pulning qaytishini o‘lchaysizmi (ROI)?' },
  { id: 'q8', category: 'Marketing', text: 'Mijoz nima uchun aynan sizni tanlashini aniq ayta olasizmi?' },
  { id: 'q9', category: 'Marketing', text: 'Raqobatchilardan farqingiz mijozlarga oson yetkaziladimi?' },
  // Mijoz
  { id: 'q10', category: 'Mijoz', text: 'Siz uchun "ideal mijoz" kim ekanligi aniq belgilanganmi?' },
  { id: 'q11', category: 'Mijoz', text: 'Mijozlarning fikri va shikoyatlari tizimli yig‘iladimi?' },
  { id: 'q12', category: 'Mijoz', text: 'Mahsulotingiz yoki xizmatingiz mijozning qaysi aniq muammosini hal qiladi?' },
  // Jamoa
  { id: 'q13', category: 'Jamoa', text: 'Jamoada har bir xodimning vazifasi va javobgarligi aniqmi?' },
  { id: 'q14', category: 'Jamoa', text: 'Yangi xodimni ishga moslashtirish (onboarding) tizimi bormi?' },
  { id: 'q15', category: 'Jamoa', text: 'Jamoa faqat sizning ko‘rsatmangiz bilan emas, maqsadga qarab ishlaydimi?' },
  // Biznes tizimi
  { id: 'q16', category: 'Biznes tizimi', text: 'Siz operatsion ishlarga emas, biznesni o‘stirishga vaqt ajrata olasizmi?' },
  { id: 'q17', category: 'Biznes tizimi', text: 'Biznesdagi qarorlar hissiyotga emas, raqamlarga asoslanib qabul qilinadimi?' },
  { id: 'q18', category: 'Biznes tizimi', text: 'Kompaniya keyingi 1 yillik va 3 yillik aniq strategiyaga egami?' }
]

export const ANSWER_OPTIONS = [
  { value: 'ha', label: 'Ha', score: 2 },
  { value: 'qisman', label: 'Qisman', score: 1 },
  { value: 'yoq', label: 'Yo‘q', score: 0 },
  { value: 'bilmayman', label: 'Bilmayman', score: 0 }
]
