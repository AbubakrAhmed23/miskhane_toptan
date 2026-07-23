import Link from 'next/link'

import { CollectionIndex } from '@/components/CollectionIndex'
import { ScentWave } from '@/components/Decor'
import { IngredientStrip } from '@/components/Decor'
import { ProductCard } from '@/components/ProductCard'
import { ProductMarquee } from '@/components/ProductMarquee'
import { ProductSlider } from '@/components/ProductSlider'
import { Reveal } from '@/components/Reveal'
import { ArrowIcon, WhatsAppIcon } from '@/components/icons'
import {
  getCategoriesWithCounts,
  getFeaturedProducts,
  getProducts,
  getSettings,
} from '@/lib/queries'
import { waLink } from '@/lib/whatsapp'

export default async function HomePage() {
  const [settings, categories, featured, catalog] = await Promise.all([
    getSettings(),
    getCategoriesWithCounts(),
    getFeaturedProducts(8),
    getProducts({ limit: 20 }),
  ])
  const marqueeProducts = catalog.docs
  const sliderProducts = featured.length > 0 ? featured : marqueeProducts
  const totalProducts = catalog.totalDocs

  const stats = [
    { value: `${totalProducts}+`, label: 'Ürün Çeşidi' },
    { value: String(categories.length).padStart(2, '0'), label: 'Ürün Grubu' },
    { value: '%100', label: 'Toptan Odaklı' },
    { value: '7/24', label: 'WhatsApp Desteği' },
  ]

  const wa = waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)

  return (
    <>
      {/* Hero — tipografik tez + kayan slider */}
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="animate-glow pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(201,162,75,0.20) 0%, rgba(201,162,75,0.05) 42%, transparent 70%)',
          }}
        />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <p className="eyebrow">Toptan · Parfüm Ambalajı</p>
            <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.02] text-petrol sm:text-6xl md:text-7xl">
              Parfüm Ambalajında <span className="gold-text">Zarafet</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {settings?.heroSubtitle ||
                'Cam parfüm şişeleri, kapaklar, valf & pompa, esans, oda kokusu ve oud çözümlerinde geniş ürün yelpazesi. Fiyat ve numune için WhatsApp üzerinden bize ulaşın.'}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold shadow-soft"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp ile İletişime Geç
              </a>
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-medium text-ink transition hover:border-gold hover:text-gold-deep"
              >
                Ürünleri Keşfet
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            <ProductSlider products={sliderProducts} interval={1000} />
            <ScentWave className="animate-sway pointer-events-none absolute -right-5 top-6 hidden h-32 w-9 text-gold/35 sm:block" />
          </div>
        </div>

        {/* Stat bandı */}
        <div className="bg-petrol">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-9 sm:px-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="code text-3xl font-bold text-gold sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Koku notaları (ingredient) şeridi */}
      <section className="border-b border-line bg-soft">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8">
          <p className="eyebrow">Kokunun Dünyasına Ambalaj</p>
          <h2 className="mt-3 font-serif text-2xl font-bold text-petrol sm:text-3xl">
            Her Nota İçin Doğru Şişe
          </h2>
          <IngredientStrip className="mt-9" />
        </div>
      </section>

      {/* Kayan ürün şeridi */}
      {marqueeProducts.length > 0 && (
        <section className="border-b border-line bg-white py-12">
          <div className="mx-auto mb-6 flex w-full max-w-6xl items-end justify-between gap-4 px-5 sm:px-8">
            <div>
              <p className="eyebrow">Vitrin</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-petrol sm:text-3xl">
                Ürünlerimizden
              </h2>
            </div>
            <Link
              href="/urunler"
              className="hidden items-center gap-1 text-sm font-medium text-gold-deep hover:gap-2 sm:inline-flex"
            >
              Tüm Ürünler <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <ProductMarquee products={marqueeProducts} />
        </section>
      )}

      {/* Koleksiyon indeksi (imza öğesi) */}
      <CollectionIndex categories={categories} />

      {/* Öne çıkan ürünler */}
      {featured.length > 0 && (
        <section className="border-t border-line bg-soft">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Seçkin</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-petrol sm:text-4xl">
                  Öne Çıkan Ürünler
                </h2>
              </div>
              <Link
                href="/urunler"
                className="hidden items-center gap-1 text-sm font-medium text-gold-deep hover:gap-2 sm:inline-flex"
              >
                Tüm Ürünler <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
