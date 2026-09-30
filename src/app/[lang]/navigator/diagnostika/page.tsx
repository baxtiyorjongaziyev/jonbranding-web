import { Metadata } from 'next'
import { DiagnosticFlow } from '@/components/navigator/diagnostic-flow'
import { getDictionary, type Locale } from '@/lib/dictionaries'

export const metadata: Metadata = {
  title: 'Diagnostika | Tez Natija 6 Navigator',
  description: 'Biznesingiz holatini baholash uchun qisqa savollarga javob bering.',
}

type Props = { params: Promise<{ lang: string }> }

export default async function DiagnosticPage({ params }: Props) {
  const { lang } = await params
  const safeLang: Locale = ['uz', 'ru', 'en', 'zh'].includes(lang) ? (lang as Locale) : 'uz'
  const dictionary = await getDictionary(safeLang)

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <DiagnosticFlow lang={safeLang} errors={dictionary.navigatorErrors} />
    </div>
  )
}
