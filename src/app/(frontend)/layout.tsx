import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import React from 'react'

import { AnnouncementBar } from '@/components/AnnouncementBar'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { WhatsAppFloat } from '@/components/WhatsAppFloat'
import { getCategories, getSettings } from '@/lib/queries'
import './globals.css'

// Cormorant Garamond — başlıklar (display serif)
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Inter — gövde metni, menü, kategoriler ve arayüz
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// JetBrains Mono — ürün kodları ve teknik veriler için "utility" yazı tipi
const jbmono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jbmono',
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
    <html lang="tr" className={`${inter.variable} ${cormorant.variable} ${jbmono.variable}`}>
      <body className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} categories={categories} />
        <WhatsAppFloat settings={settings} />
      </body>
    </html>
  )
}
