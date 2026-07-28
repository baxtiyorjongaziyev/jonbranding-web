import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertTriangle, ArrowRight, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sizning Natijangiz | Tez Natija 6 Navigator',
}

export default async function ResultPage(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = await props.searchParams
  const leadId = searchParams.id

  // For MVP, we will show a static result if ID is present or not, 
  // since we haven't wired up the full Supabase fetch logic yet.
  // In a real scenario, we'd fetch the lead by ID and calculate these dynamically.

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Sizning biznes diagnostika natijangiz
          </h1>
          <p className="text-lg text-slate-500">
            Javoblaringiz tahlil qilindi. Quyida asosiy xulosalar va harakatlar rejasi keltirilgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-red-100 bg-red-50/50 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800 text-xl">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Hozirgi holat va yo'qotishlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 font-medium">
                Biznesingizda savdo muammosidan oldin qiymatni tushuntirish muammosi bor.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>Samarasiz reklama budjeti</li>
                <li>Potensial foydali mijozlar</li>
                <li>Raqobatda boy berilayotgan vaqt</li>
                <li>Jamoaning bekorga sarflanayotgan energiyasi</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50/50 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 text-xl">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Sizga kerakli natija
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Mijoz sizdagi farqni tez tushunadigan, narxingizni asoslash oson bo‘ladigan va jamoangiz bir xil yo‘nalishda ishlaydigan tizim kerak.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">3 ta eng muhim ustuvor qadam</CardTitle>
            <CardDescription>Darhol bajarilishi kerak bo'lgan vazifalar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-4">1</span>
                <p className="text-slate-700 pt-1">Mijoz nima uchun aynan sizni tanlashini bitta aniq gapda belgilang.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-4">2</span>
                <p className="text-slate-700 pt-1">Eng foydali mijozlar guruhini ajrating va faqat shularga e'tibor qarating.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-4">3</span>
                <p className="text-slate-700 pt-1">Savdo va reklama materiallarini bitta tushunarli tizimga keltiring.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">30 kunlik harakatlar rejasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-xl bg-slate-50">
                <div className="font-bold text-slate-900 mb-2">1-hafta</div>
                <div className="text-blue-600 font-medium mb-1">Tahlil</div>
                <p className="text-sm text-slate-600">Raqobatchilarni va hozirgi mijozlarni chuqur o'rganish.</p>
              </div>
              <div className="p-4 border rounded-xl bg-slate-50">
                <div className="font-bold text-slate-900 mb-2">2-hafta</div>
                <div className="text-blue-600 font-medium mb-1">Taklif</div>
                <p className="text-sm text-slate-600">Noyob savdo taklifini (UTP) va qiymatni shakllantirish.</p>
              </div>
              <div className="p-4 border rounded-xl bg-slate-50">
                <div className="font-bold text-slate-900 mb-2">3-hafta</div>
                <div className="text-blue-600 font-medium mb-1">Joriy qilish</div>
                <p className="text-sm text-slate-600">Yangi xabarlarni savdo skriptlari va reklamaga joriy qilish.</p>
              </div>
              <div className="p-4 border rounded-xl bg-slate-50">
                <div className="font-bold text-slate-900 mb-2">4-hafta</div>
                <div className="text-blue-600 font-medium mb-1">O'lchash va yaxshilash</div>
                <p className="text-sm text-slate-600">Natijalarni kalkulyatorlar orqali o'lchash va optimallashtirish.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-900 rounded-2xl p-8 text-center text-white space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Natijangizni mutaxassis bilan birga tahlil qiling</h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            20 daqiqalik suhbatda asosiy muammo va keyingi qadamlarni birga ko'rib chiqamiz.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-slate-100 text-lg px-8 h-14">
            <Link href="https://t.me/baxtiyorjongaziyev" target="_blank" rel="noopener noreferrer">
              <Calendar className="mr-2 h-5 w-5" />
              Uchrashuv belgilash
            </Link>
          </Button>
        </div>

        <div className="text-center pt-8">
          <Link href="/uz/navigator/vositalar" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            Tavsiya etilgan biznes vositalaridan foydalanish
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
