import type { CSSProperties } from 'react'

// Zarif altın süsleme öğeleri — hepsi dekoratiftir (aria-hidden, pointer-events yok).

// Köşe filigranı (arabesk kıvrım). corner: konuma göre döndürülür.
export function CornerFlourish({
  className = '',
  corner = 'tl',
}: {
  className?: string
  corner?: 'tl' | 'tr' | 'bl' | 'br'
}) {
  const rotate = { tl: '', tr: 'rotate-90', br: 'rotate-180', bl: '-rotate-90' }[corner]
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`${className} ${rotate}`}
    >
      <path
        d="M4 4 C 46 4, 74 8, 84 34 C 90 50, 80 66, 62 64 C 50 62.5, 46 52, 52 45"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M4 4 C 4 46, 8 74, 34 84 C 50 90, 66 80, 64 62"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M4 4 L 30 4 M4 4 L 4 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="84" cy="34" r="2.4" fill="currentColor" />
      <circle cx="34" cy="84" r="2.4" fill="currentColor" />
      <circle cx="58" cy="58" r="1.8" fill="currentColor" />
    </svg>
  )
}

// Logo elmasını yansıtan, ortadan iki yana açılan ayraç.
export function DiamondDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current sm:w-32" />
      <svg viewBox="0 0 44 44" className="h-5 w-5">
        <path d="M22 3 L41 22 L22 41 L3 22 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M22 11 L33 22 L22 33 L11 22 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="22" cy="22" r="2.6" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current sm:w-32" />
    </div>
  )
}

// Yükselen koku dalgası (parfüm izi) — noktalı dalgalı çizgi.
export function ScentWave({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 220" fill="none" aria-hidden="true" className={className}>
      <path
        d="M30 218 C 12 188, 48 162, 30 132 C 12 102, 48 78, 30 48 C 20 30, 36 16, 30 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
    </svg>
  )
}

// Dört köşeli ışıltı yıldızı.
function Sparkle({ className = '', style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} style={style}>
      <path d="M12 0 C 12.6 6.5, 17.5 11.4, 24 12 C 17.5 12.6, 12.6 17.5, 12 24 C 11.4 17.5, 6.5 12.6, 0 12 C 6.5 11.4, 11.4 6.5, 12 0 Z" />
    </svg>
  )
}

// Süzülen altın parçacıklar + ışıltılar (sabit konumlar, hidrasyon-güvenli).
const PARTICLES = [
  { top: '12%', left: '8%', size: 10, delay: '0s', kind: 'sparkle' },
  { top: '68%', left: '5%', size: 6, delay: '1.2s', kind: 'dot' },
  { top: '26%', left: '92%', size: 14, delay: '0.6s', kind: 'sparkle' },
  { top: '80%', left: '88%', size: 7, delay: '2s', kind: 'dot' },
  { top: '46%', left: '48%', size: 5, delay: '1.6s', kind: 'dot' },
  { top: '18%', left: '60%', size: 8, delay: '0.9s', kind: 'sparkle' },
  { top: '58%', left: '30%', size: 6, delay: '2.4s', kind: 'dot' },
  { top: '88%', left: '40%', size: 9, delay: '0.3s', kind: 'sparkle' },
] as const

export function FloatingParticles({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute animate-float"
          style={{ top: p.top, left: p.left, animationDelay: p.delay }}
        >
          {p.kind === 'sparkle' ? (
            <Sparkle
              className="animate-twinkle text-gold"
              style={{ width: p.size, height: p.size, animationDelay: p.delay }}
            />
          ) : (
            <span
              className="block animate-twinkle rounded-full bg-gold"
              style={{ width: p.size, height: p.size, animationDelay: p.delay }}
            />
          )}
        </span>
      ))}
    </div>
  )
}

// Yan kenarda dikey marka yazısı.
export function SideRail({
  side = 'left',
  className = '',
}: {
  side?: 'left' | 'right'
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex ${
        side === 'left' ? 'left-4 flex-col' : 'right-4 flex-col'
      } ${className}`}
    >
      <span className="h-16 w-px bg-gradient-to-b from-transparent to-gold/50" />
      <span
        className="text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-gold/60"
        style={{ writingMode: 'vertical-rl' }}
      >
        Miskhane • Toptan
      </span>
      <span className="h-16 w-px bg-gradient-to-t from-transparent to-gold/50" />
    </div>
  )
}
