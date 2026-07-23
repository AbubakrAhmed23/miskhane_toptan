'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import type { Setting } from '@/payload-types'
import { waLink } from '@/lib/whatsapp'
import { Logo } from './Logo'
import { CloseIcon, MenuIcon, WhatsAppIcon } from './icons'

const LEFT = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/urunler', label: 'Ürünler' },
]
const RIGHT = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
]
const ALL = [...LEFT, ...RIGHT]

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

  const navLink = (item: { href: string; label: string }) => (
    <Link
      key={item.href}
      href={item.href}
      className={`group relative text-sm font-medium tracking-wide transition-colors ${
        isActive(item.href) ? 'text-gold-deep' : 'text-ink/80 hover:text-gold-deep'
      }`}
    >
      {item.label}
      <span
        className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
          isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  )

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-shadow ${
        scrolled ? 'border-line shadow-soft' : 'border-line/60'
      }`}
    >
      {/* Masthead — masaüstü: ortada logo, iki yana bölünmüş menü */}
      <div
        className={`mx-auto hidden w-full max-w-6xl grid-cols-3 items-center px-8 transition-all md:grid ${
          scrolled ? 'h-[68px]' : 'h-24'
        }`}
      >
        <nav className="flex items-center gap-8">{LEFT.map(navLink)}</nav>
        <div className="flex justify-center">
          <Link href="/" aria-label="Ana sayfa">
            <Logo markSize={scrolled ? 40 : 52} />
          </Link>
        </div>
        <nav className="flex items-center justify-end gap-8">
          {RIGHT.map(navLink)}
          <a
            href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="btn-gold flex h-10 w-10 items-center justify-center rounded-full"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </nav>
      </div>

      {/* Mobil bar */}
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-5 md:hidden">
        <Link href="/" aria-label="Ana sayfa">
          <Logo markSize={40} />
        </Link>
        <button type="button" onClick={() => setOpen(true)} aria-label="Menüyü aç">
          <MenuIcon className="h-7 w-7 text-ink" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-petrol-deep/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[82%] flex-col border-l border-line bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <Logo markSize={40} />
              <button type="button" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
                <CloseIcon className="h-6 w-6 text-ink" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {ALL.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base font-medium transition ${
                    isActive(item.href) ? 'bg-soft text-gold-deep' : 'text-ink/80 hover:bg-soft'
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
