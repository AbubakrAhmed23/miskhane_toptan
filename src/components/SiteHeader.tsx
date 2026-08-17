'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Setting } from '@/payload-types'
import { waLink } from '@/lib/whatsapp'
import { Logo } from './Logo'
import { CloseIcon, MenuIcon, SearchIcon, WhatsAppIcon } from './icons'

const NAV = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/urunler', label: 'Ürünler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
]

/** (B) Header — sol: logo · orta: navigasyon · sağ: ikonlar */
export function SiteHeader({ settings }: { settings: Setting | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  /* Mobil menü body'ye taşınır. Header'daki `backdrop-blur` (backdrop-filter)
     içindeki `fixed` öğeler için kapsayıcı blok oluşturduğundan, panel header
     kutusuna hapsoluyor ve arka planı yalnızca header yüksekliği kadar
     çiziliyordu. Portal bunu kökten çözer. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header
      /* Renkli alt çizgi kaldırıldı: her sayfada "amber şerit" gibi okunuyordu.
         Sticky katman geri bildirimi artık yalnızca scroll'daki gölgeyle verilir. */
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-soft' : ''
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 transition-all sm:px-8 ${
          scrolled ? 'h-[68px]' : 'h-20'
        }`}
      >
        {/* Sol: logo */}
        <Link href="/" aria-label="Ana sayfa" className="shrink-0">
          <Logo markSize={scrolled ? 38 : 44} />
        </Link>

        {/* Orta: navigasyon */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative text-sm font-medium tracking-wide transition-colors ${
                isActive(item.href) ? 'text-accent-text' : 'text-espresso/80 hover:text-accent-text'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-amber transition-all duration-300 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Sağ: ikonlar */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/urunler"
            aria-label="Ürünlerde ara"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-clay/35 text-espresso transition hover:border-amber hover:text-accent-text md:flex"
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.6} />
          </Link>
          <a
            href={waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp ile iletişim"
            className="btn-gold hidden h-10 w-10 items-center justify-center rounded-full md:flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Menüyü aç"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-clay/35 text-espresso md:hidden"
          >
            <MenuIcon className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-espresso/50"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-0 flex h-full w-72 max-w-[82%] flex-col border-l border-clay bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <Logo markSize={40} />
                <button type="button" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
                  <CloseIcon className="h-6 w-6 text-espresso" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    /* Aktif öğe önce bg-clay/40 + text-accent-text idi: kontrast 3.26:1
                     (AA sınırı 4.5:1) ve clay dolgu olarak kullanılıyordu — paletin
                     "clay yalnızca ayraç/border" kuralına aykırı. Krem zemin + altın
                     halka 4.59:1 veriyor ve kurala uyuyor. */
                    className={`rounded-full px-4 py-3 text-base font-medium transition ${
                      isActive(item.href)
                        ? 'gold-text bg-cream ring-1 ring-amber/45'
                        : 'text-espresso/80 hover:bg-cream hover:text-espresso'
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
                className="btn btn-gold mt-8"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp ile İletişim
              </a>
            </div>
          </div>,
          document.body,
        )}
    </header>
  )
}
