'use client';

import { FC } from 'react';
import { HONEYPOT_FIELD } from '@/lib/lead-guard';

type HoneypotFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Botlar uchun tuzoq maydoni. Haqiqiy foydalanuvchi buni ko'rmaydi va
 * to'ldira olmaydi — to'ldirilgan bo'lsa, serverda lead jimgina tashlanadi.
 *
 * `display: none` ishlatilmaydi: ba'zi botlar shu uslubdagi maydonlarni
 * o'tkazib yuboradi. Shuning uchun maydonni ekrandan tashqariga chiqaramiz,
 * skrin-riderdan `aria-hidden`, klaviaturadan `tabIndex={-1}` yashiradi.
 */
export const HoneypotField: FC<HoneypotFieldProps> = ({ value, onChange }) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      left: '-9999px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }}
  >
    <label htmlFor={HONEYPOT_FIELD}>Kompaniya sayti</label>
    <input
      id={HONEYPOT_FIELD}
      name={HONEYPOT_FIELD}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

export default HoneypotField;
