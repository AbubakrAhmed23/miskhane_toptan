import 'server-only'

import { cache } from 'react'
import type { Where } from 'payload'

import type { Category, Product, Setting } from '@/payload-types'
import { getPayloadClient } from './payload'

/**
 * Build sırasında veritabanı erişilemeyebilir (ör. env değişkenleri henüz
 * tanımlı değilse). Sayfa üretimini çökertmek yerine güvenli varsayılana düşer;
 * hata build loglarında görünür ama derleme tamamlanır.
 */
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    console.warn(`[queries] ${label} başarısız — varsayılana düşüldü:`, (err as Error).message)
    return fallback
  }
}

export const getSettings = cache(async (): Promise<Setting | null> =>
  // getPayloadClient() de fırlatabilir (ör. PAYLOAD_SECRET yoksa) — o yüzden
  // istemci oluşturma da güvenli sarmalayıcının içinde.
  safe('getSettings', async () => {
    const payload = await getPayloadClient()
    return (await payload.findGlobal({ slug: 'settings', depth: 1 })) as Setting
  }, null),
)

export const getCategories = cache(async (): Promise<Category[]> =>
  safe('getCategories', async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'categories',
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    })
    return docs
  }, []),
)

export const getCategoriesWithCounts = cache(
  async (): Promise<Array<Category & { productCount: number }>> =>
   safe('getCategoriesWithCounts', async () => {
    const payload = await getPayloadClient()
    const categories = await getCategories()
    const withCounts = await Promise.all(
      categories.map(async (c) => {
        const res = await payload.count({
          collection: 'products',
          where: { and: [{ category: { equals: c.id } }, { active: { equals: true } }] },
        })
        return { ...c, productCount: res.totalDocs }
      }),
    )
    return withCounts
   }, []),
)

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> =>
  safe('getCategoryBySlug', async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return docs[0] ?? null
  }, null),
)

export interface ProductQuery {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}

const EMPTY_PAGE = { docs: [] as Product[], totalDocs: 0, page: 1, totalPages: 0 }

export const getProducts = cache(async (q: ProductQuery = {}) =>
 safe('getProducts', async () => {
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
 }, EMPTY_PAGE as never),
)

/**
 * Bir kategorinin tüm ürünlerini katalogdaki gibi boyut rozetine göre gruplar.
 * Katalogda her boyut ("50 ML", "50 ML VALFLİ" …) kendi altın rozetiyle
 * ayrı bir bölüm olarak basılır; site de aynı yapıyı izler.
 */
export const getCategoryGroups = cache(
  async (categorySlug: string): Promise<Array<{ size: string | null; products: Product[] }>> =>
   safe('getCategoryGroups', async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { and: [{ active: { equals: true } }, { 'category.slug': { equals: categorySlug } }] },
      sort: 'sortOrder',
      depth: 2,
      limit: 1000,
      pagination: false,
    })

    const groups: Array<{ size: string | null; products: Product[] }> = []
    for (const product of docs) {
      const size = product.sizeLabel ?? null
      const last = groups[groups.length - 1]
      if (last && last.size === size) last.products.push(product)
      else groups.push({ size, products: [product] })
    }
    return groups
   }, []),
)

export const getFeaturedProducts = cache(async (limit = 8): Promise<Product[]> =>
 safe('getFeaturedProducts', async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { and: [{ active: { equals: true } }, { featured: { equals: true } }] },
    sort: 'sortOrder',
    depth: 2,
    limit,
  })
  return docs
 }, []),
)

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> =>
  safe('getProductBySlug', async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return docs[0] ?? null
  }, null),
)

export const getRelatedProducts = cache(
  async (categoryId: number, excludeId: number, limit = 4): Promise<Product[]> =>
   safe('getRelatedProducts', async () => {
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
   }, []),
)

// Sitemap için tüm yayında ürün ve kategori slug'ları.
export const getAllSlugs = cache(async () =>
  safe('getAllSlugs', async () => {
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
  }, { products: [], categories: [] }),
)
