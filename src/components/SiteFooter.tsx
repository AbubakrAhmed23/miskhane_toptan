import Link from 'next/link'

import type { Category, Setting } from '@/payload-types'
import { waLink } from '@/lib/whatsapp'
import { Logo } from './Logo'
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './icons'

export function SiteFooter({
  settings,
  categories,
}: {
  settings: Setting | null
  categories: Category[]
}) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-petrol-deep text-white/70">
      {/* Statement */}
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 sm:px-8">
        <div className="gold-rule mb-10 h-0.5 w-24" />
        <p className="max-w-4xl font-serif text-3xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl">
          Kokunun dünyasına <span className="gold-text">zarif ambalaj.</span>
        </p>
        <p className="mt-6 max-w-xl text-white/60">
          {settings?.tagline || 'Parfüm ambalajında zarafet.'} Cam şişe, kapak, valf, esans,
          oda kokusu ve oud çözümlerinde toptan tedarik.
        </p>
        <div className="mt-8">
          <a
            href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </div>

      {/* Linkler + iletişim */}
      <div className="mx-auto mt-16 grid w-full max-w-6xl gap-10 border-t border-white/10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1.3fr]">
        <div>
          <Logo onDark markSize={44} />
        </div>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="eyebrow mb-1 text-gold">Menü</span>
          <Link href="/urunler" className="transition hover:text-gold">
            Ürünler
          </Link>
          <Link href="/hakkimizda" className="transition hover:text-gold">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="transition hover:text-gold">
            İletişim
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.id} href={`/kategori/${c.slug}`} className="transition hover:text-gold">
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3.5 text-sm">
          <span className="eyebrow mb-1 text-gold">İletişim</span>
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2.5 hover:text-gold"
            >
              <PhoneIcon className="h-4 w-4 text-gold" />
              {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2.5 hover:text-gold"
            >
              <MailIcon className="h-4 w-4 text-gold" />
              {settings.email}
            </a>
          )}
          {settings?.address && (
            <span className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="whitespace-pre-line">{settings.address}</span>
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-8">
          <p className="code">© {year} {settings?.siteTitle || 'Miskhane Toptan'}</p>
          {settings?.website && (
            <a
              href={settings.website}
              target="_blank"
              rel="noopener noreferrer"
              className="code hover:text-gold"
            >
              miskhane.com
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
