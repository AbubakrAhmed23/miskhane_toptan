import Image from 'next/image'

import type { Setting } from '@/payload-types'
import { mediaAlt, mediaUrl } from '@/lib/media'

export function Logo({
  settings,
  variant = 'dark',
}: {
  settings: Setting | null
  variant?: 'dark' | 'light'
}) {
  const url = mediaUrl(settings?.logo, 'thumbnail')
  const title = settings?.siteTitle || 'Miskhane Toptan'

  if (url) {
    return (
      <Image
        src={url}
        alt={mediaAlt(settings?.logo, title)}
        width={180}
        height={48}
        className="h-10 w-auto object-contain"
        priority
      />
    )
  }

  return (
    <span className={`flex flex-col leading-none ${variant === 'light' ? 'text-cream' : 'text-ink'}`}>
      <span className="font-serif text-2xl font-semibold tracking-wide">Miskhane</span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-gold">Toptan</span>
    </span>
  )
}
