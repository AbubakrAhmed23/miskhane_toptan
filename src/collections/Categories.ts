import type { CollectionConfig } from 'payload'

import { slugify } from '../lib/slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategoriler' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: 'Katalog',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      label: 'Kategori Adı',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'URL (slug)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Boş bırakılırsa kategori adından otomatik oluşturulur. Örn: parfum-siseleri',
      },
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Kategori Görseli',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sortOrder',
      label: 'Sıra',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Küçük sayı önce gösterilir.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = slugify(String(data.name))
        }
        return data
      },
    ],
  },
}
