import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { CatalogBadge } from '@/components/CatalogBadge'
import { ProductCard } from '@/components/ProductCard'
import { ProductGallery } from '@/components/ProductGallery'
import { SpecStrip } from '@/components/SpecStrip'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ArrowIcon } from '@/components/icons'
import { firstProductImage, mediaUrl } from '@/lib/media'
import { displayCode, formatPrice } from '@/lib/format'
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

  const code = displayCode(product)
  const description = `${code ? `${code} — ` : ''}${product.title}${
    product.capacityMl ? `, ${product.capacityMl} ml` : ''
  }. Toptan fiyat ve numune için WhatsApp üzerinden iletişime geçin.`

  const imageUrl = mediaUrl(firstProductImage(product), 'large')

  return {
    title: code ? `${product.title} (${code})` : product.title,
    description,
    openGraph: {
      title: code ? `${product.title} — ${code}` : product.title,
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
  const code = displayCode(product)
  const message = productInquiryMessage(code ?? product.code, product.title)
  const price = formatPrice(product.price, product.currency)

  const specs: { label: string; value: string }[] = [
    product.capacityMl ? { label: 'Hacim', value: `${product.capacityMl} ml` } : null,
    product.weightG ? { label: 'Ağırlık', value: `${product.weightG} g` } : null,
    product.height ? { label: 'Yükseklik', value: `${product.height} mm` } : null,
    product.width ? { label: 'Genişlik / Çap', value: `${product.width} mm` } : null,
    product.neckSize ? { label: 'Ağız / Diş Ölçüsü', value: product.neckSize } : null,
    product.material ? { label: 'Malzeme', value: product.material } : null,
    product.finish ? { label: 'Renk / Kaplama', value: product.finish } : null,
    product.variants ? { label: 'Seçenekler', value: product.variants } : null,
    product.unitsPerBox ? { label: 'Koli İçi Adet', value: `${product.unitsPerBox} adet` } : null,
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
    sku: code ?? product.code,
    ...(category ? { category: category.name } : {}),
    brand: { '@type': 'Brand', name: 'Miskhane' },
    ...(imageUrl ? { image: [`${baseUrl}${imageUrl}`] } : {}),
    ...(product.price
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency ?? 'USD',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-muted">
            <Link href="/" className="hover:text-accent-text">
              Ana Sayfa
            </Link>
            <span className="text-muted">/</span>
            <Link href="/urunler" className="hover:text-accent-text">
              Katalog
            </Link>
            {category && (
              <>
                <span className="text-muted">/</span>
                <Link href={`/kategori/${category.slug}`} className="hover:text-accent-text">
                  {category.name}
                </Link>
              </>
            )}
            <span className="text-muted">/</span>
            <span className="text-navy">{code ?? product.title}</span>
          </nav>

          {category ? (
            <div className="mt-8 flex justify-center">
              <CatalogBadge category={category.name} size={product.sizeLabel} />
            </div>
          ) : null}

          <div className="mt-10 grid gap-12 section-pb md:grid-cols-2">
            <ProductGallery product={product} />

            <div className="flex flex-col">
              {code ? <p className="product-code text-2xl">{code}</p> : null}
              <h1 className="section-title mt-2 text-3xl text-navy sm:text-4xl">{product.title}</h1>

              {price ? (
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">Fiyat</span>
                  <span className="code text-3xl font-medium text-accent-text">{price}</span>
                </p>
              ) : null}

              {/* Katalogdaki gri teknik şerit — birebir aynı sütun düzeni */}
              <SpecStrip product={product} className="spec-strip--lg mt-6" />

              {specs.length > 0 && (
                <dl className="mt-8 divide-y divide-clay/70">
                  {specs.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                        {row.label}
                      </dt>
                      <dd className="code text-sm text-navy">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-8 rounded-2xl bg-cream p-6">
                <p className="text-sm leading-relaxed text-muted">
                  Toptan sipariş, numune ve güncel stok bilgisi için WhatsApp üzerinden bize
                  ulaşın. Ürün kodunu{' '}
                  <span className="font-medium text-accent-text">{code ?? product.title}</span>{' '}
                  belirtmeniz yeterli.
                </p>
                <div className="mt-5">
                  <WhatsAppButton
                    number={settings?.whatsappNumber}
                    message={message}
                    className="btn btn-gold"
                  >
                    Bu Ürün İçin Teklif Al
                  </WhatsAppButton>
                </div>
              </div>

              {product.description && (
                <div className="richtext mt-8 text-navy/90">
                  <RichText data={product.description} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {related.length > 0 && (
        <section className="section-y bg-white">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <div className="flex items-baseline justify-between">
              <h2 className="section-title text-2xl text-navy sm:text-3xl">Benzer Ürünler</h2>
              {category && (
                <Link
                  href={`/kategori/${category.slug}`}
                  className="btn-link"
                >
                  Tümü <ArrowIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
