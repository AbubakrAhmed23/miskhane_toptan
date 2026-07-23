'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? 'border-line bg-white/90 backdrop-blur'
          : 'border-transparent bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Ana sayfa">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative text-sm font-medium tracking-wide transition-colors ${
                isActive(item.href) ? 'text-gold' : 'text-ink/80 hover:text-gold'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        <a
          href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-soft md:inline-flex"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>

        <button
          type="button"
          className="text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Menüyü aç"
        >
          <MenuIcon className="h-7 w-7" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[82%] flex-col border-l border-line bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
                <CloseIcon className="h-6 w-6 text-ink" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base font-medium transition ${
                    isActive(item.href)
                      ? 'bg-white text-gold'
                      : 'text-ink/80 hover:bg-white'
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
              className="btn-gold mt-8 flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold"
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
