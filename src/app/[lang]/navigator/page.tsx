import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Biznes Navigator | Tez Natija 6',
  description: 'Biznesingizdagi eng katta o‘sish nuqtasini 10 daqiqada aniqlang.',
}

export default function NavigatorLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800">
            Tez Natija 6 Ishtirokchilari Uchun
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Biznesingizdagi eng katta <span className="text-blue-900">o‘sish nuqtasini</span> 10 daqiqada aniqlang.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Muammoingizni tanlang, hozir nimani yo‘qotayotganingizni biling va keyingi aniq qadamlarni oling.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-blue-900 hover:bg-blue-800">
            <Link href="/uz/navigator/diagnostika">
              Diagnostikani boshlash
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 border-slate-300">
            <Link href="/uz/navigator/vositalar">
              <Calculator className="mr-2 h-5 w-5" />
              Biznes vositalarini ko‘rish
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
