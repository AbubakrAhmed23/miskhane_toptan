import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Görseller' },
  admin: { group: 'İçerik' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternatif Metin (SEO / erişilebilirlik)',
      type: 'text',
      admin: {
        description: 'Görselin kısa açıklaması. Örn: "MHK-158 150ml şeffaf cam difüzör şişesi".',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    // ÖNEMLİ: Yüklenen dosya hiçbir şekilde yeniden kodlanmaz veya küçültülmez.
    // Orijinal PNG birebir saklanır; ürün detay sayfasında bu orijinal gösterilir.
    // Türetilen boyutlar yalnızca liste/ızgara görünümleri içindir ve
    // `withoutEnlargement` sayesinde asla büyütme (upscale) yapmaz.
    imageSizes: [
      {
        name: 'thumbnail',
        width: 500,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
      {
        name: 'card',
        width: 900,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 92 } },
      },
      {
        name: 'large',
        width: 1600,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 95 } },
      },
    ],
  },
}
