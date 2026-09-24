/**
 * Sahifa yuklanayotgandagi ekran.
 *
 * Atelier palitrasida: qog'oz foni (#F2EFE6) va siyoh rangi (#0E1015).
 * Logo asta-sekin ko'rinadi, ostida ingichka progress chizig'i yuradi.
 * Matn yo'q — til tanlangan sahifadan oldin ishga tushadi.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#F2EFE6' }}
      role="status"
      aria-label="Yuklanmoqda"
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/assets/logos/logo-black.svg"
          alt="Jon Branding"
          width={149}
          height={24}
          className="jb-load-logo h-6 w-auto sm:h-7"
        />
        <div className="jb-load-track">
          <div className="jb-load-bar" />
        </div>
      </div>

      <style>{`
        .jb-load-logo {
          opacity: 0;
          animation: jb-fade 900ms ease-out forwards;
        }
        .jb-load-track {
          width: 120px;
          height: 1px;
          overflow: hidden;
          background: rgba(14, 16, 21, 0.12);
        }
        .jb-load-bar {
          width: 40%;
          height: 100%;
          background: #0E1015;
          animation: jb-sweep 1.15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes jb-fade {
          to { opacity: 1; }
        }
        @keyframes jb-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jb-load-logo { opacity: 1; animation: none; }
          .jb-load-bar  { animation: none; width: 100%; opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
