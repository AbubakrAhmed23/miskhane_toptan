/**
 * media/ürünler klasöründeki tüm ürün görsellerini siteye aktarır.
 *
 * Ürün bilgileri (kod, fiyat, koli içi adet, ml/g/mm ölçüleri) "yenikatalog1.pdf"
 * katalogundan çıkarılıp scratchpad/products-manifest.json dosyasına yazılmıştı;
 * bu betik o listeyi okuyup veritabanını sıfırdan kurar.
 *
 * Çalıştırma:  npx tsx src/seed/import-urunler.ts
 *
 * NOT: Görseller Payload'a orijinal PNG olarak, hiçbir küçültme veya yeniden
 * kodlama yapılmadan yüklenir (bkz. src/collections/Media.ts).
 */
import 'dotenv/config'

import fs from 'fs'
import path from 'path'

import { getPayload } from 'payload'

import config from '../payload.config'

const MANIFEST =
  process.env.MANIFEST_PATH ??
  path.resolve(process.cwd(), 'src/seed/data/products-manifest.json')

const IMAGE_ROOT = path.resolve(process.cwd(), 'media/ürünler')

interface ManifestCategory {
  name: string
  slug: string
  en: string
  sortOrder: number
  description: string
}

interface ManifestProduct {
  code: string
  displayCode: string | null
  title: string
  slug: string
  category: string
  categoryName: string
  sizeLabel: string | null
  capacityMl: number | null
  variants: string | null
  price: number | null
  currency: 'USD' | 'TRY' | null
  unitsPerBox: number | null
  weightG: number | null
  heightMm: number | null
  widthMm: number | null
  catalogPage: number | null
  images: string[]
  sortOrder: number
}

interface Manifest {
  categories: ManifestCategory[]
  products: ManifestProduct[]
}

// Kapak görseli olarak kullanılacak kategori örnekleri (temsil gücü yüksek ürünler).
const CATEGORY_COVER: Record<string, string> = {
  'parfum-siseleri': '50 ml/mhk16.png',
  'esans-siseleri': '12 ml/mhk24.png',
  kapaklar: 'kapaklar/MHK25.png',
  valfler: 'miskhane 4.png',
  tipalar: 'mhk18.png',
  kolonyalar: 'kolonyalar/lavanta.png',
  'sprey-oda-kokulari': 'oda kokuları/sprey/lavanta.png',
  'bambu-cubuklu-oda-kokulari': 'oda kokuları/bambu çubuklu/lavanta.png',
  buhurlar: 'buhurlar/oudh istanbul.png',
  'ahsap-buhurdanliklar': 'buhurdanlıklar/galata modeli.png',
}

async function run() {
  if (!fs.existsSync(MANIFEST)) {
    console.error(`Ürün listesi bulunamadı: ${MANIFEST}`)
    process.exit(1)
  }
  const manifest: Manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  const { categories, products } = manifest

  // Aktarmadan önce her görselin gerçekten var olduğunu doğrula — eksik varsa hiç başlama.
  const missing: string[] = []
  for (const p of products) {
    for (const rel of p.images) {
      if (!fs.existsSync(path.join(IMAGE_ROOT, rel))) missing.push(rel)
    }
  }
  if (missing.length) {
    console.error(`${missing.length} görsel bulunamadı, aktarım durduruldu:`)
    missing.slice(0, 20).forEach((m) => console.error('  ', m))
    process.exit(1)
  }
  const totalImages = products.reduce((n, p) => n + p.images.length, 0)
  console.log(`${products.length} ürün / ${totalImages} görsel doğrulandı.\n`)

  const payload = await getPayload({ config })

  // 1) Tam sıfırlama
  await payload.delete({ collection: 'products', where: { id: { exists: true } } })
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  console.log('✓ Eski ürün, kategori ve görseller silindi.')

  // 2) Kategoriler
  const catId = new Map<string, number>()
  for (const c of categories) {
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: c.name,
        nameEn: c.en,
        slug: c.slug,
        description: c.description,
        sortOrder: c.sortOrder,
      },
    })
    catId.set(c.slug, created.id)
  }
  console.log(`✓ ${categories.length} kategori oluşturuldu.`)

  // 3) Görseller + ürünler
  //    Görsel, kaynak dosyanın kendisinden yüklenir (kopya/dönüştürme yok).
  const mediaByFile = new Map<string, number>()
  let created = 0
  let uploaded = 0

  for (const p of products) {
    const category = catId.get(p.category)
    if (!category) {
      console.warn(`! Kategori bulunamadı, atlandı: ${p.code} (${p.category})`)
      continue
    }

    const imageIds: number[] = []
    for (const rel of p.images) {
      let id = mediaByFile.get(rel)
      if (id === undefined) {
        const altBits = [p.displayCode ?? p.title, p.sizeLabel, p.categoryName].filter(Boolean)
        const media = await payload.create({
          collection: 'media',
          data: { alt: `${altBits.join(' ')} — Miskhane Toptan` },
          filePath: path.join(IMAGE_ROOT, rel),
        })
        id = media.id
        mediaByFile.set(rel, id)
        uploaded++
        if (uploaded % 25 === 0) console.log(`   … ${uploaded}/${totalImages} görsel yüklendi`)
      }
      imageIds.push(id)
    }

    await payload.create({
      collection: 'products',
      data: {
        code: p.code,
        catalogCode: p.displayCode ?? undefined,
        title: p.title,
        slug: p.slug,
        category,
        sizeLabel: p.sizeLabel ?? undefined,
        variants: p.variants ?? undefined,
        capacityMl: p.capacityMl ?? undefined,
        weightG: p.weightG ?? undefined,
        height: p.heightMm ?? undefined,
        width: p.widthMm ?? undefined,
        unitsPerBox: p.unitsPerBox ?? undefined,
        price: p.price ?? undefined,
        currency: p.currency ?? undefined,
        material: undefined,
        images: imageIds.map((image) => ({ image })),
        active: true,
        featured: false,
        sortOrder: p.sortOrder,
      },
    })
    created++
  }
  console.log(`✓ ${uploaded} görsel yüklendi, ${created} ürün oluşturuldu.`)

  // 4) Kategori kapak görselleri
  for (const c of categories) {
    const id = catId.get(c.slug)
    if (!id) continue
    let mediaId = CATEGORY_COVER[c.slug] ? mediaByFile.get(CATEGORY_COVER[c.slug]) : undefined
    if (!mediaId) {
      // Kapak tanımlı değilse kategorideki ilk ürünün görselini kullan.
      const first = products.find((p) => p.category === c.slug && p.images.length)
      mediaId = first ? mediaByFile.get(first.images[0]) : undefined
    }
    if (mediaId) await payload.update({ collection: 'categories', id, data: { image: mediaId } })
  }
  console.log('✓ Kategori kapak görselleri ayarlandı.')

  // 5) Öne çıkanlar — her kategoriden bir ürün, katalog sırasına göre.
  let featured = 0
  for (const c of categories) {
    const first = products.find((p) => p.category === c.slug)
    if (!first) continue
    const { docs } = await payload.find({
      collection: 'products',
      where: { code: { equals: first.code } },
      limit: 1,
      depth: 0,
    })
    if (docs[0]) {
      await payload.update({ collection: 'products', id: docs[0].id, data: { featured: true } })
      featured++
    }
  }
  console.log(`✓ ${featured} öne çıkan ürün işaretlendi.`)

  const counts = await Promise.all(
    categories.map(async (c) => {
      const res = await payload.count({
        collection: 'products',
        where: { category: { equals: catId.get(c.slug) } },
      })
      return `${c.name}: ${res.totalDocs}`
    }),
  )
  console.log('\nKategori dağılımı:\n  ' + counts.join('\n  '))
  console.log('\nİçe aktarma tamamlandı.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
