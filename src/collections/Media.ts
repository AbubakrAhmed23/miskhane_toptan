import type { CollectionConfig, GenerateImageName } from 'payload'

/** Türev görsel adı: ad-boyut-genişlikxyükseklik.uzantı — boyut adı çakışmayı önler. */
const nameWithSize: GenerateImageName = ({ extension, height, originalName, sizeName, width }) =>
  `${originalName}-${sizeName}-${width}x${height}.${extension}`

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
    //
    // Dosya adına boyut adı da yazılır. Payload'ın varsayılan adlandırması yalnızca
    // genişlik×yükseklik kullanır; katalog görsellerinin çoğu 900 pikselden dar
    // olduğu için `withoutEnlargement` ile card ve large aynı ölçüye inip aynı adı
    // üretiyordu. Yerel diskte bu sessizce üzerine yazıyordu, Vercel Blob ise
    // eşzamanlı ikinci yazımı reddediyor ("blob already exists").
    imageSizes: [
      {
        name: 'thumbnail',
        width: 500,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 90 } },
        generateImageName: nameWithSize,
      },
      {
        name: 'card',
        width: 900,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 92 } },
        generateImageName: nameWithSize,
      },
      {
        name: 'large',
        width: 1600,
        withoutEnlargement: true,
        formatOptions: { format: 'webp', options: { quality: 95 } },
        generateImageName: nameWithSize,
      },
    ],
  },
}
