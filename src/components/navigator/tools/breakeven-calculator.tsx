'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function BreakevenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [variableCost, setVariableCost] = useState('')
  
  const [result, setResult] = useState<{ salesNeeded: number; revenueNeeded: number } | null>(null)

  const calculateBreakeven = () => {
    const fc = parseFloat(fixedCosts) || 0
    const sp = parseFloat(salePrice) || 0
    const vc = parseFloat(variableCost) || 0

    const contributionMargin = sp - vc
    if (contributionMargin <= 0) {
      setResult({ salesNeeded: Infinity, revenueNeeded: Infinity })
      return
    }

    const salesNeeded = fc / contributionMargin
    const revenueNeeded = salesNeeded * sp

    setResult({
      salesNeeded,
      revenueNeeded
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Zararsizlik Nuqtasi (Break-even)</CardTitle>
        <CardDescription>Oylik xarajatlarni qoplash uchun qancha sotish kerak?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fixedCosts">Oylik doimiy xarajatlar (ijara, oylik va hk)</Label>
          <Input id="fixedCosts" type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} placeholder="Masalan: 3000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salePrice">Bitta mahsulot/xizmat narxi</Label>
          <Input id="salePrice" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Masalan: 50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="variableCost">Bitta mahsulot uchun o'zgaruvchi xarajat (tannarx)</Label>
          <Input id="variableCost" type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} placeholder="Masalan: 20" />
        </div>
        
        <Button onClick={calculateBreakeven} className="w-full bg-blue-900 text-white hover:bg-blue-800">
          Hisoblash
        </Button>

        {result && (
          <div className="mt-6 p-4 rounded-lg border bg-slate-50 border-slate-200">
            <h4 className="font-semibold text-lg mb-2">Natija:</h4>
            {result.salesNeeded === Infinity ? (
              <p className="text-red-600 font-medium">Mahsulot narxi uning tannarxidan past yoki teng. Siz har bir sotuvdan zarar qilyapsiz!</p>
            ) : (
              <div className="space-y-1 text-sm">
                <p>Zarar qilmaslik uchun sotilishi kerak bo'lgan son: <span className="font-bold">{Math.ceil(result.salesNeeded).toLocaleString()} ta</span></p>
                <p>Qilinishi kerak bo'lgan umumiy savdo aylanmasi: <span className="font-bold">{result.revenueNeeded.toLocaleString()}</span></p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Shu ko'rsatkichdan oshgan har qanday savdo - sizning sof foydangizga aylanadi.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
