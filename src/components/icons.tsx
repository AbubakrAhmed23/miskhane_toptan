import type { SVGProps } from 'react'

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.82 9.82 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413" />
    </svg>
  )
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

/* ---------------------------------------------------------------
   İnce çizgili ikon seti — tümü 1.3 stroke, 24'lük ızgara.
   Bölüm başlıklarında ikon + kısa etiket olarak kullanılır.
   --------------------------------------------------------------- */
const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Toptan / koli teslimat */
export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M2 7.5A1.5 1.5 0 0 1 3.5 6h9A1.5 1.5 0 0 1 14 7.5V16H2V7.5Z" />
      <path d="M14 10h3.6a2 2 0 0 1 1.7.95L21.5 14v2H14v-6Z" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </svg>
  )
}

/** Kalite güvencesi */
export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M12 3l7 2.6v5.2c0 4.4-2.9 8.4-7 10.2-4.1-1.8-7-5.8-7-10.2V5.6L12 3Z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </svg>
  )
}

/** Numune / paket */
export function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M12 3 3.5 7.2v9.6L12 21l8.5-4.2V7.2L12 3Z" />
      <path d="M3.5 7.2 12 11.5l8.5-4.3M12 11.5V21" />
    </svg>
  )
}

/** Destek / iletişim */
export function SupportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M4 13v-1a8 8 0 1 1 16 0v1" />
      <path d="M4 13h2.2a1 1 0 0 1 1 1v3.4a1 1 0 0 1-1 1H5.4A1.4 1.4 0 0 1 4 17V13ZM20 13h-2.2a1 1 0 0 0-1 1v3.4a1 1 0 0 0 1 1h.8A1.4 1.4 0 0 0 20 17V13Z" />
    </svg>
  )
}

/** Özel üretim / zanaat */
export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M12 3.5 13.7 9 19 10.8 13.7 12.6 12 18l-1.7-5.4L5 10.8 10.3 9 12 3.5Z" />
      <path d="M18.5 16.5 19.2 18.5 21 19.2 19.2 19.9 18.5 22 17.8 19.9 16 19.2 17.8 18.5 18.5 16.5Z" />
    </svg>
  )
}

/** Şişe / ürün çeşidi */
export function BottleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M10 2.8h4v2.4c0 1 .4 1.5 1.1 2.2.9.9 1.4 2 1.4 3.4v8.4a2.4 2.4 0 0 1-2.4 2.4H9.9a2.4 2.4 0 0 1-2.4-2.4v-8.4c0-1.4.5-2.5 1.4-3.4.7-.7 1.1-1.2 1.1-2.2V2.8Z" />
      <path d="M7.5 12.5h9" />
    </svg>
  )
}

/** Katalog / liste */
export function CatalogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} {...props}>
      <path d="M4 4.5h6.5a2 2 0 0 1 2 2V20a1.8 1.8 0 0 0-1.8-1.6H4V4.5ZM20 4.5h-6.5a2 2 0 0 0-2 2V20a1.8 1.8 0 0 1 1.8-1.6H20V4.5Z" />
    </svg>
  )
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} strokeWidth={1.6} {...props}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  )
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...line} strokeWidth={1.6} {...props}>
      <path d="m9.5 5 7 7-7 7" />
    </svg>
  )
}
