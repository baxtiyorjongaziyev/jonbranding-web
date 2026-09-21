'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Target,
  TrendingUp,
  Sparkles,
  History,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageComparisonSlider from '@/components/image-comparison-slider';
import { Button } from '@/components/ui/button';
import { renderHeadline } from '@/lib/headline';
import { cn } from '@/lib/utils';
import { BeforeAfterDictionary } from '@/lib/types/dictionary';

interface SanityComparison {
  brand: string;
  oldImg: string;
  newImg: string;
  oldHint?: string;
  newHint?: string;
  order?: number;
}

interface BeforeAfterProps {
  lang: string;
  dictionary: BeforeAfterDictionary;
  comparisons?: SanityComparison[];
}

interface TransformationDossier {
  id: string;
  brand: string;
  slug: string;
  category: Record<string, string>;
  year: string;
  oldImg: string;
  newImg: string;
  oldHint: Record<string, string>;
  newHint: Record<string, string>;
  problem: Record<string, string>;
  solution: Record<string, string>;
  metrics: Array<{ value: string; label: Record<string, string> }>;
  order: number;
}

const FEATURED_TRANSFORMATIONS: TransformationDossier[] = [
  {
    id: 'den-aroma',
    brand: 'Den Aroma',
    slug: 'den-aroma',
    category: {
      uz: 'Parfyumeriya & Kosmetika',
      ru: 'Парфюмерия и косметика',
      en: 'Perfumery & Cosmetics',
      zh: '香水与美妆',
    },
    year: '2025',
    oldImg: '/images/cms/denaroma-avval.webp',
    newImg: '/images/cms/denaroma-hozir.webp',
    oldHint: {
      uz: '3 Atirchi (Eski brending)',
      ru: '3 Atirchi (Старый брендинг)',
      en: '3 Atirchi (Old branding)',
      zh: '3 Atirchi (旧品牌)',
    },
    newHint: {
      uz: 'Den Aroma (Yangi premium aydentika)',
      ru: 'Den Aroma (Новая премиум айдентика)',
      en: 'Den Aroma (New premium identity)',
      zh: 'Den Aroma (全新高端品牌)',
    },
    problem: {
      uz: "Avvalgi '3 Atirchi' nomi ostida oddiy do'kon bo'lib, arzon ko'rinardi. Xaridorlar doim 'nega qimmat?' deb e'tiroz bildirar, premium segmentga chiqish va yuqori chekda sotish imkonsiz edi.",
      ru: "Под старым названием '3 Atirchi' магазин воспринимался как бюджетный. Клиенты постоянно спорили о ценах, а выход в премиальный сегмент был закрыт.",
      en: "Under the old '3 Atirchi' name, the shop looked like a discount stall. Customers questioned high prices, preventing entry into the lucrative luxury market.",
      zh: '在旧名称 3 Atirchi 下，店铺显得平价低端，客户不断对价格产生异议，无法打入高客单价的高端市场。',
    },
    solution: {
      uz: "Nomini 'Den Aroma'ga o'zgartirdik, minimalist oliyjanob uslub, qadoqlar tizimi hamda barcha aloqa nuqtalarini tartibga soluvchi 120 betlik mukammal brendbuk yaratdik.",
      ru: 'Разработали новое имя Den Aroma, благородный визуальный минимализм, дизайн упаковки и исчерпывающий брендбук на 120 страниц.',
      en: 'Engineered the new Den Aroma name, noble minimalist visual identity, luxury packaging, and a rigorous 120-page brandbook.',
      zh: '全新更名为 Den Aroma，打造极简高贵视觉风格、系列包装，并制定了120页系统化品牌手册。',
    },
    metrics: [
      {
        value: '+178%',
        label: {
          uz: "Savdo o'sishi",
          ru: 'Рост продаж',
          en: 'Sales growth',
          zh: '销售增长',
        },
      },
      {
        value: '3.2x',
        label: {
          uz: 'Brend qiymati',
          ru: 'Стоимость бренда',
          en: 'Brand valuation',
          zh: '品牌估值',
        },
      },
      {
        value: 'Top-3',
        label: {
          uz: 'Bozor ulushi',
          ru: 'Доля рынка',
          en: 'Market position',
          zh: '市场地位',
        },
      },
    ],
    order: 1,
  },
  {
    id: 'savod',
    brand: 'Savod',
    slug: 'savod',
    category: {
      uz: 'EdTech & FinTech',
      ru: 'EdTech и FinTech',
      en: 'EdTech & FinTech',
      zh: '教育科技与金融',
    },
    year: '2025',
    oldImg: '/images/cms/savod-avval.webp',
    newImg: '/images/cms/savod-hozir.webp',
    oldHint: {
      uz: 'Avvalgi oddiy ko\'rinish',
      ru: 'Прежний типовой стиль',
      en: 'Previous generic identity',
      zh: '之前平庸的视觉',
    },
    newHint: {
      uz: 'Savod (Yangi premium aydentika)',
      ru: 'Savod (Новая премиум айдентика)',
      en: 'Savod (New premium identity)',
      zh: 'Savod (全新高端识别)',
    },
    problem: {
      uz: "Avvalgi ta'lim loyihasi nomi va vizual qiyofasi oddiy bo'lib, moliyaviy sohadagi jiddiy mijozlar va investorlarda yetarli ishonch uyg'otmas edi.",
      ru: 'Прежний проект выглядел шаблонно и не вызывал доверия у платежеспособных клиентов и институциональных инвесторов.',
      en: 'The previous brand identity looked generic and lacked the gravitas to attract institutional partners and high-ticket students.',
      zh: '原有教育项目形象单薄，在金融素养领域无法给高端学员和机构投资者带来足够信任感。',
    },
    solution: {
      uz: "Jarangdor 'Savod' neymingi topildi, intellektual va nufuzli aydentika, ilova va veb-interfeyslar uchun yaxlit vizual til tizimi yaratildi.",
      ru: 'Создан звучный нейминг Savod, интеллектуальная представительская айдентика и единый визуальный язык для всех цифровых продуктов.',
      en: 'Devised the authoritative name Savod, accompanied by an intellectual visual identity and unified product design language.',
      zh: '创立了掷地有声的品牌名称 Savod，打造了具有学术声誉的高端视觉体系与多端数字体验。',
    },
    metrics: [
      {
        value: '+120%',
        label: {
          uz: 'Ishonch indeksi',
          ru: 'Индекс доверия',
          en: 'Trust index',
          zh: '信任指数',
        },
      },
      {
        value: 'Top-3',
        label: {
          uz: 'Segment yetakchisi',
          ru: 'Лидер сегмента',
          en: 'Category leader',
          zh: '行业领先地位',
        },
      },
      {
        value: '2.4x',
        label: {
          uz: 'Konversiya',
          ru: 'Конверсия',
          en: 'Conversion rate',
          zh: '转化率提升',
        },
      },
    ],
    order: 2,
  },
  {
    id: 'fidda',
    brand: 'Fidda by Sevara',
    slug: 'fidda',
    category: {
      uz: 'Zargarlik Butigi',
      ru: 'Ювелирный бутик',
      en: 'Jewelry Boutique',
      zh: '高级珠宝定制',
    },
    year: '2024',
    oldImg: '/images/cms/fidda-avval.webp',
    newImg: '/images/cms/fidda-hozir.webp',
    oldHint: {
      uz: 'Oddiy logotip dizayni',
      ru: 'Типовой логотип',
      en: 'Standard logo design',
      zh: '传统普通标志',
    },
    newHint: {
      uz: 'Fidda (Premium aydentika)',
      ru: 'Fidda (Премиум айдентика)',
      en: 'Fidda (Premium identity)',
      zh: 'Fidda (高端视觉识别)',
    },
    problem: {
      uz: "Nozik zargarlik buyumlari oddiy va xira logotip ortida yo'qolib, arzon tuyulardi. Bu esa premium mijozlarni jalb qilish va yuqori narxda sotish imkonini cheklardi.",
      ru: 'Тончайшие ювелирные изделия из-за слабого логотипа казались дешевыми, мешая продажам в премиальном чеке.',
      en: 'Handcrafted fine jewelry was held back by a generic logo, failing to command luxury price points.',
      zh: '精美的手工银饰和珠宝因缺乏高端标识而显得普通，难以吸引高端消费者。',
    },
    solution: {
      uz: 'Nafis zargarlik chiziqlari asosida oliyjanob brend uslubi, premium qadoqlar va butik vitrinasi aydentikasi ishlab chiqildi.',
      ru: 'Разработали изысканную айдентику на основе ювелирной филиграни, люксовую упаковку и оформление флагманского бутика.',
      en: 'Crafted a delicate bespoke identity inspired by filigree, luxury unboxing experiences, and boutique styling.',
      zh: '以珠宝花丝工艺为灵感，定制了尊贵优雅的视觉识别、奢华包装体系及精品店陈列形象。',
    },
    metrics: [
      {
        value: '4.2x',
        label: {
          uz: 'ROAS (Reklama)',
          ru: 'ROAS (Реклама)',
          en: 'Ad ROAS',
          zh: '广告回报率',
        },
      },
      {
        value: '+40%',
        label: {
          uz: "O'rtacha daromad",
          ru: 'Рост дохода',
          en: 'Revenue increase',
          zh: '营收增长',
        },
      },
      {
        value: '+35%',
        label: {
          uz: 'Mijozlar qaytishi',
          ru: 'Повторные покупки',
          en: 'Repeat retention',
          zh: '复购率',
        },
      },
    ],
    order: 3,
  },
  {
    id: 'boyarin',
    brand: 'Boyarin',
    slug: 'boyarin',
    category: {
      uz: 'Qadoq dizayni & FMCG',
      ru: 'Дизайн упаковки и FMCG',
      en: 'Packaging Design & FMCG',
      zh: '包装设计与快消品',
    },
    year: '2026',
    oldImg: '/images/cms/boyarin-avval.webp',
    newImg: '/images/cms/boyarin-hozir.webp',
    oldHint: {
      uz: 'Eski mahsulot uslubi',
      ru: 'Прежняя упаковка',
      en: 'Previous packaging',
      zh: '旧版产品包装',
    },
    newHint: {
      uz: 'Boyarin (Premium qadoq)',
      ru: 'Boyarin (Премиальная упаковка)',
      en: 'Boyarin (Premium packaging)',
      zh: 'Boyarin (高端食品包装)',
    },
    problem: {
      uz: "Sifatli saryog' va sut mahsulotlari supermarket javonlarida yuzlab raqobatchilar orasida ko'zga tashlanmay, xaridor e'tiboridan chetda qolardi.",
      ru: 'Качественная молочная продукция терялась на полках супермаркетов среди однотипных упаковок конкурентов.',
      en: 'Premium dairy products were lost on crowded supermarket shelves among hundreds of nondescript competitor cartons.',
      zh: '高品质乳制品在商超琳琅满目的货架上淹没在同质化竞品中，缺乏视觉冲击力。',
    },
    solution: {
      uz: "To'q qora va oltin ranglar uyg'unligidagi jasur qadoq tizimi, boyar ramzi va javonda 3 barobar kuchli ko'zga tashlanadigan vizual til yaratildi.",
      ru: 'Создана смелая премиальная упаковка в глубоких темных тонах с благородным символом, выделяющаяся на полке за 3 секунды.',
      en: 'Engineered high-contrast dark-and-gold packaging with a distinctive heritage emblem, commanding shelf prominence.',
      zh: '研发了黑金高对比奢华包装与Boyar家族图腾，在商超货架上实现3秒抓人眼球的视觉统治力。',
    },
    metrics: [
      {
        value: '+85%',
        label: {
          uz: 'Supermarket savdosi',
          ru: 'Продажи в сетях',
          en: 'Supermarket sales',
          zh: '商超销售额',
        },
      },
      {
        value: '3x',
        label: {
          uz: 'Javondagi jozibadorlik',
          ru: 'Заметность на полке',
          en: 'Shelf visibility',
          zh: '货架吸睛度',
        },
      },
      {
        value: '4 barobar',
        label: {
          uz: 'Brend tanilishi',
          ru: 'Узнаваемость',
          en: 'Brand awareness',
          zh: '品牌知名度',
        },
      },
    ],
    order: 4,
  },
];

const proofIcons = [TrendingUp, BarChart3, Layers, Target];

const BeforeAfter: React.FC<BeforeAfterProps> = ({ lang, dictionary, comparisons }) => {
  const translations = dictionary;
  const currentLang = lang in translations ? lang : 'uz';

  // Merge Sanity comparisons if available, otherwise use FEATURED_TRANSFORMATIONS
  const cases = useMemo(() => {
    if (!comparisons || comparisons.length === 0) {
      return FEATURED_TRANSFORMATIONS;
    }

    // Merge custom images if Sanity returns matching brands
    const merged = FEATURED_TRANSFORMATIONS.map((ft) => {
      const found = comparisons.find(
        (c) =>
          c.brand &&
          (c.brand.toLowerCase().includes(ft.brand.toLowerCase()) ||
            ft.brand.toLowerCase().includes(c.brand.toLowerCase()))
      );
      if (found) {
        return {
          ...ft,
          oldImg: found.oldImg || ft.oldImg,
          newImg: found.newImg || ft.newImg,
          order: found.order ?? ft.order,
        };
      }
      return ft;
    });

    return merged.sort((a, b) => a.order - b.order);
  }, [comparisons]);

  const [activeCaseId, setActiveCaseId] = useState<string>(cases[0]?.id || 'den-aroma');
  const [sliderPosition, setSliderPosition] = useState<number>(0.5);

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) || cases[0],
    [cases, activeCaseId]
  );

  const handleCtaClick = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent('openContactModal', {
        detail: {
          section: 'before_after',
          ctaText: translations.cta || translations.ctaButton,
          source: 'homepage',
          brand: activeCase.brand,
        },
      })
    );
  }, [translations, activeCase]);

  if (!translations || !cases || cases.length === 0) return null;

  return (
    <section
      id="do-posle"
      className="py-[90px] md:py-[140px] relative z-[2] overflow-hidden bg-neutral-950 text-white"
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[8%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[160px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] rounded-full bg-indigo-600/5 blur-[150px]" />
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full bg-cyan-500/3 blur-[200px]" />
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* 1. Header Section */}
        <div className="grid md:grid-cols-12 gap-6 md:gap-12 mb-12 md:mb-16 items-end">
          <div className="md:col-span-7 lg:col-span-8">
            {translations.eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-blue-400 mb-4 font-bold bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {translations.eyebrow}
              </motion.div>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-white tracking-tight leading-[1.0] text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {renderHeadline(
                translations.title ?? '',
                'bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent'
              )}
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 lg:col-span-4 flex flex-col justify-end"
          >
            {translations.subtitle && (
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                {translations.subtitle}
              </p>
            )}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleCtaClick}
                size="lg"
                className="group h-13 sm:h-14 rounded-full bg-white px-7 sm:px-8 text-sm font-extrabold text-black hover:text-white transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-700 shadow-xl hover:shadow-blue-500/10 active:scale-[0.98]"
              >
                {translations.cta || translations.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* 2. Proof Metrics Ribbon */}
        {translations.proofCards?.length ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-14"
          >
            {translations.proofCards.map((card, i) => {
              const Icon = proofIcons[i % proofIcons.length];
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-md p-4 sm:p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-neutral-900/70 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all duration-300">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-black text-white text-xl sm:text-2xl tracking-tight leading-none mb-1">
                        {card.value}
                      </div>
                      <div className="font-[family-name:var(--font-mono)] text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-neutral-400 font-semibold leading-tight">
                        {card.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : null}

        {/* 3. Interactive Brand Tabs Navigation */}
        <div className="mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max p-1.5 rounded-2xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl">
            {cases.map((item) => {
              const isActive = item.id === activeCaseId;
              const categoryText = item.category[currentLang] || item.category.uz;
              const primaryMetric = item.metrics[0]?.value;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCaseId(item.id);
                    setSliderPosition(0.5);
                  }}
                  className={cn(
                    'relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 select-none outline-none',
                    isActive
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBrandPill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-blue-600/30 border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 font-black">{item.brand}</span>
                  <span className="relative z-10 hidden sm:inline-block text-[11px] font-normal text-neutral-400">
                    · {categoryText}
                  </span>
                  {primaryMetric && (
                    <span
                      className={cn(
                        'relative z-10 font-[family-name:var(--font-mono)] text-[10px] font-extrabold px-2 py-0.5 rounded-full border',
                        isActive
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                          : 'bg-white/5 text-neutral-400 border-white/10'
                      )}
                    >
                      {primaryMetric}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Cinematic Showcase Stage: Split 12-column grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12"
          >
            {/* Left 8 Cols: Interactive Comparison Stage */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 group">
                <ImageComparisonSlider
                  beforeImage={{
                    src: activeCase.oldImg,
                    alt: `${activeCase.brand} ${translations.beforeLabel || 'Avval'}`,
                  }}
                  afterImage={{
                    src: activeCase.newImg,
                    alt: `${activeCase.brand} ${translations.afterLabel || 'Keyin'}`,
                  }}
                  lang={lang}
                  sliderPosition={sliderPosition}
                  onPositionChange={setSliderPosition}
                  beforeLabel={activeCase.oldHint[currentLang] || activeCase.oldHint.uz}
                  afterLabel={activeCase.newHint[currentLang] || activeCase.newHint.uz}
                  className="aspect-[4/3] sm:aspect-[16/10] w-full"
                />
              </div>

              {/* Slider Controls & Helpers Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-2 sm:px-1">
                {/* Preset Buttons */}
                <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setSliderPosition(0.05)}
                    className={cn(
                      'px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200',
                      sliderPosition <= 0.15
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    {translations.compareBefore || 'Faqat Avval'}
                  </button>
                  <button
                    onClick={() => setSliderPosition(0.5)}
                    className={cn(
                      'px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200',
                      sliderPosition > 0.15 && sliderPosition < 0.85
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    {translations.compare50 || '50 / 50 Taqqoslash'}
                  </button>
                  <button
                    onClick={() => setSliderPosition(0.95)}
                    className={cn(
                      'px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200',
                      sliderPosition >= 0.85
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    {translations.compareAfter || 'Faqat Keyin'}
                  </button>
                </div>

                {/* Hint Text */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {translations.sliderHint ||
                      'Surgichni suring yoki taqqoslash uchun tugmalardan foydalaning'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Strategic Case Intelligence Dossier */}
            <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-6">
                {/* Dossier Header */}
                <div className="border-b border-white/10 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      {activeCase.category[currentLang] || activeCase.category.uz}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-xs text-neutral-500 font-semibold">
                      {activeCase.year}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeCase.brand}
                  </h3>
                </div>

                {/* Problem Box (Avval) */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {translations.problemTitle || 'Muammo (Avval)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                    {activeCase.problem[currentLang] || activeCase.problem.uz}
                  </p>
                </div>

                {/* Solution Box (Keyin) */}
                <div className="rounded-2xl border border-blue-500/20 bg-blue-950/15 p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      {translations.solutionTitle || 'Strategik yechim (Keyin)'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                    {activeCase.solution[currentLang] || activeCase.solution.uz}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>{translations.resultTitle || 'Biznes natijasi'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {activeCase.metrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center"
                      >
                        <div className="font-black text-white text-base sm:text-lg tracking-tight mb-0.5">
                          {m.value}
                        </div>
                        <div className="text-[9px] text-neutral-400 font-medium leading-tight line-clamp-2">
                          {m.label[currentLang] || m.label.uz}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href={`/${lang}/portfolio/${activeCase.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                >
                  <span>{translations.viewCase || "Keysni to'liq ko'rish"}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Button
                  onClick={handleCtaClick}
                  variant="outline"
                  className="w-full h-11 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white text-xs font-bold transition-all duration-200"
                >
                  {translations.cta || translations.ctaButton}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 5. Bottom Multi-Card Gallery (Quick Switching & Overview) */}
        <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {translations.allTransformations || 'Barcha transformatsiyalar'}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-1">
                {translations.allTransformationsSub ||
                  "Har bir brend uchun alohida strategik yondashuv va o'lchanadigan natijalar"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {cases.map((item) => {
              const isCurrent = item.id === activeCaseId;
              const primaryMetric = item.metrics[0];

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveCaseId(item.id);
                    setSliderPosition(0.5);
                    const el = document.getElementById('do-posle');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={cn(
                    'group relative text-left rounded-2xl overflow-hidden border p-3 sm:p-4 transition-all duration-300 outline-none',
                    isCurrent
                      ? 'border-blue-500/60 bg-blue-950/20 shadow-[0_0_25px_rgba(37,99,235,0.2)]'
                      : 'border-white/10 bg-neutral-900/40 hover:border-white/20 hover:bg-neutral-900/80'
                  )}
                >
                  {/* Thumbnail Split Preview */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-neutral-950">
                    <div className="absolute inset-0 grid grid-cols-2">
                      <div className="relative h-full overflow-hidden border-r border-white/20">
                        <Image
                          src={item.oldImg}
                          alt={item.brand}
                          fill
                          className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 left-1.5 font-[family-name:var(--font-mono)] text-[8px] font-bold text-white/70 bg-black/70 px-1.5 py-0.5 rounded">
                          {translations.beforeLabel || 'Avval'}
                        </span>
                      </div>
                      <div className="relative h-full overflow-hidden">
                        <Image
                          src={item.newImg}
                          alt={item.brand}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-1 right-1.5 font-[family-name:var(--font-mono)] text-[8px] font-bold text-blue-300 bg-blue-950/80 px-1.5 py-0.5 rounded">
                          {translations.afterLabel || 'Keyin'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-black text-white text-sm sm:text-base group-hover:text-blue-400 transition-colors">
                        {item.brand}
                      </div>
                      <div className="text-[10px] sm:text-xs text-neutral-400 font-medium">
                        {item.category[currentLang] || item.category.uz}
                      </div>
                    </div>
                    {primaryMetric && (
                      <span className="font-[family-name:var(--font-mono)] text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
                        {primaryMetric.value}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;
