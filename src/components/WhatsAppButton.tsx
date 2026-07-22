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
      className={
        className ??
        'inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 font-medium text-white shadow-soft transition hover:bg-whatsapp-dark'
      }
    >
      <WhatsAppIcon className={iconClassName ?? 'h-5 w-5'} />
      {children ?? 'WhatsApp ile İletişime Geç'}
    </a>
  )
}
