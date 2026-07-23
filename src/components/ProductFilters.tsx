'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'

import type { Category } from '@/payload-types'
import { SearchIcon } from './icons'

export function ProductFilters({
  categories,
  activeCategory,
  search,
}: {
  categories: Category[]
  activeCategory?: string
  search?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(search ?? '')

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams()
    if (slug) params.set('kategori', slug)
    if (search) params.set('q', search)
    const qs = params.toString()
    return qs ? `/urunler?${qs}` : '/urunler'
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (value.trim()) params.set('q', value.trim())
    if (activeCategory) params.set('kategori', activeCategory)
    const qs = params.toString()
    router.push(qs ? `/urunler?${qs}` : '/urunler')
  }

  const chipClass = (isActive: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'border-gold bg-gold text-ink'
        : 'border-line bg-white text-ink/80 hover:border-gold/60 hover:text-gold'
    }`

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ürün kodu veya adı ile ara..."
          aria-label="Ürün ara"
          className="w-full rounded-full border border-line bg-white py-3 pl-12 pr-24 text-sm text-ink outline-none transition placeholder:text-muted focus:border-gold"
        />
        <button
          type="submit"
          className="btn-gold absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full px-5 py-2 text-sm font-semibold"
        >
          Ara
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link href={buildHref()} className={chipClass(!activeCategory)}>
          Tümü
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={buildHref(c.slug ?? undefined)}
            className={chipClass(activeCategory === c.slug)}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
