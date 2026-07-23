import Link from 'next/link'

import type { Category } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { Reveal } from './Reveal'
import { ArrowIcon } from './icons'

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Ürün Grupları</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
          Kategorilerimizi Keşfedin
        </h2>
        <p className="mt-4 text-muted">
          Cam parfüm şişelerinden kapak, valf, esans ve difüzöre — ihtiyacınıza uygun ürün grubunu
          seçin.
        </p>
      </Reveal>

      <div className="relative mt-16">
        {/* Merkez noktalı altın yol (masaüstü) */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-4 bottom-4 hidden w-px -translate-x-1/2 md:block"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, var(--color-gold) 0 6px, transparent 6px 16px)',
            opacity: 0.4,
          }}
        />

        <div className="flex flex-col gap-16 md:gap-24">
          {categories.map((category, i) => {
            const imageFirst = i % 2 === 0
            return (
              <Reveal
                key={category.id}
                className="relative grid items-center gap-8 md:grid-cols-2 md:gap-20"
              >
                {/* Düğüm */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-white font-serif text-sm font-semibold text-gold shadow-soft md:flex"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Görsel */}
                <div className={imageFirst ? 'md:order-1' : 'md:order-2'}>
                  <Link
                    href={`/kategori/${category.slug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-line bg-paper shadow-card transition duration-300 hover:border-gold/50"
                  >
                    <div className="relative aspect-[5/4]">
                      <MediaImage
                        media={category.image}
                        size="card"
                        alt={category.name}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 90vw, 480px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </Link>
                </div>

                {/* Metin */}
                <div
                  className={`${imageFirst ? 'md:order-2 md:pl-10' : 'md:order-1 md:pr-10 md:text-right'}`}
                >
                  <h3 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                    {category.name}
                  </h3>
                  <div
                    className={`mt-3 gold-rule h-px w-16 ${imageFirst ? '' : 'md:ml-auto'}`}
                  />
                  <p className="mt-4 text-muted">
                    {category.description ||
                      'Geniş ürün yelpazesiyle toptan seçenekler. Fiyat ve numune için WhatsApp üzerinden ulaşın.'}
                  </p>
                  <Link
                    href={`/kategori/${category.slug}`}
                    className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:gap-3 ${
                      imageFirst ? '' : 'md:flex-row-reverse'
                    }`}
                  >
                    Kategoriyi Gör
                    <ArrowIcon className={`h-4 w-4 ${imageFirst ? '' : 'md:rotate-180'}`} />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
