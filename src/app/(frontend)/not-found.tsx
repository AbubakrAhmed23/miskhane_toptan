import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
      <span className="gold-text font-serif text-7xl font-semibold">404</span>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-espresso sm:text-3xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-2 text-muted">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
      <Link
        href="/"
        className="btn-gold mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold shadow-soft"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}
