import Link from 'next/link'

import { CategoryCard } from '@/components/CategoryCard'
import { MediaImage } from '@/components/MediaImage'
import { ProductCard } from '@/components/ProductCard'
import { ProductMarquee } from '@/components/ProductMarquee'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ArrowIcon, CheckIcon } from '@/components/icons'
import { firstProductImage } from '@/lib/media'
import { getCategories, getFeaturedProducts, getProducts, getSettings } from '@/lib/queries'

const TRUST = [
  { title: 'Geniş Ürün Yelpazesi', text: 'Şişe, kapak, valf, esans ve difüzörde yüzlerce seçenek.' },
  { title: 'Toptan Avantajı', text: 'Toptan alıma özel fiyat ve numune desteği.' },
  { title: 'Hızlı İletişim', text: 'Sorularınıza WhatsApp üzerinden anında yanıt.' },
  { title: 'Kaliteli İşçilik', text: 'Dayanıklı cam ve özenli üretim standardı.' },
]

export default async function HomePage() {
  const [settings, categories, featured, catalog] = await Promise.all([
    getSettings(),
    getCategories(),
    getFeaturedProducts(8),
    getProducts({ limit: 20 }),
  ])
  const marqueeProducts = catalog.docs

  const heroImage =
    settings?.heroImage || (featured.length > 0 ? firstProductImage(featured[0]) : null)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold">
              Toptan Parfüm Ambalajı
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
              {settings?.heroTitle || 'Toptan Parfüm Şişeleri ve Ambalaj Çözümleri'}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {settings?.heroSubtitle ||
                'Cam parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişelerinde geniş ürün yelpazesi. Fiyat ve numune için WhatsApp üzerinden bize ulaşın.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <WhatsAppButton
                number={settings?.whatsappNumber}
                message={settings?.whatsappDefaultMessage}
              />
              <Link
                href="/urunler"
                className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 font-medium text-ink transition hover:bg-ink hover:text-cream"
              >
                Ürünleri Keşfet
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <MediaImage
                media={heroImage}
                size="large"
                alt={settings?.heroTitle || 'Miskhane toptan parfüm ambalajı'}
                className="object-contain p-8"
                sizes="(max-width: 768px) 90vw, 420px"
                priority
              />
            </div>
            <div className="pointer-events-none absolute -right-6 -top-6 -z-0 hidden h-40 w-40 rounded-full bg-gold-soft/25 blur-2xl md:block" />
          </div>
        </div>
      </section>

      {/* Kayan ürün şeridi */}
      {marqueeProducts.length > 0 && (
        <section className="border-t border-line bg-cream py-10">
          <div className="mx-auto mb-6 flex w-full max-w-6xl items-end justify-between gap-4 px-5 sm:px-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                Ürünlerimizden
              </h2>
              <p className="mt-1 text-sm text-muted">
                Bir ürüne tıklayın, ait olduğu kategoriyi keşfedin.
              </p>
            </div>
            <Link
              href="/urunler"
              className="hidden items-center gap-1 text-sm font-medium text-gold hover:underline sm:inline-flex"
            >
              Tüm Ürünler <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <ProductMarquee products={marqueeProducts} />
        </section>
      )}

      {/* Trust band */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-10 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">Kategoriler</h2>
              <p className="mt-2 text-muted">İhtiyacınıza uygun ürün grubunu seçin.</p>
            </div>
            <Link
              href="/urunler"
              className="hidden items-center gap-1 text-sm font-medium text-gold hover:underline sm:inline-flex"
            >
              Tümünü Gör <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="bg-sand/50">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
                Öne Çıkan Ürünler
              </h2>
              <Link
                href="/urunler"
                className="hidden items-center gap-1 text-sm font-medium text-gold hover:underline sm:inline-flex"
              >
                Tüm Ürünler <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-espresso">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-16 text-center sm:px-8">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold text-cream sm:text-4xl">
            Aradığınız ürünü bulamadınız mı?
          </h2>
          <p className="max-w-xl text-cream/70">
            Ürün kataloğumuz sürekli genişliyor. İhtiyacınızı WhatsApp üzerinden iletin, size en
            uygun çözümü sunalım.
          </p>
          <WhatsAppButton
            number={settings?.whatsappNumber}
            message={settings?.whatsappDefaultMessage}
          />
        </div>
      </section>
    </>
  )
}
