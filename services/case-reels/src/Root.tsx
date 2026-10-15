import type { FC } from 'react';
import { Composition } from 'remotion';
import { CaseReel, caseReelDuration, type CaseReelProps } from './CaseReel';

// Studio'da ko'rish uchun namunaviy ma'lumot. Haqiqiy render `npm run render -- <slug>` orqali Sanity'dan oladi.
const sample: CaseReelProps = {
  client: 'Mijoz nomi',
  title: 'Brend transformatsiyasi',
  category: 'Logo · Brandbook',
  beforeImage: null,
  afterImage: null,
  gallery: [],
  result: null,
};

export const Root: FC = () => (
  <Composition
    id="CaseReel"
    component={CaseReel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={caseReelDuration(sample)}
    defaultProps={sample}
    calculateMetadata={({ props }) => ({ durationInFrames: caseReelDuration(props) })}
  />
);
