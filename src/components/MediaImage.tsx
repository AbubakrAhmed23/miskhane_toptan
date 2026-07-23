import Image from 'next/image'

import type { Media } from '@/payload-types'
import { mediaAlt, mediaUrl, type SizeKey } from '@/lib/media'

interface Props {
  media?: number | Media | null
  size?: SizeKey
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
}

export function MediaImage({
  media,
  size = 'card',
  alt,
  fill = true,
  width,
  height,
  className,
  sizes,
  priority,
}: Props) {
  const url = mediaUrl(media, size)
  const label = alt || mediaAlt(media, 'Miskhane ürün görseli')

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-soft text-muted ${className ?? ''}`}>
        <span className="font-serif text-sm">Görsel yok</span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={url}
        alt={label}
        fill
        className={className}
        sizes={sizes ?? '(max-width: 768px) 100vw, 400px'}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={label}
      width={width ?? 600}
      height={height ?? 600}
      className={className}
      priority={priority}
    />
  )
}
