import type { Product } from '@/payload-types'
import { specCells, type SpecKind } from '@/lib/format'

/**
 * Katalogdaki teknik özellik tablosunun ikonları — küçük şişe siluetleri.
 * Hacim (ml) ikonu katalogdaki gibi altın dolgulu, diğerleri çizgi.
 */
function SpecIcon({ kind }: { kind: SpecKind }) {
  // Renkler global tokenlardan gelir; bileşende sabit renk kodu tutulmaz.
  const stroke = 'var(--color-text-muted)'
  const bottle = 'M9.2 2.6h5.6v2.1c0 .9.4 1.3 1 1.9.9.9 1.4 1.9 1.4 3.2v9.6a2 2 0 0 1-2 2H8.8a2 2 0 0 1-2-2v-9.6c0-1.3.5-2.3 1.4-3.2.6-.6 1-1 1-1.9V2.6Z'

  if (kind === 'ml') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d={bottle} fill="var(--color-gold)" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="6" fill="#fff" fontFamily="sans-serif">
          ml
        </text>
      </svg>
    )
  }
  if (kind === 'g') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d={bottle} fill="none" stroke={stroke} strokeWidth="1.1" />
        <text x="12" y="16.5" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="sans-serif">
          g
        </text>
      </svg>
    )
  }
  if (kind === 'height') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d={bottle} fill="none" stroke={stroke} strokeWidth="1.1" />
        <path d="M12 5.5v13M12 4.6l-1.4 1.6h2.8L12 4.6ZM12 19.4l-1.4-1.6h2.8L12 19.4Z" fill={stroke} stroke={stroke} strokeWidth=".5" />
        <text x="14.6" y="13.4" fontSize="4.4" fill={stroke} fontFamily="sans-serif" transform="rotate(-90 14.6 13.4)">
          mm
        </text>
      </svg>
    )
  }
  if (kind === 'width') {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d={bottle} fill="none" stroke={stroke} strokeWidth="1.1" />
        <path d="M8 13h8M7.2 13l1.6-1.4v2.8L7.2 13ZM16.8 13l-1.6-1.4v2.8L16.8 13Z" fill={stroke} stroke={stroke} strokeWidth=".5" />
        <text x="12" y="11.2" textAnchor="middle" fontSize="4.4" fill={stroke} fontFamily="sans-serif">
          mm
        </text>
      </svg>
    )
  }
  return null
}

/**
 * Katalogdaki gri teknik özellik şeridi.
 * Sütunlar: FİYAT · KOLİ İÇİ ADET · ml · g · mm (yükseklik) · mm (genişlik)
 */
export function SpecStrip({ product, className = '' }: { product: Product; className?: string }) {
  const cells = specCells(product)
  if (!cells.length) return null

  return (
    <div className={`spec-strip flex w-full items-stretch ${className}`}>
      {cells.map((cell) => (
        <div
          key={cell.kind}
          className={`flex flex-1 flex-col items-center justify-between gap-1 px-0.5 py-2 ${
            cell.kind === 'price' ? 'spec-strip__col--price' : ''
          }`}
        >
          <div className="flex h-6 items-center justify-center">
            {cell.kind === 'price' || cell.kind === 'units' ? (
              <span className="spec-strip__label text-center">{cell.label}</span>
            ) : (
              <SpecIcon kind={cell.kind} />
            )}
          </div>
          <span
            className={`spec-strip__value code ${cell.kind === 'price' ? 'spec-strip__price' : ''}`}
          >
            {cell.value}
          </span>
        </div>
      ))}
    </div>
  )
}
