import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--at-bg)' }}
    >
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(80px, 20vw, 160px)',
          lineHeight: 1,
          color: 'var(--at-accent)',
          opacity: 0.12,
          letterSpacing: '-0.05em',
        }}
      >
        404
      </div>
      <h1
        className="font-bold"
        style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          letterSpacing: '-0.03em',
          color: 'var(--at-ink)',
          marginTop: -24,
        }}
      >
        Sahifa topilmadi
      </h1>
      <p
        className="mt-4 text-base leading-relaxed"
        style={{ color: 'var(--at-ink-2)', maxWidth: 380 }}
      >
        Bu sahifa mavjud emas yoki ko&apos;chirilgan.
        <br />
        Bosh sahifaga qaytib, kerakli bo&apos;limni toping.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 font-semibold rounded-full px-7 py-4 text-sm hover:-translate-y-0.5 transition-transform"
          style={{ background: 'var(--at-accent)', color: '#fff' }}
        >
          ← Bosh sahifa
        </Link>
        <Link
          href="/aloqa"
          className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm transition-colors"
          style={{ border: '1px solid var(--at-line)', color: 'var(--at-ink-2)' }}
        >
          Aloqa →
        </Link>
      </div>
    </main>
  );
}
