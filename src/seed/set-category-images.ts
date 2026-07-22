import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

// Her kategoriye temsili bir ürün görselini kapak olarak atar (mevcut görseller yeniden kullanılır).
const MAP: Record<string, string> = {
  'parfum-siseleri': 'MHK-128',
  'sise-kapaklari': 'MHK-165',
  'valf-yuzuk': 'MHK-148',
  esans: 'MHK-151',
  difuzor: 'MHK-160',
}

async function run() {
  const payload = await getPayload({ config })

  for (const [slug, code] of Object.entries(MAP)) {
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (!cat.docs[0]) {
      console.log(`! Kategori yok: ${slug} — atlandı`)
      continue
    }

    const prod = await payload.find({
      collection: 'products',
      where: { code: { equals: code } },
      limit: 1,
      depth: 0,
    })
    const firstImage = prod.docs[0]?.images?.[0]?.image
    const mediaId = typeof firstImage === 'number' ? firstImage : undefined
    if (!mediaId) {
      console.log(`! ${code} için görsel bulunamadı — ${slug} atlandı`)
      continue
    }

    await payload.update({
      collection: 'categories',
      id: cat.docs[0].id,
      data: { image: mediaId },
    })
    console.log(`✓ ${cat.docs[0].name} kapağı → ${code} görseli`)
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
