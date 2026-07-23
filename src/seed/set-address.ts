import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const ADDRESS = 'Ragıp Gümüşpala Caddesi No:33\nKüçükpazar İş Merkezi, 34110 Fatih / İstanbul'

async function run() {
  const payload = await getPayload({ config })

  const query = encodeURIComponent(ADDRESS.replace(/\n/g, ' '))
  const mapEmbedUrl = `https://www.google.com/maps?q=${query}&output=embed`

  await payload.updateGlobal({
    slug: 'settings',
    data: { address: ADDRESS, mapEmbedUrl },
  })

  console.log('✓ Adres ve harita ayarlandı:')
  console.log(ADDRESS)
  console.log(mapEmbedUrl)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
