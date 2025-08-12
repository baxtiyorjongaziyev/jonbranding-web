import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sevara Xolmanova",
    company: "Fidda",
    avatar: "SX",
    imageHint: "female entrepreneur portrait",
    quote: "Jon.Branding jamoasi bilan ishlash biz uchun juda katta yutuq bo'ldi. Ular shunchaki logotip chizib berishmadi, balki brendimizning ruhini, maqsadini tushunib, uni dizayn tiliga o'girib berishdi. Natijadan 100% mamnunmiz."
  },
  {
    name: "Sherzod Beknazarov",
    company: "Incontrol",
    avatar: "SB",
    imageHint: "male business owner",
    quote: "Baxtiyorjon va uning jamoasi o'z ishining ustalari. Jarayon boshidan oxirigacha juda aniq va shaffof olib borildi. Eng muhimi, natija biz kutgandan ham a'lo chiqdi. Korporativ uslubimiz endi xalqaro darajada."
  },
  {
    name: "Nodirbek",
    company: "Barakah Restoran",
    avatar: "N",
    imageHint: "restaurant manager portrait",
    quote: "Restoranimiz uchun yangi nom va logotip kerak edi. Jon.Branding bizga shunday variantlarni taklif qildiki, tanlashga qiynalib qoldik. Ularning kreativ yondashuvi va bozor tushunchasi juda kuchli."
  },
  {
    name: "Javohir Haqberdiyev",
    company: "Perfona",
    avatar: "JH",
    imageHint: "tech startup founder",
    quote: "Bizga faqat dizayn emas, strategik hamkor kerak edi. Jon.Branding bu vazifani a'lo darajada uddaladi. Ular bizning g'oyamizni chuqur o'rganib, unga mos vizual qiyofa yaratib berishdi."
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue">Mijozlarimiz biz haqimizda</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Bizning eng katta yutug'imiz - bu mamnun mijozlarimiz.
          </p>
        </div>
        <div className="mt-12">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                    {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                        <Card className="h-full flex flex-col justify-between p-6 bg-white shadow-lg rounded-2xl">
                            <div>
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                                </div>
                                <CardContent className="p-0 text-gray-700">
                                    <p>"{testimonial.quote}"</p>
                                </CardContent>
                            </div>
                            <div className="mt-6 flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={testimonial.name} data-ai-hint={testimonial.imageHint} />
                                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-dark-blue">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                                </div>
                            </div>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
