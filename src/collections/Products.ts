import type { CollectionConfig } from 'payload'

import { slugify } from '../lib/slugify'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Ürün', plural: 'Ürünler' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'code', 'category', 'active', 'featured'],
    group: 'Katalog',
    listSearchableFields: ['title', 'code'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          label: 'Ürün Kodu',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '50%', placeholder: 'örn. MHK-158' },
        },
        {
          name: 'title',
          label: 'Ürün Adı',
          type: 'text',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'images',
      label: 'Görseller',
      type: 'array',
      labels: { singular: 'Görsel', plural: 'Görseller' },
      admin: {
        description: 'İlk görsel ana (kapak) görsel olarak kullanılır. Sürükleyerek sıralayabilirsiniz.',
      },
      fields: [
        {
          name: 'image',
          label: 'Görsel',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Teknik Özellikler',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'capacityMl', label: 'Hacim (ml)', type: 'number', admin: { width: '33%' } },
            { name: 'height', label: 'Yükseklik (mm)', type: 'number', admin: { width: '33%' } },
            { name: 'width', label: 'Genişlik / Çap (mm)', type: 'number', admin: { width: '34%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'neckSize',
              label: 'Ağız / Diş Ölçüsü',
              type: 'text',
              admin: { width: '33%', placeholder: 'örn. FEA 15' },
            },
            {
              name: 'material',
              label: 'Malzeme',
              type: 'text',
              defaultValue: 'Cam',
              admin: { width: '33%' },
            },
            {
              name: 'finish',
              label: 'Renk / Kaplama',
              type: 'text',
              admin: { width: '34%', placeholder: 'örn. Şeffaf, Altın işlemeli' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'minOrder', label: 'Minimum Alım', type: 'number', admin: { width: '50%' } },
            {
              name: 'orderUnit',
              label: 'Birim',
              type: 'select',
              defaultValue: 'adet',
              options: [
                { label: 'Adet', value: 'adet' },
                { label: 'Koli', value: 'koli' },
                { label: 'Palet', value: 'palet' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'richText',
    },
    // --- Kenar çubuğu ---
    {
      name: 'slug',
      label: 'URL (slug)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Boş bırakılırsa ürün kodundan otomatik oluşturulur.',
      },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      label: 'Yayında',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Kapatılırsa üründe sitede görünmez.' },
    },
    {
      name: 'featured',
      label: 'Öne Çıkan',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Ana sayfada öne çıkanlar bölümünde gösterilir.' },
    },
    {
      name: 'sortOrder',
      label: 'Sıra',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Küçük sayı önce gösterilir.' },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug) {
          const base = data.code || data.title
          if (base) data.slug = slugify(String(base))
        }
        return data
      },
    ],
  },
}
