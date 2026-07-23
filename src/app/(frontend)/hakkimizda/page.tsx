import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { WhatsAppButton } from '@/components/WhatsAppButton'
import { CheckIcon } from '@/components/icons'
import { getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Miskhane Toptan — parfüm ambalajında zarafet. Cam şişe, kapak, valf, esans ve difüzör çözümleri.',
}

const VALUES = [
  { title: 'Kalite', text: 'Dayanıklı cam ve özenli işçilik ile uzun ömürlü ürünler.' },
  { title: 'Çeşitlilik', text: 'Farklı hacim, form ve kaplama seçenekleriyle geniş yelpaze.' },
  { title: 'Güven', text: 'Toptan müşterilerimize şeffaf ve hızlı iletişim.' },
]

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Hakkımızda</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          {settings?.siteTitle || 'Miskhane Toptan'}
        </h1>
        <div className="gold-rule mx-auto mt-5 h-px w-24" />
        <p className="mt-5 text-lg text-muted">
          {settings?.tagline || 'Parfüm ambalajında zarafet.'}
        </p>
      </header>

      <div className="mt-12">
        {settings?.aboutText ? (
          <div className="richtext text-lg leading-relaxed text-ink/80">
            <RichText data={settings.aboutText} />
          </div>
        ) : (
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Miskhane olarak, parfüm ve kozmetik sektörüne yönelik toptan cam ambalaj çözümleri
              sunuyoruz. Parfüm şişeleri, kapaklar, valf & yüzük, esans ve difüzör şişelerinde geniş
              bir ürün yelpazesine sahibiz.
            </p>
            <p>
              Markaların ürünlerini en iyi şekilde sunabilmesi için zarif tasarımları kaliteli
              üretimle buluşturuyoruz. Toptan müşterilerimize numune desteği ve rekabetçi fiyatlar
              sağlıyoruz.
            </p>
          </div>
        )}
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border border-line bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
              <CheckIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{v.title}</h3>
            <p className="mt-1 text-sm text-muted">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl border border-line bg-soft px-6 py-14 text-center">
        <h2 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          Bizimle çalışmak ister misiniz?
        </h2>
        <p className="max-w-md text-muted">
          Ürünlerimiz ve toptan şartları hakkında bilgi almak için WhatsApp üzerinden ulaşın.
        </p>
        <WhatsAppButton
          number={settings?.whatsappNumber}
          message={settings?.whatsappDefaultMessage}
        />
      </div>
    </div>
  )
}
