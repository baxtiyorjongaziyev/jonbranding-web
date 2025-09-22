
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Phone, Send, Instagram, ArrowUp } from 'lucide-react';
import { Separator } from '../ui/separator';

const Footer = () => {

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-gray-300 relative overflow-hidden pt-16 sm:pt-24 pb-8">
       <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,hsl(var(--accent)/0.15),transparent)]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Biz bilan bog'laning</h3>
            <div className="mt-4 space-y-4">
               <a href="https://t.me/baxtiyorjon_gaziyev" target="_blank" rel="noopener noreferrer" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">@baxtiyorjon_gaziyev</p>
                  <p className="text-xs text-gray-400">Telegram orqali</p>
               </a>
               <a href="tel:+998336450097" className="block group">
                  <p className="font-semibold text-white group-hover:text-accent transition-colors text-lg">+998 33 645 00 97</p>
                  <p className="text-xs text-gray-400">Telefon orqali</p>
               </a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Xizmatlarimiz</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/xizmatlar/brand-strategy" className="text-gray-300 hover:text-white transition-colors">Brend Strategiyasi</Link></li>
              <li><Link href="/xizmatlar/neyming" className="text-gray-300 hover:text-white transition-colors">Neyming</Link></li>
              <li><Link href="/xizmatlar/firmenniy-stil" className="text-gray-300 hover:text-white transition-colors">Firma Uslubi</Link></li>
              <li><Link href="/xizmatlar/qadoq-dizayni" className="text-gray-300 hover:text-white transition-colors">Qadoq Dizayni</Link></li>
            </ul>
          </div>

          {/* Office */}
          <div>
            <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">Bizning ofisimiz</h3>
            <p className="mt-4 text-white font-semibold">
              O‘zbekiston, Toshkent shahri, <br/>
              Mustaqillik shoh ko'chasi, 59
            </p>
          </div>
        </div>

        <Separator className="my-12 bg-gray-700" />
        
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
           <p className="text-sm text-gray-400 order-2 sm:order-1">&copy; {new Date().getFullYear()} Jon.Branding. Barcha huquqlar himoyalangan.</p>
           
           <div className="flex items-center gap-6 order-1 sm:order-2">
             <a href="https://www.instagram.com/jon.branding" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Instagram size={20} />
             </a>
             <a href="https://t.me/jonbranding" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
               <Send size={20} />
             </a>
           </div>

           <div className="hidden lg:flex order-3">
              <button onClick={handleScrollTop} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                Yuqoriga qaytish <ArrowUp size={16} />
              </button>
           </div>
        </div>

        <div className="mt-16 text-center">
             <Link href="/">
                <Logo isWhite />
             </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
