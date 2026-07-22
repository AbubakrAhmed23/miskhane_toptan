import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

// Kullanım: tsx src/seed/set-category.ts <URUN_KODU> <KATEGORI_SLUG>
// Örn:      tsx src/seed/set-category.ts MHK-148 valf-yuzuk
async function run() {
  const [, , code, categorySlug] = process.argv
  if (!code || !categorySlug) {
    console.error('Kullanım: tsx src/seed/set-category.ts <URUN_KODU> <KATEGORI_SLUG>')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const cat = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1,
  })
  if (!cat.docs[0]) {
    console.error(`Kategori bulunamadı: ${categorySlug}`)
    process.exit(1)
  }

  const prod = await payload.find({
    collection: 'products',
    where: { code: { equals: code } },
    limit: 1,
  })
  if (!prod.docs[0]) {
    console.error(`Ürün bulunamadı: ${code}`)
    process.exit(1)
  }

  await payload.update({
    collection: 'products',
    id: prod.docs[0].id,
    data: { category: cat.docs[0].id },
  })

  console.log(`✓ ${code} ürünü "${cat.docs[0].name}" kategorisine taşındı.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
