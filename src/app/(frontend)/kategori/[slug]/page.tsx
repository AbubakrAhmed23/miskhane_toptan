import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CatalogBadge } from '@/components/CatalogBadge'
import { ProductCard } from '@/components/ProductCard'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ArrowIcon } from '@/components/icons'
import { getCategories, getCategoryBySlug, getCategoryGroups, getSettings } from '@/lib/queries'
import { mediaUrl } from '@/lib/media'

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

// Katalogdaki bölüm ayracı fotoğrafları (yenikatalog1.pdf'ten alındı).
const HERO: Record<string, string> = {
  'parfum-siseleri': '/catalog/cat-parfum-siseleri.webp',
  'esans-siseleri': '/catalog/cat-esans-siseleri.webp',
  kapaklar: '/catalog/cat-kapaklar.webp',
  kolonyalar: '/catalog/cat-kolonyalar.webp',
  'sprey-oda-kokulari': '/catalog/cat-oda-kokulari.webp',
  'bambu-cubuklu-oda-kokulari': '/catalog/cat-oda-kokulari.webp',
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [settings, groups] = await Promise.all([getSettings(), getCategoryGroups(slug)])
  const total = groups.reduce((n, g) => n + g.products.length, 0)
  const hero = HERO[slug] ?? mediaUrl(category.image, 'large')

  return (
    <div>
      {/* ---- Bölüm ayracı: katalogdaki tam sayfa tanıtım ---- */}
      <section className="bg-cream">
        <div className="mx-auto w-full max-w-6xl px-5 pt-10 sm:px-8">
          <nav className="mb-8 flex items-center gap-2 text-xs tracking-wide text-muted">
            <Link href="/" className="hover:text-accent-text">
              Ana Sayfa
            </Link>
            <span className="text-muted">/</span>
            <Link href="/urunler" className="hover:text-accent-text">
              Katalog
            </Link>
            <span className="text-muted">/</span>
            <span className="text-navy">{category.name}</span>
          </nav>

          <header className="text-center">
            <h1 className="section-title text-4xl text-navy sm:text-5xl md:text-6xl">
              {category.name.toLocaleUpperCase('tr-TR')}
            </h1>
            {category.nameEn ? (
              <p className="section-subtitle mt-3">{category.nameEn}</p>
            ) : null}
            {category.description ? (
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">
                {category.description}
              </p>
            ) : null}
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-accent-text">
              {total} ürün
            </p>
          </header>

          {hero ? (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card sm:aspect-[2/1]">
              <Image
                src={hero}
                alt={`${category.name} koleksiyonu`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1152px"
              />
            </div>
          ) : null}
        </div>
        <div className="section-pb" />
      </section>

      {/* ---- Ürünler: katalogdaki gibi boyut rozetiyle ayrılmış bölümler ---- */}
      {total > 0 ? (
        <div className="bg-white">
          {groups.map((group, i) => (
            <section key={`${group.size ?? 'genel'}-${i}`}>
              <div
                className={`mx-auto w-full max-w-6xl px-5 pb-12 sm:px-8 ${i === 0 ? 'pt-12 sm:pt-16' : 'pt-10'}`}
              >
                <div className="flex justify-center">
                  <CatalogBadge category={category.name} size={group.size} />
                </div>
                <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {group.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-5 py-20 text-center sm:px-8">
          <p className="max-w-md text-muted">
            Bu kategoride henüz ürün eklenmemiş. WhatsApp üzerinden bize ulaşabilirsiniz.
          </p>
          <WhatsAppButton
            number={settings?.whatsappNumber}
            message={settings?.whatsappDefaultMessage}
          />
        </div>
      )}


      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <Link
          href="/urunler"
          className="btn-link"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          Katalog dizinine dön
        </Link>
      </div>
    </div>
  )
}
