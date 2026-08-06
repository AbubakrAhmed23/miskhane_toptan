import type { Setting } from '@/payload-types'
import { waLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from './icons'

export function WhatsAppFloat({ settings }: { settings: Setting | null }) {
  const href = waLink(settings?.whatsappNumber, settings?.whatsappDefaultMessage)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="wa-pulse fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg ring-4 ring-whatsapp/20 transition hover:scale-105 hover:bg-whatsapp-dark"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
