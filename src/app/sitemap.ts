import type { MetadataRoute } from 'next'

import { getAllSlugs } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const staticRoutes: MetadataRoute.Sitemap = ['', '/urunler', '/hakkimizda', '/iletisim'].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: p === '' ? 1 : 0.7,
    }),
  )

  try {
    const { products, categories } = await getAllSlugs()

    const categoryRoutes: MetadataRoute.Sitemap = categories
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${base}/kategori/${c.slug}`,
        lastModified: new Date(c.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${base}/urun/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      }))

    return [...staticRoutes, ...categoryRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
