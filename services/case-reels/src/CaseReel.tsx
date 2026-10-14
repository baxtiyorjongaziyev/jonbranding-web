import type { CSSProperties, FC, ReactNode } from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/InterTight';
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter().fontFamily;
const serif = loadSerif().fontFamily;
const mono = loadMono().fontFamily;

// Atelier tokenlari (src/app/atelier.css) bilan bir xil — video sayt bilan bir brendda ko'rinadi.
const C = {
  bg: '#F4F5F7',
  paper: '#FFFFFF',
  ink: '#0E1015',
  muted: '#6B7280',
  line: '#DDE0E6',
  accent: '#1B4DFF',
};

// Emil Kowalski: kirishda kuchli ease-out, chiqishda tez va qisqa.
const easeOut = Easing.bezier(0.23, 1, 0.32, 1);

export type CaseReelProps = {
  client: string;
  title: string;
  category: string;
  beforeImage: string | null;
  afterImage: string | null;
  gallery: string[];
  result: { metric: string; value: string } | null;
};

const HOOK = 60;
const BEFORE_AFTER = 120;
const GALLERY_ITEM = 45;
const MAX_GALLERY = 4;
const RESULT = 75;
const CTA = 75;

const hasBeforeAfter = (p: CaseReelProps) => Boolean(p.beforeImage && p.afterImage);
const galleryOf = (p: CaseReelProps) => p.gallery.slice(0, MAX_GALLERY);

export const caseReelDuration = (p: CaseReelProps): number =>
  HOOK +
  (hasBeforeAfter(p) ? BEFORE_AFTER : 0) +
  galleryOf(p).length * GALLERY_ITEM +
  (p.result ? RESULT : 0) +
  CTA;

/** Pastdan ozgina ko'tarilib, xiralikdan chiqadi. */
const Rise: FC<{ delay?: number; children: ReactNode; style?: CSSProperties }> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 18], [0, 1], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * 40}px)`, ...style }}>
      {children}
    </div>
  );
};

const Label: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: mono,
      fontSize: 30,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color: C.muted,
    }}
  >
    {children}
  </div>
);

const Footer: FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 90,
      left: 90,
      right: 90,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: mono,
      fontSize: 26,
      color: C.muted,
      borderTop: `1px solid ${C.line}`,
      paddingTop: 28,
    }}
  >
    <span>JON.BRANDING</span>
    <span>jonbranding.uz</span>
  </div>
);

const Hook: FC<CaseReelProps> = ({ client, title, category }) => (
  <AbsoluteFill style={{ background: C.bg, padding: 90, justifyContent: 'center' }}>
    <Rise>
      <Label>{category}</Label>
    </Rise>
    <Rise delay={6}>
      <div
        style={{
          fontFamily: serif,
          fontStyle: 'italic',
          fontSize: 150,
          lineHeight: 1,
          color: C.ink,
          marginTop: 36,
        }}
      >
        {client}
      </div>
    </Rise>
    <Rise delay={12}>
      <div style={{ fontFamily: inter, fontSize: 52, color: C.ink, marginTop: 40, maxWidth: 820 }}>
        {title}
      </div>
    </Rise>
    <Footer />
  </AbsoluteFill>
);

/** "Oldin" rasmi ustidan "Keyin" rasmi chapdan o'ngga ochiladi. */
const BeforeAfter: FC<{ before: string; after: string }> = ({ before, after }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [30, 75], [0, 100], {
    easing: easeOut,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const img: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
  const tag: CSSProperties = {
    position: 'absolute',
    top: 90,
    left: 90,
    fontFamily: mono,
    fontSize: 30,
    letterSpacing: 4,
    padding: '12px 22px',
    borderRadius: 999,
  };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Img src={before} style={img} />
      <div style={{ ...tag, background: C.paper, color: C.ink }}>OLDIN</div>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
        <Img src={after} style={img} />
        <div style={{ ...tag, background: C.accent, color: C.paper }}>KEYIN</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Sekin "Ken Burns" yaqinlashuvi — statik rasm ham tirik ko'rinadi. */
const GalleryShot: FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, GALLERY_ITEM], [1.06, 1]);
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.ink, opacity }}>
      <Img
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
    </AbsoluteFill>
  );
};

const Result: FC<{ metric: string; value: string }> = ({ metric, value }) => (
  <AbsoluteFill style={{ background: C.accent, padding: 90, justifyContent: 'center' }}>
    <Rise>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 220, lineHeight: 1, color: C.paper }}>
        {value}
      </div>
    </Rise>
    <Rise delay={8}>
      <div style={{ fontFamily: inter, fontSize: 56, color: C.paper, marginTop: 36, opacity: 0.9 }}>
        {metric}
      </div>
    </Rise>
  </AbsoluteFill>
);

const Cta: FC = () => (
  <AbsoluteFill style={{ background: C.ink, padding: 90, justifyContent: 'center' }}>
    <Rise>
      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 110, lineHeight: 1.05, color: C.paper }}>
        Sizning brendingiz navbatda.
      </div>
    </Rise>
    <Rise delay={10}>
      <div
        style={{
          marginTop: 60,
          display: 'inline-block',
          fontFamily: inter,
          fontSize: 48,
          color: C.ink,
          background: C.paper,
          borderRadius: 999,
          padding: '26px 48px',
        }}
      >
        jonbranding.uz
      </div>
    </Rise>
  </AbsoluteFill>
);

export const CaseReel: FC<CaseReelProps> = (props) => {
  const gallery = galleryOf(props);
  let from = 0;
  const at = (duration: number) => {
    const start = from;
    from += duration;
    return { from: start, durationInFrames: duration };
  };

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence {...at(HOOK)}>
        <Hook {...props} />
      </Sequence>
      {hasBeforeAfter(props) && (
        <Sequence {...at(BEFORE_AFTER)}>
          <BeforeAfter before={props.beforeImage!} after={props.afterImage!} />
        </Sequence>
      )}
      {gallery.map((src) => (
        <Sequence key={src} {...at(GALLERY_ITEM)}>
          <GalleryShot src={src} />
        </Sequence>
      ))}
      {props.result && (
        <Sequence {...at(RESULT)}>
          <Result {...props.result} />
        </Sequence>
      )}
      <Sequence {...at(CTA)}>
        <Cta />
      </Sequence>
    </AbsoluteFill>
  );
};
