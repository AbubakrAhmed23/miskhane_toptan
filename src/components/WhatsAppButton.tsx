import type { ReactNode } from 'react'

import { waLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from './icons'

interface Props {
  number?: string | null
  message?: string | null
  children?: ReactNode
  className?: string
  iconClassName?: string
}

export function WhatsAppButton({ number, message, children, className, iconClassName }: Props) {
  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      /* Varsayılan: markanın altın CTA'sı. Aynı eylem (WhatsApp) sitenin her
         yerinde aynı renkte görünsün diye WhatsApp yeşili yerine --color-gold. */
      className={className ?? 'btn btn-gold shadow-soft'}
    >
      <WhatsAppIcon className={iconClassName ?? 'h-5 w-5'} />
      {children ?? 'WhatsApp ile İletişime Geç'}
    </a>
  )
}
