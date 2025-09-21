
import { Medal, Users, Star, Award } from 'lucide-react';

const stats = [
  { icon: Medal, value: "9+", label: "Yillik tajriba" },
  { icon: Users, value: "500+", label: "Mamnun mijozlar" },
  { icon: Award, value: "1000+", label: "Muvaffaqiyatli loyiha" },
  { icon: Star, value: "90%", label: "Mijozlar tavsiya qilishadi" }
];

const Stats = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="border rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                    <stat.icon className="w-10 h-10 text-primary mb-2" />
                    <div className="text-3xl sm:text-4xl font-extrabold text-dark-blue">{stat.value}</div>
                    <div className="text-sm sm:text-base text-muted-foreground">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
