import { ReactNode } from 'react';
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  // Asosiy html va body teglari shu yerda bo'lishi kerak.
  // [lang] layout esa o'zining ichki elementlarini boshqaradi.
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
