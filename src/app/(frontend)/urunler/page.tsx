import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { ProductFilters } from '@/components/ProductFilters'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { MediaImage } from '@/components/MediaImage'
import { ArrowIcon } from '@/components/icons'
import { getCategoriesWithCounts, getProducts, getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Katalog',
  description:
    'Toptan parfüm şişeleri, esans şişeleri, kapaklar, valfler, kolonyalar, oda kokuları ve buhurlar. Ürün kodu veya adıyla arayın.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>
}) {
  const sp = await searchParams
  const search = sp.q?.trim() || undefined
  const categorySlug = sp.kategori || undefined
  const filtering = Boolean(search || categorySlug)

  const [settings, categories, result] = await Promise.all([
    getSettings(),
    getCategoriesWithCounts(),
    filtering ? getProducts({ search, categorySlug, limit: 96 }) : Promise.resolve(null),
  ])

  const activeCategory = categories.find((c) => c.slug === categorySlug)
  const totalProducts = categories.reduce((n, c) => n + c.productCount, 0)

  return (
    <div>
      {/* ---- Katalog başlığı ---- */}
      <section className="bg-cream">
        <div className="section-y mx-auto w-full max-w-6xl px-5 text-center sm:px-8">
          <p className="eyebrow">Miskhane Perfumes</p>
          <h1 className="section-title mt-4 text-4xl text-espresso sm:text-5xl md:text-6xl">KATALOG</h1>
          <p className="section-subtitle mt-3">Catalogue</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            {totalProducts} ürünlük toptan koleksiyon; parfüm ve esans şişelerinden kapaklara,
            kolonyalardan oda kokularına kadar tüm ürün grupları.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <ProductFilters categories={categories} activeCategory={categorySlug} search={search} />
      </div>

      {filtering && result ? (
        /* ---- Filtreli sonuçlar ---- */
        <section className="bg-white section-pb">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <p className="pb-8 text-center text-xs uppercase tracking-[0.24em] text-accent-text">
              {search
                ? `“${search}” için ${result.totalDocs} sonuç`
                : `${activeCategory?.name ?? 'Ürünler'} — ${result.totalDocs} ürün`}
            </p>
            {result.docs.length > 0 ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {result.docs.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 py-16 text-center">
                <p className="max-w-md text-muted">
                  Aradığınız kritere uygun ürün bulunamadı. Aradığınız ürünü WhatsApp üzerinden bize
                  iletebilirsiniz.
                </p>
                <WhatsAppButton
                  number={settings?.whatsappNumber}
                  message={settings?.whatsappDefaultMessage}
                />
              </div>
            )}
          </div>
      </section>
      ) : (
        /* ---- Katalog dizini: bölümler ---- */
        <section className="bg-white section-pb">
          <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-12 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Reveal key={category.id} delay={(i % 3) * 70}>
              <Link
                href={`/kategori/${category.slug}`}
                className="card group flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-2xl border-b border-clay/40 bg-white">
                  <MediaImage
                    media={category.image}
                    size="card"
                    alt={`${category.name} kategorisi`}
                    className="object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-xl leading-snug text-espresso">{category.name}</h2>
                  {category.nameEn ? (
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.24em] text-muted">
                      {category.nameEn}
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs text-muted">{category.productCount} ürün</p>
                  <span className="btn-link mt-auto pt-5">
                    İncele
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
      </section>
      )}

    </div>
  )
}
