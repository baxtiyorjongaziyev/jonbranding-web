'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Sliders,
  Users,
  Target,
  FileText
} from 'lucide-react';
import { getDictionary, Locale } from '@/lib/dictionaries';
import ContactModal from '@/components/contact-modal';

interface OnlineBriefWizardProps {
  lang: Locale;
}

const OnlineBriefWizard: FC<OnlineBriefWizardProps> = ({ lang }) => {
  const [translations, setTranslations] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [packageSummary, setPackageSummary] = useState('');

  // Step 1: Business sphere
  const [sphere, setSphere] = useState<'offline' | 'online' | 'product' | null>(null);

  // Step 2: Visual styles (multiple choice)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Step 3: Scales (0-100 range values, default 50)
  const [scales, setScales] = useState({
    exclusiveMass: 50,
    seriousPlayful: 50,
    restrainedBold: 50,
    friendlyFormal: 50,
    traditionalInnovative: 50
  });

  // Step 4: Target audience
  const [genders, setGenders] = useState<string[]>([]);
  const [ages, setAges] = useState<string[]>([]);
  const [motives, setMotives] = useState<string[]>([]);

  // Step 5: Naming, details & services
  const [brandName, setBrandName] = useState('');
  const [needNaming, setNeedNaming] = useState(false);
  const [description, setDescription] = useState('');
  const [benefit, setBenefit] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    getDictionary(lang).then(dict => {
      setTranslations(dict.onlineBrief);
    });
  }, [lang]);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleGender = (gender: string) => {
    setGenders(prev =>
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const toggleAge = (age: string) => {
    setAges(prev =>
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  const toggleMotive = (motive: string) => {
    setMotives(prev =>
      prev.includes(motive) ? prev.filter(m => m !== motive) : [...prev, motive]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const nextStep = () => {
    if (step < 5) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const isStepValid = useMemo(() => {
    if (step === 1) return sphere !== null;
    if (step === 2) return selectedStyles.length > 0;
    if (step === 4) return genders.length > 0 && ages.length > 0 && motives.length > 0;
    if (step === 5) {
      const isNameValid = needNaming || brandName.trim().length > 0;
      return isNameValid && description.trim().length > 0 && benefit.trim().length > 0 && selectedServices.length > 0;
    }
    return true; // Step 3 ranges are always valid (default 50)
  }, [step, sphere, selectedStyles, genders, ages, motives, brandName, needNaming, description, benefit, selectedServices]);

  const handleFinish = () => {
    // Compile a beautiful summary string for the lead
    const resultObj = {
      sphere: sphere === 'offline' ? 'Oflayn-biznes' : sphere === 'online' ? 'Onlayn-biznes' : 'Tovar biznesi',
      styles: selectedStyles.join(', '),
      scales: `Eksklyuziv-Ommaviy: ${scales.exclusiveMass}%, Jiddiy-Sho'x: ${scales.seriousPlayful}%, Vazmin-Darsketar: ${scales.restrainedBold}%, Samimiy-Rasmiy: ${scales.friendlyFormal}%, An'anaviy-Innovatsion: ${scales.traditionalInnovative}%`,
      genders: genders.join(', '),
      ages: ages.join(', '),
      motives: motives.join(', '),
      brandName: needNaming ? "Neyming kerak (yordam bering)" : brandName,
      description,
      benefit,
      services: selectedServices.join(', ')
    };

    const summaryStr = `
[Smart Brief]
Soha: ${resultObj.sphere}
Tanlangan uslublar: ${resultObj.styles}
Xarakter ko'rsatkichlari: ${resultObj.scales}
Jins: ${resultObj.genders} | Yoshi: ${resultObj.ages}
Iste'mol motivlari: ${resultObj.motives}
Brend nomi: ${resultObj.brandName}
Mahsulot tavsifi: ${resultObj.description}
Asosiy afzalligi: ${resultObj.benefit}
Kutilayotgan xizmatlar: ${resultObj.services}
    `.trim();

    setPackageSummary(summaryStr);
    setModalOpen(true);
  };

  if (!translations) {
    return <Skeleton className="h-[500px] w-full container max-w-4xl mx-auto rounded-3xl" />;
  }

  const { steps: stepNames, step1, step2, step3, step4, step5, buttons, success } = translations;

  // Total progress percentage (20% per step)
  const progressValue = step * 20;

  // Custom visual styles for Step 2
  const visualStyles = [
    { id: 'minimalist', title: lang === 'uz' ? 'Minimalistik & Toza' : lang === 'ru' ? 'Минималистичный & Чистый' : 'Minimalist & Clean', desc: lang === 'uz' ? 'Oddiy, tushunarli va keraksiz elementlarsiz' : lang === 'ru' ? 'Простой, понятный и без лишних деталей' : 'Simple, clear and without clutter', gradient: 'from-[#E2E8F0] to-[#cbd5e1] text-gray-800' },
    { id: 'classic', title: lang === 'uz' ? 'Klassik & Elegant' : lang === 'ru' ? 'Классический & Элегантный' : 'Classic & Elegant', desc: lang === 'uz' ? 'Oliyjanob, statusli va an\'anaviy qadriyatlar' : lang === 'ru' ? 'Благородный, статусный и традиционный' : 'Noble, prestigious and traditional', gradient: 'from-[#1e293b] to-[#0f172a] text-amber-100 border border-amber-500/20' },
    { id: 'bold', title: lang === 'uz' ? 'Kuchli & Dadil' : lang === 'ru' ? 'Сильный & Дерзкий' : 'Bold & Powerful', desc: lang === 'uz' ? 'Yorqin ranglar, qalin fontlar, e\'tiborni tortuvchi' : lang === 'ru' ? 'Яркие цвета, жирные шрифты, привлекающие внимание' : 'Vibrant colors, bold fonts, attention-grabbing', gradient: 'from-[#EF5121] to-[#ff7a59] text-white' },
    { id: 'playful', title: lang === 'uz' ? 'Sho\'x & Rang-barang' : lang === 'ru' ? 'Игривый & Разноцветный' : 'Playful & Colorful', desc: lang === 'uz' ? 'Dinamik, samimiy va hissiyotlarga boy' : lang === 'ru' ? 'Динамичный, искренний и эмоциональный' : 'Dynamic, sincere and full of emotion', gradient: 'from-[#fbbf24] to-[#f59e0b] text-[#0B0F17]' },
    { id: 'eco', title: lang === 'uz' ? 'Ekologik & Tabiiy' : lang === 'ru' ? 'Экологичный & Натуральный' : 'Eco-friendly & Organic', desc: lang === 'uz' ? 'Tabiiy ranglar, yumshoq teksturalar, barqarorlik' : lang === 'ru' ? 'Природные цвета, мягкие текстуры, экологичность' : 'Natural colors, soft textures, sustainability', gradient: 'from-[#059669] to-[#10b981] text-white' },
    { id: 'tech', title: lang === 'uz' ? 'Texnologik & Zamonaviy' : lang === 'ru' ? 'Технологичный & Современный' : 'Tech-savvy & Modern', desc: lang === 'uz' ? 'Futuristik elementlar, toza neon nurlari' : lang === 'ru' ? 'Футуристичные элементы, чистые неоновые линии' : 'Futuristic elements, clean neon lines', gradient: 'from-[#2563eb] to-[#3b82f6] text-white' },
    { id: 'retro', title: lang === 'uz' ? 'Retro & Vintage' : lang === 'ru' ? 'Ретро & Винтаж' : 'Retro & Vintage', desc: lang === 'uz' ? 'Nostalgiya, teksturalar, o\'tmish jozibasi' : lang === 'ru' ? 'Ностальгия, винтажные текстуры, шарм прошлого' : 'Nostalgia, vintage textures, charm of the past', gradient: 'from-[#b45309] to-[#d97706] text-white' },
    { id: 'luxury', title: lang === 'uz' ? 'Premium & Hashamatli' : lang === 'ru' ? 'Премиум & Роскошный' : 'Premium & Luxury', desc: lang === 'uz' ? 'Yuqori sifat, cheklangan nashr, minimalist hashamat' : lang === 'ru' ? 'Высокое качество, лимитированность, минималистичный люкс' : 'High quality, limited edition, minimalist luxury', gradient: 'from-[#7c3aed] to-[#8b5cf6] text-white' }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4">
      {/* Top Header with step label and progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={prevStep}
            disabled={step === 1}
            variant="ghost"
            className="rounded-full text-gray-600 hover:bg-[#FAF8F5] disabled:opacity-0"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {buttons.prev}
          </Button>
          <span className="font-mono text-sm text-gray-500 uppercase tracking-widest">
            {step} / 5 — {stepNames[`step${step}`]}
          </span>
        </div>
        <Progress value={progressValue} className="h-2 bg-[#FAF8F5] border border-[#e4dfd3]" />
      </div>

      <Card className="border border-[#e4dfd3] bg-[#FAF8F5]/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden min-h-[500px] flex flex-col justify-between p-8 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-grow flex flex-col justify-center"
          >
            {/* STEP 1: Business sphere */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-[#0B0F17] font-serif italic">
                    {step1.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'offline', title: step1.offline, desc: step1.offlineDesc, icon: '🏪' },
                    { id: 'online', title: step1.online, desc: step1.onlineDesc, icon: '📱' },
                    { id: 'product', title: step1.product, desc: step1.productDesc, icon: '📦' }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSphere(item.id as any)}
                      className={`cursor-pointer p-6 rounded-2xl border text-left w-full transition-all duration-300 flex flex-col justify-between min-h-[180px] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                        sphere === item.id
                          ? 'border-[#0B0F17] bg-[#EFEEEC] shadow-md ring-1 ring-[#0B0F17]'
                          : 'border-[#cbd5e1] hover:border-gray-400 bg-white shadow-sm'
                      }`}
                    >
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <h4 className="font-extrabold text-lg text-[#0B0F17] mt-4">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Visual styles selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0B0F17] font-serif italic">
                    {step2.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">{step2.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto pr-2">
                  {visualStyles.map(style => {
                    const isSelected = selectedStyles.includes(style.title);
                    return (
                      <button
                        type="button"
                        key={style.id}
                        onClick={() => toggleStyle(style.title)}
                        className={`cursor-pointer rounded-2xl p-4 border text-left w-full transition-all duration-300 relative select-none min-h-[140px] flex flex-col justify-between active:scale-[0.97] bg-gradient-to-br focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${style.gradient} ${
                          isSelected ? 'shadow-lg ring-2 ring-[#0B0F17]' : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-start w-full">
                            <span className="font-extrabold text-sm leading-tight">{style.title}</span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#0B0F17] text-white flex items-center justify-center border border-white shrink-0 ml-2">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mt-2 opacity-80 leading-normal">{style.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Brand Character Scales */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0B0F17] font-serif italic">
                    {step3.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">{step3.subtitle}</p>
                </div>

                <div className="space-y-5 bg-white border border-[#e4dfd3] p-6 rounded-2xl">
                  {[
                    { key: 'exclusiveMass', left: step3.scales.exclusive, right: step3.scales.mass },
                    { key: 'seriousPlayful', left: step3.scales.serious, right: step3.scales.playful },
                    { key: 'restrainedBold', left: step3.scales.restrained, right: step3.scales.bold },
                    { key: 'friendlyFormal', left: step3.scales.friendly, right: step3.scales.formal },
                    { key: 'traditionalInnovative', left: step3.scales.traditional, right: step3.scales.innovative }
                  ].map(scale => (
                    <div key={scale.key} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono font-bold text-gray-600">
                        <span>{scale.left}</span>
                        <span>{scale.right}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={(scales as any)[scale.key]}
                          onChange={e =>
                            setScales(prev => ({
                              ...prev,
                              [scale.key]: parseInt(e.target.value)
                            }))
                          }
                          className="w-full h-2 rounded-lg bg-gray-200 accent-[#0B0F17] cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Target audience & Motives */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0B0F17] font-serif italic">
                    {step4.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Gender & Age */}
                  <div className="md:col-span-5 space-y-6">
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-sm text-[#0B0F17] flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {step4.gender}
                      </h4>
                      <div className="flex gap-2">
                        {[
                          { id: 'm', label: step4.male },
                          { id: 'f', label: step4.female },
                          { id: 'a', label: step4.any }
                        ].map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleGender(item.label)}
                            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              genders.includes(item.label)
                                ? 'bg-[#0B0F17] text-white border-[#0B0F17]'
                                : 'bg-white border-[#cbd5e1] text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="font-bold text-sm text-[#0B0F17] flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {lang === 'uz' ? 'Yoshi' : lang === 'ru' ? 'Возраст' : 'Age group'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          lang === 'uz' ? '0-18 (Bolalar)' : lang === 'ru' ? '0-18 (Дети/Подростки)' : '0-18 (Kids/Teens)',
                          lang === 'uz' ? '18-25 (Yoshlar)' : lang === 'ru' ? '18-25 (Молодежь)' : '18-25 (Youth)',
                          lang === 'uz' ? '25-45 (Faol yoshlar)' : lang === 'ru' ? '25-45 (Активные)' : '25-45 (Adults)',
                          lang === 'uz' ? '45+ (Kattalar)' : lang === 'ru' ? '45+ (Старшие)' : '45+ (Seniors)'
                        ].map(label => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleAge(label)}
                            className={`py-2 px-3 rounded-full text-[11px] font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              ages.includes(label)
                                ? 'bg-[#0B0F17] text-white border-[#0B0F17]'
                                : 'bg-white border-[#cbd5e1] text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Motives selection */}
                  <div className="md:col-span-7 space-y-2.5">
                    <h4 className="font-bold text-sm text-[#0B0F17] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {step4.motivesTitle}
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-2">
                      {[
                        { id: 'safety', label: step4.motives.safety },
                        { id: 'fullness', label: step4.motives.fullness },
                        { id: 'control', label: step4.motives.control },
                        { id: 'leadership', label: step4.motives.leadership },
                        { id: 'unity', label: step4.motives.unity },
                        { id: 'change', label: step4.motives.change }
                      ].map(motive => {
                        const isSelected = motives.includes(motive.label);
                        return (
                          <button
                            type="button"
                            key={motive.id}
                            onClick={() => toggleMotive(motive.label)}
                            className={`cursor-pointer p-3 rounded-xl border text-left w-full text-xs flex justify-between items-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              isSelected
                                ? 'bg-[#0B0F17]/5 border-[#0B0F17] font-bold'
                                : 'bg-white border-[#cbd5e1] hover:border-gray-400'
                            }`}
                          >
                            <span>{motive.label}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                              isSelected ? 'bg-[#0B0F17] border-[#0B0F17] text-white' : 'border-[#cbd5e1]'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Product details, Naming, Services */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0B0F17] font-serif italic">
                    {step5.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand name & Description */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand-name" className="text-xs font-bold text-[#0B0F17]">
                        {step5.brandName}
                      </Label>
                      <div className="flex gap-4 items-center">
                        <Input
                          id="brand-name"
                          disabled={needNaming}
                          placeholder={step5.brandNamePlaceholder}
                          value={brandName}
                          onChange={e => setBrandName(e.target.value)}
                          className="rounded-xl border-[#cbd5e1] focus:ring-[#0B0F17]"
                        />
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          id="need-naming"
                          checked={needNaming}
                          onCheckedChange={checked => setNeedNaming(!!checked)}
                        />
                        <Label htmlFor="need-naming" className="text-xs cursor-pointer font-semibold text-gray-600">
                          {step5.needNaming}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-desc" className="text-xs font-bold text-[#0B0F17]">
                        {step5.description}
                      </Label>
                      <Textarea
                        id="product-desc"
                        placeholder={step5.descriptionPlaceholder}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="rounded-xl min-h-[90px] border-[#cbd5e1]"
                      />
                    </div>
                  </div>

                  {/* Benefit & Services */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-benefit" className="text-xs font-bold text-[#0B0F17]">
                        {step5.benefit}
                      </Label>
                      <Textarea
                        id="product-benefit"
                        placeholder={step5.benefitPlaceholder}
                        value={benefit}
                        onChange={e => setBenefit(e.target.value)}
                        className="rounded-xl min-h-[90px] border-[#cbd5e1]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-[#0B0F17] flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {step5.servicesTitle}
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'strategy', label: step5.services.strategy },
                          { id: 'identity', label: step5.services.identity },
                          { id: 'brandbook', label: step5.services.brandbook },
                          { id: 'packaging', label: step5.services.packaging },
                          { id: 'website', label: step5.services.website }
                        ].map(service => {
                          const isSelected = selectedServices.includes(service.label);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => toggleService(service.label)}
                              className={`py-2 px-3 rounded-xl text-left w-full text-[11px] font-semibold transition-all border flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0F17] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                                isSelected
                                  ? 'bg-[#0B0F17]/5 border-[#0B0F17] text-[#0B0F17] font-bold'
                                  : 'bg-white border-[#cbd5e1] text-gray-600 hover:border-gray-400'
                              }`}
                            >
                              <span>{service.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-1 text-[#0B0F17]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#e4dfd3] flex justify-between items-center">
          <div className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-4 h-4 text-[#EF5121]" />
            <span>Premium Security</span>
          </div>

          <div className="flex gap-4">
            {step < 5 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid}
                size="lg"
                className="rounded-full h-12 px-6 text-sm font-bold bg-[#0B0F17] hover:bg-[#1a2333] transition-all flex items-center gap-2 shadow-lg"
              >
                {buttons.next}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={!isStepValid}
                size="lg"
                className="rounded-full h-12 px-8 text-sm font-bold bg-[#EF5121] hover:bg-[#ff673d] text-white transition-all flex items-center gap-2 shadow-lg animate-pulse"
              >
                <CheckCircle className="w-4 h-4" />
                {buttons.submit}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        packageSummary={packageSummary}
        lang={lang}
      />
    </div>
  );
};

export default OnlineBriefWizard;
