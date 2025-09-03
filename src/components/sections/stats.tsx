import { Medal, Users, Star, Award } from 'lucide-react';

const stats = [
  { icon: Medal, value: "9+", label: "Yillik tajriba" },
  { icon: Users, value: "500+", label: "Mamnun mijozlar" },
  { icon: Award, value: "1000+", label: "Muvaffaqiyatli loyiha" },
  { icon: Star, value: "90%", label: "Mijozlar tavsiya qilishadi" }
];

const Stats = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="w-12 h-12 text-accent mb-3" />
              <div className="text-4xl sm:text-5xl font-extrabold text-white">{stat.value}</div>
              <div className="text-base sm:text-lg text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
