import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductCard } from '@/components/ProductCard'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ArrowIcon } from '@/components/icons'
import { getCategories, getCategoryBySlug, getProducts, getSettings } from '@/lib/queries'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.filter((c) => c.slug).map((c) => ({ slug: c.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Kategori bulunamadı' }
  return {
    title: category.name,
    description: category.description || `${category.name} ürün grubu — toptan.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [settings, result] = await Promise.all([
    getSettings(),
    getProducts({ categorySlug: slug, limit: 48 }),
  ])
  const products = result.docs

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-gold">
          Ana Sayfa
        </Link>
        <span className="text-line">/</span>
        <Link href="/urunler" className="hover:text-gold">
          Ürünler
        </Link>
        <span className="text-line">/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-ink sm:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-muted">{result.totalDocs} ürün</p>
      </header>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-white py-16 text-center">
          <p className="max-w-md text-muted">
            Bu kategoride henüz ürün eklenmemiş. WhatsApp üzerinden bize ulaşabilirsiniz.
          </p>
          <WhatsAppButton
            number={settings?.whatsappNumber}
            message={settings?.whatsappDefaultMessage}
          />
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/urunler"
          className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:gap-2"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Tüm ürünlere dön
        </Link>
      </div>
    </div>
  )
}
