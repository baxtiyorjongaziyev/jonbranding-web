'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export function CustomerFitTest() {
  const [answers, setAnswers] = useState({
    problemFit: false,
    decisionMaker: false,
    urgent: false,
    budget: false,
    cooperative: false,
  })

  const [showResult, setShowResult] = useState(false)

  const handleToggle = (key: keyof typeof answers) => {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }))
    setShowResult(false)
  }

  const getResult = () => {
    const score = Object.values(answers).filter(Boolean).length
    if (score === 5) return { text: 'Zo\'r mos mijoz!', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
    if (score >= 3) return { text: 'Hali to\'liq tayyor emas', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
    return { text: 'Ko\'p vaqt sarflamaslik kerak', color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
  }

  const result = showResult ? getResult() : null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mijozga Moslik Testi</CardTitle>
        <CardDescription>Suhbatlashayotgan inson sizning haqiqiy mijozingizmi?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <Checkbox checked={answers.problemFit} onCheckedChange={() => handleToggle('problemFit')} className="mt-1" />
            <span className="text-sm">Mijozning muammosi biz hal qiladigan muammoga mosmi?</span>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <Checkbox checked={answers.decisionMaker} onCheckedChange={() => handleToggle('decisionMaker')} className="mt-1" />
            <span className="text-sm">Qaror qabul qiluvchi odam (rahbar/investor) bilan gaplashyapmizmi?</span>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <Checkbox checked={answers.urgent} onCheckedChange={() => handleToggle('urgent')} className="mt-1" />
            <span className="text-sm">Mijoz uchun bu muammoni yechish hozir dolzarbmi?</span>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <Checkbox checked={answers.budget} onCheckedChange={() => handleToggle('budget')} className="mt-1" />
            <span className="text-sm">Mijoz yechim uchun kerakli budjetni ajratishga tayyormi?</span>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <Checkbox checked={answers.cooperative} onCheckedChange={() => handleToggle('cooperative')} className="mt-1" />
            <span className="text-sm">Jarayonda biz bilan hamkorlik qilishga tayyormi?</span>
          </label>
        </div>
        
        <Button onClick={() => setShowResult(true)} className="w-full bg-blue-900 text-white hover:bg-blue-800">
          Natijani Ko'rish
        </Button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${result.bg} text-center`}>
            <h4 className={`font-bold text-xl ${result.color}`}>{result.text}</h4>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
