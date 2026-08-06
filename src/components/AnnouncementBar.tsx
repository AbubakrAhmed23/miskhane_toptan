import { BottleIcon, ShieldIcon, TruckIcon } from './icons'

/**
 * (A) Üst bilgi şeridi — ince, açık renkli bant.
 * Ortalanmış 3 ikon + kısa metin öğesi; mevcut güven unsurlarını taşır.
 */
const ITEMS = [
  { Icon: BottleIcon, text: '237 ürünlük toptan koleksiyon' },
  { Icon: TruckIcon, text: 'Koli bazlı toptan tedarik' },
  { Icon: ShieldIcon, text: 'Numune desteği' },
]

export function AnnouncementBar() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 py-2.5 sm:px-8">
        {ITEMS.map(({ Icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-2 text-[0.7rem] font-medium tracking-wide text-muted"
          >
            <Icon className="h-4 w-4 shrink-0 text-accent-text" />
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
