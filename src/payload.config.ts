import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { tr } from '@payloadcms/translations/languages/tr'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// DATABASE_URL, Neon'un Vercel entegrasyonunun kendi eklediği addır; elle
// DATABASE_URI tanımlamak zorunda kalmamak için yedek olarak okunur.
const databaseUri = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:./miskhane.db'
const usePostgres = databaseUri.startsWith('postgres')

// Yerel geliştirmede SQLite, üretimde Postgres (Neon). Tek env değişkeni ile seçilir.
const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseUri } })
  : sqliteAdapter({ client: { url: databaseUri } })

// Görsel deposu: BLOB_READ_WRITE_TOKEN varsa Vercel Blob, yoksa yerel disk (/media).
// Token'ı Vercel, projeye Blob store bağlandığında kendisi ekler.
const plugins: Plugin[] = []
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Miskhane Toptan Yönetim',
    },
  },
  collections: [Products, Categories, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  i18n: {
    supportedLanguages: { tr },
    fallbackLanguage: 'tr',
  },
  plugins,
})
