import { Metadata } from 'next'
import { DiagnosticFlow } from '@/components/navigator/diagnostic-flow'

export const metadata: Metadata = {
  title: 'Diagnostika | Tez Natija 6 Navigator',
  description: 'Biznesingiz holatini baholash uchun qisqa savollarga javob bering.',
}

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <DiagnosticFlow />
    </div>
  )
}
