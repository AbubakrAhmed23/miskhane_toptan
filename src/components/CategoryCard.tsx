import Link from 'next/link'

import type { Category } from '@/payload-types'
import { MediaImage } from './MediaImage'
import { ArrowIcon } from './icons'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/kategori/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl border border-line bg-sand shadow-soft"
    >
      <MediaImage
        media={category.image}
        size="card"
        alt={category.name}
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
      <div className="relative flex items-center justify-between p-5 text-cream">
        <h3 className="font-serif text-xl font-semibold drop-shadow-sm">{category.name}</h3>
        <ArrowIcon className="h-5 w-5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  )
}
