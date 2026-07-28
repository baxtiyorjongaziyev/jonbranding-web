'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function LtvCacCalculator() {
  const [avgPurchase, setAvgPurchase] = useState('')
  const [purchaseFrequency, setPurchaseFrequency] = useState('')
  const [customerLifetime, setCustomerLifetime] = useState('')
  const [acquisitionCost, setAcquisitionCost] = useState('')
  
  const [result, setResult] = useState<{ ltv: number; cac: number; ratio: number } | null>(null)

  const calculateLTVCAC = () => {
    const a = parseFloat(avgPurchase) || 0
    const f = parseFloat(purchaseFrequency) || 0
    const l = parseFloat(customerLifetime) || 0
    const cac = parseFloat(acquisitionCost) || 0

    const ltv = a * f * l
    const ratio = cac > 0 ? (ltv / cac) : 0

    setResult({
      ltv,
      cac,
      ratio
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>LTV va CAC Kalkulyatori</CardTitle>
        <CardDescription>Bitta mijoz sizga qancha pul olib keladi va uni jalb qilish qanchaga tushadi?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="avgPurchase">O'rtacha xarid summasi</Label>
          <Input id="avgPurchase" type="number" value={avgPurchase} onChange={(e) => setAvgPurchase(e.target.value)} placeholder="Masalan: 500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseFrequency">Yiliga necha marta xarid qiladi?</Label>
          <Input id="purchaseFrequency" type="number" value={purchaseFrequency} onChange={(e) => setPurchaseFrequency(e.target.value)} placeholder="Masalan: 2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerLifetime">Mijoz necha yil siz bilan qoladi?</Label>
          <Input id="customerLifetime" type="number" value={customerLifetime} onChange={(e) => setCustomerLifetime(e.target.value)} placeholder="Masalan: 3" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquisitionCost">Bitta mijoz jalb qilish xarajati (CAC)</Label>
          <Input id="acquisitionCost" type="number" value={acquisitionCost} onChange={(e) => setAcquisitionCost(e.target.value)} placeholder="Masalan: 100" />
        </div>
        
        <Button onClick={calculateLTVCAC} className="w-full bg-blue-900 text-white hover:bg-blue-800">
          Hisoblash
        </Button>

        {result && (
          <div className="mt-6 p-4 rounded-lg border bg-slate-50 border-slate-200">
            <h4 className="font-semibold text-lg mb-2">Natija:</h4>
            <div className="space-y-1 text-sm">
              <p>Mijoz olib keladigan umumiy summa (LTV): <span className="font-bold">{result.ltv.toLocaleString()}</span></p>
              <p>Mijozni jalb qilish narxi (CAC): <span className="font-bold">{result.cac.toLocaleString()}</span></p>
              <p>LTV/CAC nisbati: <span className="font-bold">{result.ratio.toFixed(1)}:1</span></p>
              <p className="mt-3 text-sm font-medium">
                {result.ratio >= 3 
                  ? "Sog'lom ko'rsatkich! (Yaxshi bizneslarda nisbat 3:1 yoki undan yuqori bo'ladi)." 
                  : "Xavfli ko'rsatkich! Mijoz jalb qilish narxini tushirish yoki xaridni ko'paytirish kerak."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
