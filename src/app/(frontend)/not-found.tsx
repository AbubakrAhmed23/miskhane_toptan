import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <span className="font-serif text-6xl font-semibold text-gold">404</span>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink sm:text-3xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-2 text-muted">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-cream transition hover:bg-espresso"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
