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
    <footer className="mt-20 bg-espresso text-cream/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo settings={settings} variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            {settings?.tagline || 'Parfüm ambalajında zarafet.'} Toptan cam şişe, kapak, valf,
            esans ve difüzör çözümleri.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">Kurumsal</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/urunler" className="transition hover:text-gold">
                Ürünler
              </Link>
            </li>
            <li>
              <Link href="/hakkimizda" className="transition hover:text-gold">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="transition hover:text-gold">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">Kategoriler</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/kategori/${c.slug}`} className="transition hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-cream">İletişim</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gold" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-gold">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-gold" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-2">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            <li>
              <a
                href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 font-medium text-white transition hover:bg-whatsapp-dark"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-cream/60 sm:flex-row sm:px-8">
          <p>© {year} {settings?.siteTitle || 'Miskhane Toptan'}. Tüm hakları saklıdır.</p>
          {settings?.website && (
            <a
              href={settings.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              miskhane.com
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
