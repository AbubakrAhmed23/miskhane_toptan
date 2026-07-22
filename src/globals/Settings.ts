import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Ayarları',
  admin: { group: 'Ayarlar' },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'İletişim',
          fields: [
            {
              name: 'whatsappNumber',
              label: 'WhatsApp Numarası',
              type: 'text',
              required: true,
              defaultValue: '905000000000',
              admin: {
                description:
                  'Uluslararası formatta, başında + ve boşluk olmadan sadece rakam. Örn: 905321234567',
              },
            },
            {
              name: 'whatsappDefaultMessage',
              label: 'Varsayılan WhatsApp Mesajı',
              type: 'text',
              defaultValue: 'Merhaba, ürünleriniz hakkında bilgi almak istiyorum.',
              admin: { description: 'Ürün sayfası dışından yazıldığında kullanılan mesaj.' },
            },
            { name: 'phone', label: 'Telefon', type: 'text' },
            { name: 'email', label: 'E-posta', type: 'email' },
            { name: 'address', label: 'Adres', type: 'textarea' },
            {
              name: 'mapEmbedUrl',
              label: 'Google Harita Embed Bağlantısı',
              type: 'text',
              admin: {
                description:
                  'Google Haritalar > Paylaş > Harita yerleştir bölümündeki iframe içindeki src bağlantısı.',
              },
            },
          ],
        },
        {
          label: 'Marka / Ana Sayfa',
          fields: [
            {
              name: 'siteTitle',
              label: 'Site Başlığı',
              type: 'text',
              defaultValue: 'Miskhane Toptan',
            },
            {
              name: 'tagline',
              label: 'Slogan',
              type: 'text',
              defaultValue: 'Parfüm ambalajında zarafet',
            },
            { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
            {
              name: 'heroTitle',
              label: 'Ana Başlık (Hero)',
              type: 'text',
              defaultValue: 'Toptan Parfüm Şişeleri ve Ambalaj Çözümleri',
            },
            {
              name: 'heroSubtitle',
              label: 'Alt Başlık (Hero)',
              type: 'textarea',
              defaultValue:
                'Cam parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişelerinde geniş ürün yelpazesi. Fiyat ve numune için WhatsApp üzerinden bize ulaşın.',
            },
            { name: 'heroImage', label: 'Hero Görseli', type: 'upload', relationTo: 'media' },
            { name: 'aboutText', label: 'Hakkımızda Metni', type: 'richText' },
          ],
        },
        {
          label: 'Sosyal Medya',
          fields: [
            { name: 'instagram', label: 'Instagram bağlantısı', type: 'text' },
            { name: 'facebook', label: 'Facebook bağlantısı', type: 'text' },
            {
              name: 'website',
              label: 'Ana Web Sitesi',
              type: 'text',
              defaultValue: 'https://miskhane.com',
            },
          ],
        },
      ],
    },
  ],
}
