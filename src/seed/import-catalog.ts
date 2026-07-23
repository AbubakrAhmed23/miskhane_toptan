import 'dotenv/config'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../lib/slugify'

interface CatalogItem {
  printedName: string
  code: string | null
  capacityMl: number | null
  koliAdet: number | null
  koliIciAdet: number | null
  price: string | null
  type: string
  page: number
}

const JSON_PATH =
  '/private/tmp/claude-501/-Users-abubakrahmed-Documents-projects-Websites-Miskhanetoptan/671ca63b-0176-4a04-af53-ce8515d03340/scratchpad/katalog/products.json'

// Kategoriler (yalnızca ürünü olanlar oluşturulur)
const CATS: Record<
  string,
  { name: string; sortOrder: number; description: string; codePrefix?: string }
> = {
  'parfum-siseleri': {
    name: 'Parfüm Şişeleri',
    sortOrder: 1,
    description: 'Farklı hacim ve formlarda toptan cam parfüm şişeleri.',
  },
  'sprey-siseler': {
    name: 'Sprey Şişeler',
    sortOrder: 2,
    description: 'Sprey/atomizer valfli ve seyahat tipi renkli parfüm şişeleri.',
  },
  'dekoratif-siseler': {
    name: 'Dekoratif Şişeler',
    sortOrder: 3,
    description: 'Altın işlemeli, oryantal ve dekoratif esans/parfüm şişeleri.',
  },
  'sise-kapaklari': {
    name: 'Şişe Kapakları',
    sortOrder: 4,
    description: 'Parfüm şişeleri için şık ve dayanıklı kapaklar.',
  },
  'valf-yuzuk': {
    name: 'Valf & Pompa',
    sortOrder: 5,
    description: 'Sprey valfleri, pompalar ve sıkma yüzükleri.',
  },
  'damlalik-aplikator': {
    name: 'Damlalık & Aplikatör',
    sortOrder: 6,
    description: 'Şişe için damlalık, redüktör ve aplikatör parçaları.',
  },
  esans: {
    name: 'Esans',
    sortOrder: 7,
    description: 'Yoğun ve kalıcı parfüm esansları.',
    codePrefix: 'ESANS',
  },
  'oda-kokusu': {
    name: 'Oda Kokusu',
    sortOrder: 8,
    description: 'Oda spreyi ve mekan kokuları.',
    codePrefix: 'ODA',
  },
  'oud-buhur': {
    name: 'Oud & Buhur',
    sortOrder: 9,
    description: 'Oud, misk kremleri, tütsü ve ahşap buhurdanlar.',
    codePrefix: 'OUD',
  },
}

const TYPE2CAT: Record<string, string> = {
  sise: 'parfum-siseleri',
  'sprey-sise': 'sprey-siseler',
  dekoratif: 'dekoratif-siseler',
  kapak: 'sise-kapaklari',
  valf: 'valf-yuzuk',
  damlalik: 'damlalik-aplikator',
}

const TYPE_LABEL: Record<string, string> = {
  sise: 'Parfüm Şişesi',
  'sprey-sise': 'Sprey Şişe',
  dekoratif: 'Dekoratif Şişe',
  kapak: 'Şişe Kapağı',
  valf: 'Valf / Pompa',
  damlalik: 'Damlalık',
}

// Kodsuz koku ürünlerini sayfaya göre kategorile.
function fragranceCat(page: number): string {
  if (page >= 22 && page <= 24) return 'oud-buhur'
  if (page === 25 || page === 26) return 'esans'
  if (page >= 27 && page <= 28) return 'oda-kokusu'
  return 'esans'
}

function catForItem(item: CatalogItem): string {
  if (item.type === 'diger' || !item.code) return fragranceCat(item.page)
  return TYPE2CAT[item.type] ?? 'parfum-siseleri'
}

function titleCaseTr(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1) : w))
    .join(' ')
    .trim()
}

function titleFor(item: CatalogItem, catSlug: string): string {
  if (item.type === 'diger' || !item.code) {
    const suffix =
      catSlug === 'esans' ? ' Esansı' : catSlug === 'oda-kokusu' ? ' Oda Kokusu' : ''
    const name = titleCaseTr(item.printedName)
    // İsim zaten "esans/oda" içermiyorsa uygun soneki ekle
    return suffix && !name.toLocaleLowerCase('tr-TR').includes(suffix.trim().toLocaleLowerCase('tr-TR'))
      ? `${name}${suffix}`
      : name
  }
  const label = TYPE_LABEL[item.type] ?? 'Parfüm Şişesi'
  const cap = item.capacityMl ? `${item.capacityMl} ml ` : ''
  const variant = item.code.match(/-(altin|gumus|siyah|gold|silver|black)$/i)?.[1]
  const variantTr: Record<string, string> = {
    altin: 'Altın',
    gumus: 'Gümüş',
    siyah: 'Siyah',
    gold: 'Altın',
    silver: 'Gümüş',
    black: 'Siyah',
  }
  const v = variant ? ` (${variantTr[variant.toLowerCase()] ?? variant})` : ''
  return `${cap}${label}${v}`.trim()
}

// Kaynak görsel dosya adını katalog koduyla aynı şemaya normalize eder.
function fileToCode(fileName: string): string | null {
  const base = fileName.replace(/\.[^.]+$/, '')
  const upper = base.toLocaleUpperCase('tr-TR').replace(/İ/g, 'I').replace(/Ş/g, 'S')
  const mhk = upper.match(/MHK\D*(\d+)/)
  if (mhk) return `MHK-${mhk[1]}`
  const msk = upper.match(/(?:MISK\s*HANE|MISKHANE)\D*(\d+)/)
  if (msk) return `MSK-${msk[1]}`
  return null
}

async function run() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`products.json bulunamadı: ${JSON_PATH}`)
    process.exit(1)
  }
  const raw: CatalogItem[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))

  // Kod ata (kodsuzlara kategori önekiyle), sonra tekilleştir
  const usedCodes = new Set<string>()
  const items: (CatalogItem & { code: string; catSlug: string })[] = []
  let dupes = 0
  for (const it of raw) {
    const catSlug = catForItem(it)
    let code = (it.code ?? '').trim()
    if (!code) {
      const prefix = CATS[catSlug].codePrefix ?? 'URN'
      code = `${prefix}-${slugify(it.printedName).toUpperCase()}`
    }
    // benzersizleştir
    let unique = code
    let n = 2
    while (usedCodes.has(unique)) unique = `${code}-${n++}`
    if (unique !== code && it.code) dupes++
    usedCodes.add(unique)
    items.push({ ...it, code: unique, catSlug })
  }
  console.log(`Toplam ${raw.length} kayıt → ${items.length} ürün (${dupes} kod çakışması çözüldü).`)

  const payload = await getPayload({ config })

  // 1) Tam sıfırlama
  await payload.delete({ collection: 'products', where: { id: { exists: true } } })
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })
  console.log('✓ Eski ürün/kategori/görseller temizlendi.')

  // 2) Gerekli kategoriler
  const neededSlugs = new Set(items.map((i) => i.catSlug))
  const catId = new Map<string, number>()
  for (const slug of Object.keys(CATS)) {
    if (!neededSlugs.has(slug)) continue
    const c = CATS[slug]
    const created = await payload.create({
      collection: 'categories',
      data: { name: c.name, slug, description: c.description, sortOrder: c.sortOrder },
    })
    catId.set(slug, created.id)
    console.log(`✓ Kategori: ${c.name}`)
  }

  // 3) Kaynak görselleri koda göre yükle (yalnızca katalogda karşılığı olanlar)
  const sourceDir = path.resolve(process.cwd(), 'source-assets/urunler')
  const codeToMedia = new Map<string, number>()
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mh-cat-'))
  if (fs.existsSync(sourceDir)) {
    const files = fs.readdirSync(sourceDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    for (const file of files) {
      const code = fileToCode(file)
      if (!code || codeToMedia.has(code) || !usedCodes.has(code)) continue
      const cap = items.find((r) => r.code === code)?.capacityMl
      const cleanName = `${slugify(code)}${cap ? `-${cap}ml` : ''}.png`
      const tmpPath = path.join(tmpDir, cleanName)
      fs.copyFileSync(path.join(sourceDir, file), tmpPath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: `${code} ürün görseli` },
        filePath: tmpPath,
      })
      codeToMedia.set(code, media.id)
    }
    console.log(`✓ ${codeToMedia.size} ürün görseli yüklendi (eşleşen).`)
  }

  // 4) Ürünleri oluştur
  let order = 0
  let withImg = 0
  for (const it of items) {
    order++
    const category = catId.get(it.catSlug)
    if (!category) continue
    const mediaId = codeToMedia.get(it.code)
    if (mediaId) withImg++
    const isFragrance = it.type === 'diger'
    await payload.create({
      collection: 'products',
      data: {
        code: it.code,
        title: titleFor(it, it.catSlug),
        slug: slugify(it.code),
        category,
        capacityMl: it.capacityMl ?? undefined,
        material: isFragrance ? undefined : 'Cam',
        unitsPerBox: it.koliIciAdet ?? undefined,
        boxCount: it.koliAdet ?? undefined,
        images: mediaId ? [{ image: mediaId }] : undefined,
        active: true,
        featured: false,
        sortOrder: order,
      },
    })
  }
  console.log(`✓ ${items.length} ürün oluşturuldu (${withImg} fotoğraflı, ${items.length - withImg} fotoğrafsız).`)

  const hasImage = (p: { images?: unknown }) =>
    Array.isArray(p.images) && p.images.length > 0

  // 5) Kategori kapakları (fotoğraflı üründen) + öne çıkanlar
  for (const [, id] of catId) {
    const inCat = await payload.find({
      collection: 'products',
      where: { category: { equals: id } },
      limit: 500,
      depth: 0,
    })
    const withPhoto = inCat.docs.find(hasImage)
    const img = withPhoto?.images?.[0]?.image
    if (typeof img === 'number') {
      await payload.update({ collection: 'categories', id, data: { image: img } })
    }
  }

  const all = await payload.find({
    collection: 'products',
    sort: 'sortOrder',
    limit: 1000,
    depth: 0,
  })
  const featuredPick = all.docs.filter(hasImage).slice(0, 8)
  for (const p of featuredPick) {
    await payload.update({ collection: 'products', id: p.id, data: { featured: true } })
  }
  console.log(`✓ Kategori kapakları ve ${featuredPick.length} öne çıkan ürün ayarlandı.`)

  console.log('\nİçe aktarma tamamlandı.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
