import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

// Kullanım: tsx src/seed/set-whatsapp.ts <NUMARA>
// Yerel (0...) veya uluslararası (90... / +90...) girilebilir; otomatik normalize edilir.
function normalizeTr(input: string): string {
  let digits = input.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = `90${digits.slice(1)}`
  else if (!digits.startsWith('90')) digits = `90${digits}`
  return digits
}

async function run() {
  const raw = process.argv[2]
  if (!raw) {
    console.error('Kullanım: tsx src/seed/set-whatsapp.ts <NUMARA>')
    process.exit(1)
  }
  const number = normalizeTr(raw)

  const payload = await getPayload({ config })
  await payload.updateGlobal({
    slug: 'settings',
    data: { whatsappNumber: number },
  })

  console.log(`✓ WhatsApp numarası ayarlandı: ${number}  (wa.me/${number})`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
