'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import type { Setting } from '@/payload-types'
import { waLink } from '@/lib/whatsapp'
import { Logo } from './Logo'
import { CloseIcon, MenuIcon, WhatsAppIcon } from './icons'

const NAV = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/urunler', label: 'Ürünler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
]

export function SiteHeader({ settings }: { settings: Setting | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Ana sayfa">
          <Logo settings={settings} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition hover:text-gold ${
                isActive(item.href) ? 'text-gold' : 'text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-medium text-white transition hover:bg-whatsapp-dark md:inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Menüyü aç"
        >
          <MenuIcon className="h-7 w-7 text-ink" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-cream p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo settings={settings} />
              <button type="button" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
                <CloseIcon className="h-6 w-6 text-ink" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base font-medium transition ${
                    isActive(item.href) ? 'bg-sand text-gold' : 'text-ink hover:bg-sand'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a
              href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-medium text-white transition hover:bg-whatsapp-dark"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp ile İletişim
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
