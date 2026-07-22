import 'dotenv/config'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../lib/slugify'

// --- Kategoriler ---
const CATEGORIES = [
  { slug: 'parfum-siseleri', name: 'Parfüm Şişeleri', singular: 'Parfüm Şişesi', sortOrder: 1, description: 'Farklı hacim ve formlarda toptan cam parfüm şişeleri.' },
  { slug: 'sise-kapaklari', name: 'Şişe Kapakları', singular: 'Şişe Kapağı', sortOrder: 2, description: 'Parfüm şişeleri için şık ve dayanıklı kapaklar.' },
  { slug: 'valf-yuzuk', name: 'Valf & Yüzük', singular: 'Valf & Yüzük', sortOrder: 3, description: 'Sprey valfleri ve sıkma yüzükleri.' },
  { slug: 'esans', name: 'Parfüm Esansı', singular: 'Parfüm Esansı', sortOrder: 4, description: 'Yoğun ve kalıcı parfüm esansları.' },
  { slug: 'difuzor', name: 'Difüzör (Oda Kokusu)', singular: 'Difüzör Şişesi', sortOrder: 5, description: 'Oda kokusu / difüzör şişeleri.' },
] as const

type CatSlug = (typeof CATEGORIES)[number]['slug']

function detectCategory(name: string): CatSlug {
  const n = name.toLocaleUpperCase('tr-TR')
  if (n.includes('KAPAK')) return 'sise-kapaklari'
  if (n.includes('VALF') || n.includes('YÜZÜK') || n.includes('YUZUK')) return 'valf-yuzuk'
  if (n.includes('DIFÜZÖR') || n.includes('DIFUZOR') || n.includes('ODA')) return 'difuzor'
  if (n.includes('ESANS')) return 'esans'
  return 'parfum-siseleri'
}

function detectCode(baseName: string): string {
  const upper = baseName.toLocaleUpperCase('tr-TR').replace(/İ/g, 'I')
  const mhk = upper.match(/MHK\D*(\d+)/)
  if (mhk) return `MHK-${mhk[1]}`
  const misk = upper.match(/(?:MISK\s*HANE|MISKHANE)\D*(\d+)/)
  if (misk) return `MHK-${misk[1]}`
  const anyNum = upper.match(/(\d+)/)
  if (anyNum) return `MHK-${anyNum[1]}`
  return slugify(baseName).toUpperCase()
}

function detectCapacity(baseName: string): number | null {
  const m = baseName.match(/(\d+)\s*ML/i)
  return m ? parseInt(m[1], 10) : null
}

async function run() {
  const payload = await getPayload({ config })

  // 1) Admin kullanıcı
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@miskhane.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Miskhane2026!'
  const userCount = await payload.count({ collection: 'users' })
  if (userCount.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword, name: 'Yönetici' },
    })
    console.log(`✓ Admin kullanıcı oluşturuldu: ${adminEmail} / ${adminPassword}`)
  } else {
    console.log('• Admin kullanıcı zaten var, atlandı.')
  }

  // 2) Kategoriler
  const catIdBySlug = new Map<string, number>()
  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    if (existing.docs[0]) {
      catIdBySlug.set(cat.slug, existing.docs[0].id)
      continue
    }
    const created = await payload.create({
      collection: 'categories',
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    })
    catIdBySlug.set(cat.slug, created.id)
    console.log(`✓ Kategori: ${cat.name}`)
  }

  // 3) Ürünler (kaynak görsellerden)
  const sourceDir = path.resolve(process.cwd(), 'source-assets/urunler')
  if (!fs.existsSync(sourceDir)) {
    console.log(`! Kaynak görsel klasörü yok: ${sourceDir} — ürün aktarımı atlandı.`)
    return
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'miskhane-seed-'))
  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort()

  const usedCodes = new Set<string>()
  let order = 0
  let created = 0

  for (const file of files) {
    order += 1
    const baseName = file.replace(/\.[^.]+$/, '')
    let code = detectCode(baseName)
    while (usedCodes.has(code)) code = `${code}-2`
    usedCodes.add(code)

    // Zaten var mı?
    const exists = await payload.find({
      collection: 'products',
      where: { code: { equals: code } },
      limit: 1,
    })
    if (exists.docs[0]) {
      console.log(`• ${code} zaten var, atlandı.`)
      continue
    }

    const catSlug = detectCategory(baseName)
    const catInfo = CATEGORIES.find((c) => c.slug === catSlug)!
    const capacity = detectCapacity(baseName)
    const title = `${capacity ? `${capacity} ml ` : ''}${catInfo.singular}`

    // Temiz adlı geçici kopya (yüklenen dosya adı düzgün olsun diye)
    const cleanName = `${slugify(code)}${capacity ? `-${capacity}ml` : ''}.png`
    const tmpPath = path.join(tmpDir, cleanName)
    fs.copyFileSync(path.join(sourceDir, file), tmpPath)

    const media = await payload.create({
      collection: 'media',
      data: { alt: `${code} — ${title}` },
      filePath: tmpPath,
    })

    await payload.create({
      collection: 'products',
      data: {
        code,
        title,
        slug: slugify(code),
        category: catIdBySlug.get(catSlug)!,
        capacityMl: capacity ?? undefined,
        material: 'Cam',
        images: [{ image: media.id }],
        active: true,
        featured: created < 8,
        sortOrder: order,
      },
    })
    created += 1
    console.log(`✓ Ürün: ${code} — ${title} (${catInfo.name})`)
  }

  console.log(`\nTamamlandı. ${created} ürün oluşturuldu.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
