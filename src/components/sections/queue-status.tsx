import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, CalendarClock, Hourglass } from 'lucide-react';

const QueueStatus = () => {
  // ** O'zgartirish uchun ma'lumotlar **
  const currentProjects = 4;
  const nextAvailable = "2 hafta";
  // *********************************

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto bg-secondary/50 rounded-2xl shadow-lg border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center items-center gap-4">
              <Hourglass className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl md:text-3xl text-dark-blue">
                Ishlarimiz Navbat Asosida
              </CardTitle>
            </div>
             <p className="text-gray-600 mt-2">
              Sifatli natija vaqt talab qiladi. Biz har bir loyihaga maksimal e'tibor qaratamiz.
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="bg-white/70 p-6 rounded-xl shadow-sm border">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-lg text-gray-700">Hozirda band loyihalar:</p>
                <p className="text-4xl md:text-5xl font-bold text-dark-blue my-2">{currentProjects} ta</p>
              </div>
              <div className="bg-white/70 p-6 rounded-xl shadow-sm border">
                <CalendarClock className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-lg text-gray-700">Yangi buyurtmalar uchun:</p>
                <p className="text-4xl md:text-5xl font-bold text-dark-blue my-2">{nextAvailable}</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Badge variant="destructive" className="text-base px-4 py-2 rounded-lg animate-subtle-pulse shadow-md">
                NAVBAT MAVJUD
              </Badge>
              <p className="text-sm text-gray-500 mt-3">
                O'z joyingizni band qilish uchun hoziroq bog'laning!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QueueStatus;
