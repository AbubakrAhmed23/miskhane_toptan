import type { Metadata } from 'next'

import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { getCategories, getProducts, getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Ürünler',
  description:
    'Toptan parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişeleri. Ürün kodu veya adıyla arayın.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>
}) {
  const sp = await searchParams
  const search = sp.q?.trim() || undefined
  const categorySlug = sp.kategori || undefined

  const [settings, categories, result] = await Promise.all([
    getSettings(),
    getCategories(),
    getProducts({ search, categorySlug, limit: 48 }),
  ])

  const products = result.docs
  const activeCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">
          {activeCategory ? activeCategory.name : 'Tüm Ürünler'}
        </h1>
        <p className="mt-2 text-muted">
          {search
            ? `“${search}” için ${result.totalDocs} sonuç bulundu.`
            : `${result.totalDocs} ürün listeleniyor.`}
        </p>
      </header>

      <ProductFilters categories={categories} activeCategory={categorySlug} search={search} />

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-line bg-paper py-16 text-center">
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
  )
}
