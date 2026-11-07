'use client';

import { useEffect } from 'react';
import { captureLeadAttribution } from '@/lib/lead-attribution';

/**
 * Kirishdagi UTM va tashqi referrer'ni saqlaydi (K-2). Layout bir marta chiziladi, shuning uchun
 * effekt kirish sahifasida ishlaydi — mehmon keyin qaysi sahifada yozsa ham manba yo'qolmaydi.
 */
export default function LeadAttributionCapture() {
  useEffect(() => {
    captureLeadAttribution();
  }, []);
  return null;
}
