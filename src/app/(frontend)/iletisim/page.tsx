import type { Metadata } from 'next'

import { WhatsAppButton } from '@/components/WhatsAppButton'
import { MailIcon, PhoneIcon, PinIcon } from '@/components/icons'
import { getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Miskhane Toptan ile iletişime geçin. WhatsApp, telefon ve e-posta.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8">
      <header className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">İletişim</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Bize Ulaşın
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Fiyat, numune ve toptan siparişleriniz için en hızlı yol WhatsApp. Aşağıdaki kanallardan
          da bize ulaşabilirsiniz.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6">
            <h2 className="font-serif text-xl font-semibold text-ink">WhatsApp Destek Hattı</h2>
            <p className="mt-1 text-sm text-muted">Mesajınıza en kısa sürede yanıt veriyoruz.</p>
            <div className="mt-4">
              <WhatsAppButton
                number={settings?.whatsappNumber}
                message={settings?.whatsappDefaultMessage}
              />
            </div>
          </div>

          <ul className="space-y-4 rounded-2xl border border-line bg-white p-6">
            {settings?.phone && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft text-gold">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Telefon</p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="font-medium text-ink hover:text-gold"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-soft text-gold">
                  <MailIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">E-posta</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-medium text-ink hover:text-gold"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft text-gold">
                  <PinIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Adres</p>
                  <p className="whitespace-pre-line font-medium text-ink">{settings.address}</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        {settings?.mapEmbedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              src={settings.mapEmbedUrl}
              title="Harita"
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-line bg-white p-6 text-center text-muted">
            Harita, yönetim panelinden “Google Harita Embed Bağlantısı” eklendiğinde burada
            görünecektir.
          </div>
        )}
      </div>
    </div>
  )
}
