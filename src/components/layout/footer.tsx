import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Phone, Send, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo isWhite />
            <p className="max-w-xs text-gray-300">
             Strategiyaga asoslangan vizual ko‘rinish bilan biznesingizni keyingi bosqichga olib chiqing.
            </p>
          </div>
          
          <div className="md:justify-self-center">
            <h3 className="text-lg font-bold text-white">Sahifalar</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/#package-builder" className="text-gray-300 hover:text-accent transition-colors">Xizmatlar</Link></li>
              <li><Link href="/#portfolio" className="text-gray-300 hover:text-accent transition-colors">Portfolio</Link></li>
              <li><Link href="/xizmatlar/brand-strategy" className="text-gray-300 hover:text-accent transition-colors">Brend Strategiyasi</Link></li>
              <li><Link href="/#process" className="text-gray-300 hover:text-accent transition-colors">Jarayon</Link></li>
              <li><Link href="/#faq" className="text-gray-300 hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:justify-self-end">
            <h3 className="text-lg font-bold text-white">Aloqa</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2">
                <Send size={18} />
                <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-accent transition-colors">@baxtiyorjon_gaziyev</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href="tel:+998336450097" className="text-gray-300 hover:text-accent transition-colors">+998 33 645 00 97</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-gray-300 hover:text-accent transition-colors">O‘zbekiston, Toshkent shahri</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Jon.Branding. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
