import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ArrowIcon } from '@/components/icons'
import { firstProductImage, mediaUrl } from '@/lib/media'
import { getProductBySlug, getRelatedProducts, getSettings } from '@/lib/queries'
import { productInquiryMessage } from '@/lib/whatsapp'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Ürün bulunamadı' }

  const description = `${product.code} — ${product.title}${
    product.capacityMl ? `, ${product.capacityMl} ml` : ''
  }. Fiyat ve numune için WhatsApp üzerinden iletişime geçin.`

  const img = firstProductImage(product)
  const imageUrl = mediaUrl(img, 'large')

  return {
    title: `${product.title} (${product.code})`,
    description,
    openGraph: {
      title: `${product.title} — ${product.code}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.active === false) notFound()

  const settings = await getSettings()
  const category = typeof product.category === 'object' ? product.category : null
  const related = category ? await getRelatedProducts(category.id, product.id, 4) : []
  const message = productInquiryMessage(product.code, product.title)

  const specs: { label: string; value: string }[] = [
    product.capacityMl ? { label: 'Hacim', value: `${product.capacityMl} ml` } : null,
    product.height ? { label: 'Yükseklik', value: `${product.height} mm` } : null,
    product.width ? { label: 'Genişlik / Çap', value: `${product.width} mm` } : null,
    product.neckSize ? { label: 'Ağız / Diş Ölçüsü', value: product.neckSize } : null,
    product.material ? { label: 'Malzeme', value: product.material } : null,
    product.finish ? { label: 'Renk / Kaplama', value: product.finish } : null,
    product.minOrder
      ? { label: 'Minimum Alım', value: `${product.minOrder} ${product.orderUnit ?? 'adet'}` }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null)

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const imageUrl = mediaUrl(firstProductImage(product), 'large')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.code,
    ...(category ? { category: category.name } : {}),
    brand: { '@type': 'Brand', name: 'Miskhane' },
    ...(imageUrl ? { image: [`${baseUrl}${imageUrl}`] } : {}),
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-gold">
          Ana Sayfa
        </Link>
        <span className="text-line">/</span>
        <Link href="/urunler" className="hover:text-gold">
          Ürünler
        </Link>
        {category && (
          <>
            <span className="text-line">/</span>
            <Link href={`/kategori/${category.slug}`} className="hover:text-gold">
              {category.name}
            </Link>
          </>
        )}
        <span className="text-line">/</span>
        <span className="text-ink">{product.code}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ürün Kodu: <span className="font-medium text-ink">{product.code}</span>
          </p>

          {specs.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <tbody>
                  {specs.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-soft'}>
                      <th className="w-1/2 px-4 py-3 text-left font-medium text-muted">
                        {row.label}
                      </th>
                      <td className="px-4 py-3 font-medium text-ink">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-5">
            <p className="text-sm text-muted">
              Fiyat bilgisi ve numune talebi için WhatsApp üzerinden bize ulaşın. Ürün kodunu
              (<span className="text-gold">{product.code}</span>) belirtmeniz yeterli.
            </p>
            <div className="mt-4">
              <WhatsAppButton
                number={settings?.whatsappNumber}
                message={message}
                className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shadow-soft"
              >
                Bu Ürün İçin WhatsApp'tan Sor
              </WhatsAppButton>
            </div>
          </div>

          {product.description && (
            <div className="richtext mt-8 text-ink/90">
              <RichText data={product.description} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Benzer Ürünler
            </h2>
            {category && (
              <Link
                href={`/kategori/${category.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:gap-2"
              >
                Tümü <ArrowIcon className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
