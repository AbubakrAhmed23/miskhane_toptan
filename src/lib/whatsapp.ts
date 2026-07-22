// WhatsApp derin bağlantısı (wa.me) üretir. Numara sadece rakamlara indirgenir.
export function waLink(number?: string | null, message?: string | null): string {
  const digits = (number || '').replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

// Ürün sayfasındaki "bilgi al" mesajını hazırlar.
export function productInquiryMessage(code?: string | null, title?: string | null): string {
  const label = [code, title].filter(Boolean).join(' — ')
  return `Merhaba, ${label} ürünü hakkında bilgi almak istiyorum.`
}
