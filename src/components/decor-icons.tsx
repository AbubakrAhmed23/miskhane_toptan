import type { SVGProps } from 'react'

// Elle çizilmiş basit çizgi-ikonlar (özgün). stroke = currentColor.
const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

/* --- Parfüm & ambalaj --- */

export function PerfumeBottleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="6.5" y="9" width="11" height="12" rx="2.5" />
      <path d="M9.5 9V6h5v3" />
      <rect x="9.5" y="2.6" width="5" height="3.4" rx="0.6" />
      <path d="M9 13.5h7" />
    </svg>
  )
}

export function SprayValveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="11" width="8" height="10" rx="2" />
      <path d="M9 11V8h4v3" />
      <rect x="8.4" y="4.4" width="5.2" height="3.4" rx="0.6" />
      <path d="M13.6 6h3.2" />
      <path d="M18.5 4.6l1.4-.9M19 6h1.8M18.5 7.4l1.4.9" />
    </svg>
  )
}

export function CapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="7.5" y="4" width="9" height="10" rx="1.6" />
      <path d="M7.5 8.5h9" />
      <path d="M10 14v3.5M12 14v3.5M14 14v3.5" />
    </svg>
  )
}

export function DropletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3s6.5 7.4 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.4 12 3 12 3Z" />
      <path d="M9 14.5a3 3 0 0 0 3 3" />
    </svg>
  )
}

export function RingValveIcon(props: SVGProps<SVGSVGElement>) {
  // Valf yüzüğü (crimp ring)
  return (
    <svg {...base} {...props}>
      <ellipse cx="12" cy="8" rx="6" ry="2.6" />
      <path d="M6 8v4c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V8" />
      <path d="M12 14.6V21" />
      <path d="M9.5 18h5" />
    </svg>
  )
}

/* --- Koku notaları (ingredients) --- */

export function RoseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M12 8.5a2.4 2.4 0 1 0 .01 0" />
      <path d="M9.4 6.6c1-1.3 3.2-1.3 4.2 0" />
      <path d="M12 14v7" />
      <path d="M12 17c-1.4 0-2.6-.9-3.4-2M12 18.6c1.4 0 2.6-.9 3.4-2" />
    </svg>
  )
}

export function WoodIcon(props: SVGProps<SVGSVGElement>) {
  // Oud / ağaç çubukları
  return (
    <svg {...base} {...props}>
      <path d="M5 20 15 4" />
      <path d="M9 20 19 4" />
      <path d="M7.5 15.5l1.6.9M12.5 8l1.6.9" />
    </svg>
  )
}

export function CitrusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 3.8v16.4M3.8 12h16.4M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8" />
    </svg>
  )
}

export function FlowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="6.5" r="3" />
      <circle cx="6.8" cy="10.5" r="3" />
      <circle cx="17.2" cy="10.5" r="3" />
      <circle cx="8.8" cy="16.5" r="3" />
      <circle cx="15.2" cy="16.5" r="3" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function AmberIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l6.5 6L12 21 5.5 9 12 3Z" />
      <path d="M5.5 9h13M12 3v18" />
    </svg>
  )
}

export function LavenderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21V8.5" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="6.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="6.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="8.6" r="1" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="8.6" r="1" fill="currentColor" stroke="none" />
      <path d="M12 14l-3 2M12 16l3 2" />
    </svg>
  )
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21C6.5 15.5 6.5 6.5 12 3c5.5 3.5 5.5 12.5 0 18Z" />
      <path d="M12 5v14" />
    </svg>
  )
}
