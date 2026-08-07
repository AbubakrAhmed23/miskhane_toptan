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
    <footer className="bg-espresso text-white/70">
      {/* Krem gövdeden koyu footer'a yumuşak geçiş: ince altın gradient bant */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-gold) 25%, var(--color-gold-light) 50%, var(--color-gold) 75%, transparent)',
        }}
      />
      <div
        aria-hidden="true"
        className="h-16 w-full"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-gold) 14%, transparent), transparent)',
        }}
      />

      {/* Kapanış CTA'sı — hero'daki metni tekrar etmez, sipariş adımına odaklanır */}
      <div className="mx-auto -mt-8 w-full max-w-6xl px-5 sm:px-8">
        <p className="eyebrow eyebrow--on-dark">Sipariş &amp; Numune</p>
        <p className="section-title mt-4 max-w-3xl text-3xl leading-[1.15] text-white sm:text-4xl">
          Ürün kodunu yazın, <span className="text-cream">fiyatı hemen iletelim.</span>
        </p>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
          Katalogdaki kodu (örn. MHK-135) WhatsApp'tan gönderin; güncel toptan fiyat, koli adedi ve
          sevkiyat süresini paylaşalım. Numune talebinizi de aynı mesajda iletebilirsiniz.
        </p>
        <div className="mt-9">
          <a
            href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp ile İletişime Geç
          </a>
        </div>
      </div>

      {/* Linkler + iletişim */}
      <div className="mx-auto mt-16 grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr_1.3fr]">
        <div>
          <Logo onDark markSize={44} />
        </div>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="eyebrow eyebrow--on-dark mb-1">Menü</span>
          <Link href="/urunler" className="transition hover:text-cream">
            Ürünler
          </Link>
          <Link href="/hakkimizda" className="transition hover:text-cream">
            Hakkımızda
          </Link>
          <Link href="/iletisim" className="transition hover:text-cream">
            İletişim
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link key={c.id} href={`/kategori/${c.slug}`} className="transition hover:text-cream">
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3.5 text-sm">
          <span className="eyebrow eyebrow--on-dark mb-1">İletişim</span>
          {settings?.phone && (
            <a
              href={`tel:${settings.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2.5 hover:text-cream"
            >
              <PhoneIcon className="h-4 w-4 text-cream" />
              {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-2.5 hover:text-cream"
            >
              <MailIcon className="h-4 w-4 text-cream" />
              {settings.email}
            </a>
          )}
          {settings?.address && (
            <span className="flex items-start gap-2.5">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-cream" />
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
              className="code hover:text-cream"
            >
              miskhane.com
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
