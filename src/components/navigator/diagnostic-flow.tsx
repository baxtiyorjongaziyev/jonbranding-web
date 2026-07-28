'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PAIN_POINTS, DESIRED_RESULTS, QUESTIONS, ANSWER_OPTIONS } from '@/lib/navigator-data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'

type Step = 'PAIN' | 'RESULT' | 'QUESTIONS' | 'CONTACT'

export function DiagnosticFlow() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<Step>('PAIN')
  const [selectedPains, setSelectedPains] = useState<string[]>([])
  const [selectedResult, setSelectedResult] = useState<string>('')
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  
  const [contact, setContact] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    industry: '',
    socialLink: '',
    region: '',
    teamName: '',
    consent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const togglePain = (id: string) => {
    setSelectedPains(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const handleAnswer = (val: string) => {
    const qId = QUESTIONS[currentQIndex].id
    setAnswers(prev => ({ ...prev, [qId]: val }))
    
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1)
    } else {
      setStep('CONTACT')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contact.consent) return

    setIsSubmitting(true)
    try {
      // Calculate basic score
      let totalScore = 0
      Object.keys(answers).forEach(qId => {
        const val = answers[qId]
        const opt = ANSWER_OPTIONS.find(o => o.value === val)
        if (opt) totalScore += opt.score
      })

      const { data, error } = await supabase.from('navigator_leads').insert({
        full_name: contact.fullName,
        company_name: contact.companyName,
        industry: contact.industry,
        contact: contact.phone, // mapping phone to contact
        consent: contact.consent,
        selected_pains: selectedPains,
        desired_results: [selectedResult], // Stored as array for future proofing
        diagnostic_answers: answers,
        total_score: totalScore,
        source: 'TezNatija_Diagnostic'
      }).select().single()

      if (error) throw error

      // Redirect to result page, passing the inserted ID or just using local storage
      // For MVP, we pass it via query param
      router.push(`/uz/navigator/natija?id=${data.id}`)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    }
  }

  if (step === 'PAIN') {
    return (
      <Card className="w-full max-w-3xl mx-auto border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <div className="text-sm text-blue-600 font-semibold mb-2">1 / 4 QADAM</div>
          <CardTitle className="text-2xl sm:text-3xl">Hozir biznesingizda qaysi holat sizni ko‘proq qiynayapti?</CardTitle>
          <CardDescription>Ko'pi bilan 3 ta muammoni tanlang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAIN_POINTS.map(p => (
              <button
                key={p.id}
                onClick={() => togglePain(p.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedPains.includes(p.id) 
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{p.title}</div>
                <div className="text-sm text-slate-500 mt-1">{p.description}</div>
              </button>
            ))}
          </div>
          <div className="pt-6 flex justify-end">
            <Button 
              size="lg" 
              onClick={() => setStep('RESULT')}
              disabled={selectedPains.length === 0}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Keyingi qadam
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'RESULT') {
    return (
      <Card className="w-full max-w-3xl mx-auto border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <div className="text-sm text-blue-600 font-semibold mb-2">2 / 4 QADAM</div>
          <CardTitle className="text-2xl sm:text-3xl">Qaysi natijaga tezroq erishmoqchisiz?</CardTitle>
          <CardDescription>Asosiy maqsadingizni belgilang.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DESIRED_RESULTS.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedResult(r.id)
                  setStep('QUESTIONS')
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedResult === r.id
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{r.title}</div>
              </button>
            ))}
          </div>
          <div className="pt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep('PAIN')}>Ortga</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (step === 'QUESTIONS') {
    const q = QUESTIONS[currentQIndex]
    const progress = ((currentQIndex) / QUESTIONS.length) * 100

    return (
      <Card className="w-full max-w-2xl mx-auto border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <div className="text-sm text-blue-600 font-semibold mb-2">3 / 4 QADAM - {q.category}</div>
          <Progress value={progress} className="h-2 mb-4" />
          <CardTitle className="text-xl sm:text-2xl mt-4 leading-snug">{q.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-3">
            {ANSWER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-left font-medium text-slate-900 transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="pt-6">
             {/* Back button logic for questions */}
             {currentQIndex > 0 && (
               <Button variant="ghost" onClick={() => setCurrentQIndex(i => i - 1)} className="text-slate-500">
                 Bitta orqaga
               </Button>
             )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // CONTACT STEP
  return (
    <Card className="w-full max-w-xl mx-auto border-0 shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <div className="text-sm text-blue-600 font-semibold mb-2">4 / 4 QADAM</div>
        <CardTitle className="text-2xl sm:text-3xl">Natijangiz tayyor!</CardTitle>
        <CardDescription>To'liq hisobot va keyingi qadamlar rejasini olish uchun ma'lumotlarni kiriting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Ism</Label>
            <Input id="fullName" required value={contact.fullName} onChange={e => setContact({...contact, fullName: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Kompaniya nomi</Label>
              <Input id="companyName" required value={contact.companyName} onChange={e => setContact({...contact, companyName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Faoliyat sohasi</Label>
              <Input id="industry" required value={contact.industry} onChange={e => setContact({...contact, industry: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqami</Label>
                <Input id="phone" required type="tel" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} placeholder="+998" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Hudud</Label>
                <Input id="region" required value={contact.region} onChange={e => setContact({...contact, region: e.target.value})} placeholder="Toshkent" />
              </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialLink">Instagram yoki sayt</Label>
            <Input id="socialLink" value={contact.socialLink} onChange={e => setContact({...contact, socialLink: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamName">Tez Natija 6 jamoa nomi (Ixtiyoriy)</Label>
            <Input id="teamName" value={contact.teamName} onChange={e => setContact({...contact, teamName: e.target.value})} />
          </div>
          
          <div className="pt-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <Checkbox 
                required 
                checked={contact.consent} 
                onCheckedChange={(c) => setContact({...contact, consent: c === true})} 
                className="mt-1" 
              />
              <span className="text-sm text-slate-600 leading-snug">
                Natijam va foydali tavsiyalarni olishga roziman.
              </span>
            </label>
          </div>

          <Button type="submit" disabled={isSubmitting || !contact.consent} className="w-full mt-4 h-12 text-lg bg-blue-900 hover:bg-blue-800">
            {isSubmitting ? "Yuklanmoqda..." : "Natijani ko'rish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
