import { Metadata } from 'next'
import { RoiCalculator } from '@/components/navigator/tools/roi-calculator'
import { LtvCacCalculator } from '@/components/navigator/tools/ltv-cac-calculator'
import { BreakevenCalculator } from '@/components/navigator/tools/breakeven-calculator'
import { CustomerFitTest } from '@/components/navigator/tools/customer-fit-test'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Biznes Vositalari | Tez Natija 6 Navigator',
  description: 'Biznesni boshqarish uchun amaliy kalkulyatorlar va vositalar.',
}

export default function BusinessToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="space-y-4">
          <Link href="/uz/navigator" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Navigator bosh sahifasiga qaytish
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Biznes vositalari
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            Biznesingizdagi raqamlarni aniq hisoblash va to'g'ri qaror qabul qilish uchun amaliy vositalar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <RoiCalculator />
          <BreakevenCalculator />
          <LtvCacCalculator />
          <CustomerFitTest />
        </div>

      </div>
    </div>
  )
}
