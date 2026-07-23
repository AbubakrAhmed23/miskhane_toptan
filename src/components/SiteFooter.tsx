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
    <footer className="mt-24 border-t border-line bg-night-2 text-cream/75">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {settings?.tagline || 'Parfüm ambalajında zarafet.'} Toptan cam şişe, kapak, valf,
            esans ve difüzör çözümleri.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">Kurumsal</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/urunler" className="transition hover:text-gold-soft">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="transition hover:text-gold-soft">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="transition hover:text-gold-soft">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">Kategoriler</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/kategori/${c.slug}`} className="transition hover:text-gold-soft">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">İletişim</h4>
          <ul className="mt-4 space-y-3.5 text-sm">
            {settings?.phone && (
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 text-gold" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-gold-soft">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 text-gold" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-soft">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            <li>
              <a
                href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 font-medium text-gold-soft transition hover:bg-gold hover:text-ink"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:px-8">
          <p>
            © {year} {settings?.siteTitle || 'Miskhane Toptan'}. Tüm hakları saklıdır.
          </p>
          {settings?.website && (
            <a
              href={settings.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-soft"
            >
              miskhane.com
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
