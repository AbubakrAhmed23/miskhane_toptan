import { BoxIcon, ShieldIcon, SupportIcon } from './icons'

/**
 * (D) Koyu renkli güven/bilgi bandı — tam genişlik.
 * 3 sütun, ikon + kısa metin, ince dikey ayraçlarla ayrılır.
 */
const ITEMS = [
  {
    Icon: ShieldIcon,
    title: 'Kaliteli Üretim',
    text: 'Dayanıklı cam ve özenli işçilik ile uzun ömürlü ürünler.',
  },
  {
    Icon: BoxIcon,
    title: 'Numune Desteği',
    text: 'Toptan siparişten önce ürünü elinizde görme imkânı.',
  },
  {
    Icon: SupportIcon,
    title: 'WhatsApp Desteği',
    text: 'Fiyat, stok ve sevkiyat için doğrudan iletişim.',
  },
]

export function TrustBand() {
  return (
    <section className="bg-espresso text-white/75">
      <div className="mx-auto grid w-full max-w-6xl gap-y-10 section-y px-5 sm:px-8 md:grid-cols-3 md:gap-y-0">
        {ITEMS.map(({ Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center gap-3 px-6 text-center">
            <Icon className="h-8 w-8 text-cream" />
            <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white">
              {title}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
