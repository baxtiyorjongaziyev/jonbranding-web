import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react'

// In a real application, you'd fetch this data from a CMS or DB based on the slug.
// For the MVP, we render a generic template using the copy provided in the brief.

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params
  return {
    title: `${params.slug.replace(/-/g, ' ')} | Biznes Navigator`,
  }
}

export default async function PainPresentationPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  // Example hardcoded data matching the specific brief example
  const isSalesPain = params.slug.includes('savdo')
  
  const content = {
    headline: isSalesPain ? 'Savdo bor, lekin pul qolmayaptimi?' : 'Biznesingizdagi ushbu muammoni hal qilish vaqti keldi',
    painDesc: isSalesPain ? 'Buyurtmalar kelayotgan bo‘lsa ham, mijozlar doim chegirma so‘rasa va oy oxirida kutilgan foyda qolmasa, muammo faqat sotuv sonida bo‘lmasligi mumkin.' : 'Ayni paytda bu muammo biznesingizning o‘sishiga katta to‘sqinlik qilmoqda.',
    actualTask: isSalesPain ? 'Mijozga sizdagi farq va qiymatni tez tushuntirish kerak. Aks holda u sizni faqat narx orqali solishtiradi.' : 'Haqiqiy muammo boshqa joyda. Tizimni qayta ko‘rib chiqish kerak.',
    desiredResult: isSalesPain ? 'Narxni doim tushirishga majbur bo‘lmasdan, foydaliroq mijozlar bilan ishlash va daromadni biznes, mashina, uskuna, sayohat yoki oila uchun sarflash imkoniga ega bo‘lish.' : 'Maqsad: barqaror va tartibli ishlaydigan tizim orqali erkinlikka erishish.'
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            {content.headline}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {content.painDesc}
          </p>
        </div>

        {/* Core Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center text-red-600 font-semibold text-lg mb-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Aslida nima qilinishi kerak?
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {content.actualTask}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center text-blue-800 font-semibold text-lg mb-2">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Kutilayotgan natija
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">
                {content.desiredResult}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div className="space-y-6 pt-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Nima qilish kerak?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-9xl font-black text-slate-50 opacity-50 select-none">
                  {num}
                </div>
                <div className="relative z-10 space-y-2">
                  <h3 className="font-bold text-lg text-slate-900">Amaliy qadam {num}</h3>
                  <p className="text-slate-600 text-sm">
                    Bu yerda aniq va tushunarli tavsiya yoziladi. Mijoz bu qadamni darhol amalda qo'llay olishi kerak.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies / Proof */}
        <div className="space-y-6 pt-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center">Xuddi shunday holatdagi natijalar</h2>
          <Card className="bg-slate-900 text-white overflow-hidden border-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="text-blue-400 font-semibold">B2B Xizmat ko'rsatish</div>
                  <h3 className="text-2xl font-bold">1 oyda marginani 15% ga oshirish</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mijozlar doimiy chegirma so'rashidan charchagan kompaniya o'zining "qiymat taklifi"ni o'zgartirdi. Sotuv skriptiga kiritilgan kichik o'zgarish orqali narx tushirmasdan sotishga erishildi.
                </p>
              </div>
              <div className="bg-slate-800 flex items-center justify-center p-8 border-l border-slate-700/50">
                 {/* Placeholder for case study visual */}
                 <div className="text-center text-slate-500">
                    <div className="text-6xl mb-2">📈</div>
                    <div className="font-medium">Natija vizualizatsiyasi (grafik)</div>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTAs */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Button asChild size="lg" className="h-16 text-lg bg-blue-900 hover:bg-blue-800">
            <Link href="/uz/navigator/diagnostika">
              Diagnostikani to'liq o'tish
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-16 text-lg border-slate-300">
            <Link href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-5 w-5" />
              Ekspert bilan uchrashuv
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
