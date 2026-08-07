import Image from 'next/image'
import Link from 'next/link'

import { HeroSlider } from '@/components/HeroSlider'
import { MediaImage } from '@/components/MediaImage'
import { ProductCarousel } from '@/components/ProductCarousel'
import { CountUp } from '@/components/CountUp'
import { Reveal } from '@/components/Reveal'
import { SplitFeature } from '@/components/SplitFeature'
import { TrustBand } from '@/components/TrustBand'
import {
  ArrowIcon,
  BottleIcon,
  BoxIcon,
  SparkleIcon,
  TruckIcon,
  WhatsAppIcon,
} from '@/components/icons'
import {
  getCategoriesWithCounts,
  getFeaturedProducts,
  getProducts,
  getSettings,
} from '@/lib/queries'
import { waLink } from '@/lib/whatsapp'

// (C) Hero altındaki 4'lü ikon + etiket satırı
const HERO_FEATURES = [
  { Icon: BottleIcon, label: '10 Ürün Grubu' },
  { Icon: SparkleIcon, label: 'Kapak & Aksesuar' },
  { Icon: BoxIcon, label: 'Numune Desteği' },
  { Icon: TruckIcon, label: 'Koli Bazlı Tedarik' },
]

export default async function HomePage() {
  const [settings, categories, featured, catalog] = await Promise.all([
    getSettings(),
    getCategoriesWithCounts(),
    getFeaturedProducts(10),
    getProducts({ limit: 12 }),
  ])
  const totalProducts = categories.reduce((n, c) => n + c.productCount, 0)
  const carouselProducts = featured.length >= 4 ? featured : catalog.docs
  const wa = waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)

  return (
    <>
      {/* ---- (C) Hero: sol metin + sağa taşan, çerçevesiz arka plan fotoğrafı ---- */}
      <section className="bg-cream">
        <div className="section-y mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div className="animate-fade-up">
            <p className="eyebrow">Miskhane Perfumes · Toptan</p>
            <h1 className="section-title mt-5 text-4xl leading-[1.08] text-espresso sm:text-5xl lg:text-6xl">
              Parfüm ambalajında <span className="gold-text">zarafet</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
              {settings?.heroSubtitle ||
                'Parfüm ve esans şişeleri, kapaklar, valfler, kolonyalar, oda kokuları ve buhurlar. Toptan fiyat ve numune için WhatsApp üzerinden bize ulaşın.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp ile Teklif Al
              </a>
              <Link href="/urunler" className="btn btn-outline">
                Kataloğu İncele
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>

            {/* 4'lü ikon + etiket satırı */}
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 pt-2 sm:grid-cols-4">
              {HERO_FEATURES.map(({ Icon, label }) => (
                <div key={label} className="icon-item">
                  <Icon className="h-7 w-7 text-accent-text" />
                  <span className="icon-item__label text-espresso">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Katalogdaki kategori kapak fotoğrafları saniyede bir değişir */}
          <div className="animate-fade-up [animation-delay:150ms]">
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* ---- (D) Koyu güven bandı ---- */}
      <Reveal>
        <TrustBand />
      </Reveal>

      {/* ---- (E) Kategori ızgarası ---- */}
      <section className="bg-white">
        <div className="section-y mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Ürün Grupları</p>
            <h2 className="section-title mt-3 text-3xl text-espresso sm:text-4xl">
              <CountUp to={totalProducts} /> ürünlük katalog, {categories.length} grup
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={(i % 5) * 70}>
                <Link href={`/kategori/${category.slug}`} className="card group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl border-b border-clay/40 bg-white">
                    <MediaImage
                      media={category.image}
                      size="card"
                      alt={`${category.name} kategorisi`}
                      className="object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 50vw, 220px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.1em] text-espresso">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted">{category.productCount} ürün</p>
                    <span className="btn-link mt-auto pt-4">
                      İncele
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- (F) Bölünmüş öne çıkan bölüm ---- */}
      <Reveal>
        <SplitFeature />
      </Reveal>

      {/* ---- (G) Ürün carousel ---- */}
      <Reveal>
        <ProductCarousel
          products={carouselProducts}
          eyebrow="Seçkin"
          title="Öne Çıkan Ürünler"
          href="/urunler"
        />
      </Reveal>

      {/* ---- Hakkımızda ---- */}
      <section className="bg-cream">
        <div className="section-y mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Hakkımızda</p>
            <h2 className="section-title mt-4 text-3xl text-espresso sm:text-4xl">
              Kokunun büyülü dünyasına adım atın.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
              <p>
                Miskhane olarak, sizi sıradanlığın ötesine taşıyan zarif ve kalıcı kokularla
                buluşturuyoruz. Gelenekten ilham alan modern esanslarımız, parfümlerimiz ve ortam
                kokularımızla her anınıza anlam katıyoruz.
              </p>
              <p>
                Parfümden oda kokusuna, kolonyadan tütsüye uzanan geniş ürün yelpazemizle yaşam
                alanlarınıza estetik, ferahlık ve zarafet kazandırıyoruz.
              </p>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.24em] text-accent-text">
              Her koku, sizi anlatan bir imzadır.
            </p>
            <Link href="/hakkimizda" className="btn-link mt-8">
              Devamı
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-[1700/2386] w-full overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/catalog/about.webp"
                alt="Miskhane parfüm, difüzör ve oda kokusu ürünleri"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
