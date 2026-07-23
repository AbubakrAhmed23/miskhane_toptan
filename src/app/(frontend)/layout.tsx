import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { getCategories, getSettings } from '@/lib/queries'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings?.siteTitle || 'Miskhane Toptan'
  const description =
    settings?.heroSubtitle ||
    'Toptan parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişeleri. Fiyat ve numune için WhatsApp üzerinden ulaşın.'

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: `${title} — Toptan Parfüm Ambalajı`,
      template: `%s — ${title}`,
    },
    description,
    icons: {
      icon: [{ url: '/brand/favicon.png', type: 'image/png' }],
      apple: '/brand/favicon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      siteName: title,
      title: `${title} — Toptan Parfüm Ambalajı`,
      description,
      images: ['/brand/logo-mark.png'],
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()])

  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} categories={categories} />
        <WhatsAppFloat settings={settings} />
      </body>
    </html>
  )
}
