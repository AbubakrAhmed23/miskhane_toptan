import Link from 'next/link'

import type { Category } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { ArrowIcon } from './icons'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-line bg-panel shadow-panel transition duration-300 hover:border-gold/50"
    >
      <MediaImage
        media={category.image}
        size="card"
        alt={category.name}
        className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
      <div className="relative flex items-center justify-between p-5">
        <h3 className="font-serif text-xl font-semibold text-cream drop-shadow">{category.name}</h3>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 text-gold-soft transition group-hover:bg-gold group-hover:text-ink">
          <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
