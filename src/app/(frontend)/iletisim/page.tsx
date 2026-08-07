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
    <div className="mx-auto w-full max-w-5xl section-y px-5 sm:px-8">
      <header className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-text">İletişim</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-espresso sm:text-5xl">
          Bize Ulaşın
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Fiyat, numune ve toptan siparişleriniz için en hızlı yol WhatsApp. Aşağıdaki kanallardan
          da bize ulaşabilirsiniz.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber/30 bg-amber/10 p-6">
            <h2 className="font-serif text-xl font-semibold text-espresso">WhatsApp Destek Hattı</h2>
            <p className="mt-1 text-sm text-muted">Mesajınıza en kısa sürede yanıt veriyoruz.</p>
            <div className="mt-4">
              <WhatsAppButton
                number={settings?.whatsappNumber}
                message={settings?.whatsappDefaultMessage}
              />
            </div>
          </div>

          <ul className="space-y-4 rounded-2xl border border-clay/35 bg-white p-6">
            {settings?.phone && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-accent-text">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Telefon</p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="font-medium text-espresso hover:text-accent-text"
                  >
                    {settings.phone}
                  </a>
                </div>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-accent-text">
                  <MailIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">E-posta</p>
                  <a
                    href={`mailto:${settings.email}`}
                    className="font-medium text-espresso hover:text-accent-text"
                  >
                    {settings.email}
                  </a>
                </div>
              </li>
            )}
            {settings?.address && (
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-accent-text">
                  <PinIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">Adres</p>
                  <p className="whitespace-pre-line font-medium text-espresso">{settings.address}</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        {settings?.mapEmbedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-clay/35">
            <iframe
              src={settings.mapEmbedUrl}
              title="Harita"
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-clay bg-white p-6 text-center text-muted">
            Harita, yönetim panelinden “Google Harita Embed Bağlantısı” eklendiğinde burada
            görünecektir.
          </div>
        )}
      </div>
    </div>
  )
}
