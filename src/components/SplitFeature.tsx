import Link from 'next/link'

import { ArrowIcon, BottleIcon, CatalogIcon, SparkleIcon } from './icons'

/**
 * (F) Bölünmüş öne çıkan bölüm.
 * Sol: koyu kart — eyebrow + başlık + açıklama + CTA.
 * Sağ: açık panel — 3 ikon + metin sütunu.
 */
const COLUMNS = [
  {
    Icon: BottleIcon,
    title: 'Geniş Hacim Aralığı',
    text: '1 ml’den 250 ml’ye kadar parfüm ve esans şişeleri.',
  },
  {
    Icon: SparkleIcon,
    title: 'Kapak & Aksesuar',
    text: 'Zamak, ahşap ve ASP kapaklar; valf ve tıpa seçenekleri.',
  },
  {
    Icon: CatalogIcon,
    title: 'Tek Katalogda',
    text: 'Kolonya, oda kokusu ve buhur grupları da aynı çatı altında.',
  },
]

export function SplitFeature() {
  return (
    <section className="bg-white">
      <div className="section-y mx-auto grid w-full max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
        {/* Sol: koyu kart */}
        <div className="flex flex-col justify-center rounded-2xl bg-espresso p-10 sm:p-12">
          <p className="eyebrow eyebrow--on-dark">Neden Miskhane</p>
          <h2 className="section-title mt-4 text-3xl text-white sm:text-4xl">
            Tek tedarikçiden eksiksiz koku ambalajı.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
            Şişeden kapağa, valften tıpaya kadar bir parfümün ihtiyaç duyduğu tüm parçaları aynı
            katalogda bulur; tek siparişle tamamlarsınız.
          </p>
          <div className="mt-8">
            <Link href="/urunler" className="btn btn-gold">
              Kataloğu İncele
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Sağ: açık panel */}
        <div className="grid gap-8 rounded-2xl bg-white p-10 shadow-soft sm:p-12 md:grid-cols-3">
          {COLUMNS.map(({ Icon, title, text }) => (
            <div key={title} className="flex flex-col gap-3">
              <Icon className="h-8 w-8 text-accent-text" />
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-espresso">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
