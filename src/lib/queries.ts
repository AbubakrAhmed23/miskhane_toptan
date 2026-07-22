import 'server-only'

import { cache } from 'react'
import type { Where } from 'payload'

import type { Category, Product, Setting } from '@/payload-types'
import { getPayloadClient } from './payload'

export const getSettings = cache(async (): Promise<Setting | null> => {
  const payload = await getPayloadClient()
  try {
    const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    return settings as Setting
  } catch {
    return null
  }
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export interface ProductQuery {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}

export const getProducts = cache(async (q: ProductQuery = {}) => {
  const payload = await getPayloadClient()
  const and: Where[] = [{ active: { equals: true } }]
  if (q.categorySlug) and.push({ 'category.slug': { equals: q.categorySlug } })
  if (q.search) {
    and.push({
      or: [{ title: { like: q.search } }, { code: { like: q.search } }],
    })
  }
  return payload.find({
    collection: 'products',
    where: { and },
    sort: 'sortOrder',
    depth: 2,
    limit: q.limit ?? 24,
    page: q.page ?? 1,
  })
})

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ active: { equals: true } }, { featured: { equals: true } }] },
    sort: 'sortOrder',
    depth: 2,
    limit,
  })
  return docs
})

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getRelatedProducts = cache(
  async (categoryId: number, excludeId: number, limit = 4): Promise<Product[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        and: [
          { active: { equals: true } },
          { category: { equals: categoryId } },
          { id: { not_equals: excludeId } },
        ],
      },
      sort: 'sortOrder',
      depth: 2,
      limit,
    })
    return docs
  },
)

// Sitemap için tüm yayında ürün ve kategori slug'ları.
export const getAllSlugs = cache(async () => {
  const payload = await getPayloadClient()
  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { active: { equals: true } },
      limit: 1000,
      depth: 0,
      pagination: false,
    }),
    payload.find({ collection: 'categories', limit: 1000, depth: 0, pagination: false }),
  ])
  return {
    products: products.docs.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })),
    categories: categories.docs.map((c) => ({ slug: c.slug, updatedAt: c.updatedAt })),
  }
})
