import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Yönetici', plural: 'Yöneticiler' },
  admin: {
    useAsTitle: 'email',
    group: 'Ayarlar',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: 'Ad Soyad',
      type: 'text',
    },
  ],
}
