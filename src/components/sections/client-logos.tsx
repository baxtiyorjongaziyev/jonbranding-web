import Image from 'next/image';
import type { FC } from 'react';
import { staticBrands } from '@/lib/static-data';

const names = ['Rash Milk', 'Goodwell', 'Rahimov School', 'Savod'];
const brands = names.map((name) => staticBrands.find((brand) => brand.name === name)).filter((brand) => brand !== undefined);

const ClientLogos: FC<{ title: string }> = ({ title }) => (
  <section aria-label={title} className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
    <h2 className="mb-6 text-center text-sm font-medium text-[var(--at-muted)]">{title}</h2>
    <div className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-4">
      {brands.map((brand) => brand.logo && (
        <div key={brand.name} className="flex min-w-0 items-center justify-center">
          <Image src={brand.logo} alt={brand.name} width={180} height={100} sizes="(max-width: 639px) 140px, 180px" className="h-24 w-full max-w-[180px] object-contain" />
        </div>
      ))}
    </div>
  </section>
);

export default ClientLogos;
