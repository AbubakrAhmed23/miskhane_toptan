import Link from 'next/link'

import { CategoryShowcase } from '@/components/CategoryShowcase'
import {
  CornerFlourish,
  DiamondDivider,
  FloatingParticles,
  IngredientStrip,
  ScentWave,
  SideRail,
} from '@/components/Decor'
import { ProductCard } from '@/components/ProductCard'
import { ProductMarquee } from '@/components/ProductMarquee'
import { ProductSlider } from '@/components/ProductSlider'
import { Reveal } from '@/components/Reveal'
import { ArrowIcon, WhatsAppIcon } from '@/components/icons'
import { getCategories, getFeaturedProducts, getProducts, getSettings } from '@/lib/queries'
import { waLink } from '@/lib/whatsapp'

export default async function HomePage() {
  const [settings, categories, featured, catalog] = await Promise.all([
    getSettings(),
    getCategories(),
    getFeaturedProducts(8),
    getProducts({ limit: 20 }),
  ])
  const marqueeProducts = catalog.docs
  const sliderProducts = featured.length > 0 ? featured : marqueeProducts
  const totalProducts = catalog.totalDocs

  const stats = [
    { value: String(categories.length).padStart(2, '0'), label: 'Ürün Grubu' },
    { value: `${totalProducts}+`, label: 'Ürün Çeşidi' },
    { value: '%100', label: 'Toptan Odaklı' },
    { value: '7/24', label: 'WhatsApp Desteği' },
  ]

  const wa = waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        {/* Altın hale */}
        <div
          aria-hidden="true"
          className="animate-glow pointer-events-none absolute -right-24 -top-24 h-[32rem] w-[32rem] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(201,162,75,0.22) 0%, rgba(201,162,75,0.06) 40%, transparent 70%)',
          }}
        />
        <FloatingParticles className="opacity-70" />
        <CornerFlourish
          corner="tl"
          className="pointer-events-none absolute left-3 top-3 h-16 w-16 text-gold/30 sm:h-24 sm:w-24"
        />
        <CornerFlourish
          corner="tr"
          className="pointer-events-none absolute right-3 top-3 h-16 w-16 text-gold/30 sm:h-24 sm:w-24"
        />
        <SideRail side="left" />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Toptan Parfüm Ambalajı
            </span>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl md:text-7xl">
              Parfüm Ambalajında <span className="gold-text">Zarafet</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {settings?.heroSubtitle ||
                'Cam parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişelerinde geniş ürün yelpazesi. Fiyat ve numune için WhatsApp üzerinden bize ulaşın.'}
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
                className="inline-flex items-center gap-2 rounded-full border border-line px-7 py-3.5 font-medium text-ink transition hover:border-gold hover:text-gold"
              >
                Ürünleri Keşfet
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:150ms]">
            {/* Noktalı dekoratif yay */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 text-gold/40"
            >
              <path
                d="M20,200 A180,180 0 0,1 200,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
            </svg>
            <ProductSlider products={sliderProducts} interval={1000} />
            <ScentWave className="animate-sway pointer-events-none absolute -right-6 top-6 hidden h-32 w-10 text-gold/40 sm:block" />
            <ScentWave className="animate-sway pointer-events-none absolute -left-4 bottom-8 hidden h-24 w-8 text-gold/30 [animation-delay:1.5s] sm:block" />
          </div>
        </div>

        {/* Stat bandı */}
        <div className="bg-petrol">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="font-serif text-4xl font-bold text-gold sm:text-5xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Koku notaları (ingredient) şeridi */}
      <section className="border-b border-line bg-soft">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Kokunun Dünyasına Ambalaj
          </p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Her Nota İçin Doğru Şişe
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Gülden ouda, amberden narenciyeye — her koku ailesine uygun cam ambalaj çözümleri.
          </p>
          <IngredientStrip className="mt-9" />
        </div>
      </section>

      {/* Kayan ürün şeridi */}
      {marqueeProducts.length > 0 && (
        <section className="border-b border-line bg-white py-12">
          <div className="mx-auto mb-6 flex w-full max-w-6xl items-end justify-between gap-4 px-5 sm:px-8">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                Vitrin
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
                Ürünlerimizden
              </h2>
            </Reveal>
            <Link
              href="/urunler"
              className="hidden items-center gap-1 text-sm font-medium text-gold hover:gap-2 sm:inline-flex"
            >
              Tüm Ürünler <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <ProductMarquee products={marqueeProducts} />
        </section>
      )}

      <DiamondDivider className="py-14" />

      {/* Kategori showcase (alternatif satırlar + noktalı yol) */}
      <CategoryShowcase categories={categories} />

      {/* Öne çıkan ürünler */}
      {featured.length > 0 && (
        <section className="relative overflow-hidden border-y border-line bg-soft">
          <FloatingParticles className="opacity-40" />
          <div className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">
                  Seçkin
                </p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
                  Öne Çıkan Ürünler
                </h2>
              </div>
              <Link
                href="/urunler"
                className="hidden items-center gap-1 text-sm font-medium text-gold hover:gap-2 sm:inline-flex"
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

      {/* CTA bandı */}
      <section className="relative overflow-hidden bg-petrol-deep">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,162,75,0.18) 0%, transparent 65%)',
          }}
        />
        <FloatingParticles />
        <CornerFlourish corner="tl" className="pointer-events-none absolute left-4 top-4 h-16 w-16 text-gold/40 sm:h-24 sm:w-24" />
        <CornerFlourish corner="tr" className="pointer-events-none absolute right-4 top-4 h-16 w-16 text-gold/40 sm:h-24 sm:w-24" />
        <CornerFlourish corner="bl" className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 text-gold/40 sm:h-24 sm:w-24" />
        <CornerFlourish corner="br" className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 text-gold/40 sm:h-24 sm:w-24" />
        <Reveal className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-5 py-24 text-center sm:px-8">
          <DiamondDivider />
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-5xl">
            Aradığınız ürünü bulamadınız mı?
          </h2>
          <p className="max-w-xl text-white/70">
            Ürün kataloğumuz sürekli genişliyor. İhtiyacınızı WhatsApp üzerinden iletin, size en
            uygun çözümü sunalım.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-2 inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold shadow-soft"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Hemen İletişime Geçin
          </a>
        </Reveal>
      </section>
    </>
  )
}
