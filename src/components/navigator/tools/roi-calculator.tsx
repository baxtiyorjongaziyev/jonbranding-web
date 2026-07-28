'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function RoiCalculator() {
  const [spent, setSpent] = useState('')
  const [revenue, setRevenue] = useState('')
  const [extraCosts, setExtraCosts] = useState('')
  const [result, setResult] = useState<{ netProfit: number; roi: number; isProfitable: boolean } | null>(null)

  const calculateROI = () => {
    const s = parseFloat(spent) || 0
    const r = parseFloat(revenue) || 0
    const e = parseFloat(extraCosts) || 0

    const totalCost = s + e
    const netProfit = r - totalCost
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0

    setResult({
      netProfit,
      roi,
      isProfitable: netProfit > 0
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ROI Kalkulyatori</CardTitle>
        <CardDescription>Sarmoyangiz o'zini oqlaganini hisoblang</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="spent">Sarflangan pul (reklama va hk)</Label>
          <Input id="spent" type="number" value={spent} onChange={(e) => setSpent(e.target.value)} placeholder="Masalan: 1000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="revenue">Olingan daromad</Label>
          <Input id="revenue" type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="Masalan: 5000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="extraCosts">Qo'shimcha xarajatlar</Label>
          <Input id="extraCosts" type="number" value={extraCosts} onChange={(e) => setExtraCosts(e.target.value)} placeholder="Masalan: 200" />
        </div>
        
        <Button onClick={calculateROI} className="w-full bg-blue-900 text-white hover:bg-blue-800">
          Hisoblash
        </Button>

        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${result.isProfitable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className="font-semibold text-lg mb-2">Natija:</h4>
            <div className="space-y-1 text-sm">
              <p>Sof foyda: <span className="font-bold">{result.netProfit.toLocaleString()}</span></p>
              <p>ROI (Qaytish darajasi): <span className="font-bold">{result.roi.toFixed(1)}%</span></p>
              <p className="mt-2 text-sm font-medium">
                {result.isProfitable 
                  ? "Ajoyib! Sarmoya o'zini oqladi va foyda keltirdi." 
                  : "Sarmoya o'zini oqlamadi. Xarajatlarni yoki savdo jarayonini qayta ko'rib chiqing."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
