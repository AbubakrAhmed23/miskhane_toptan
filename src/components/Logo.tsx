import Image from 'next/image'

/**
 * Logo işaretindeki altın ton (logo-mark.png) BİLİNÇLİ bir marka istisnasıdır;
 * site paletine (navy/cream/sage/terracotta) dahil değildir ve terracotta'ya
 * çevrilmemelidir. Tasarım sisteminde `--color-logo-accent` olarak tanımlıdır.
 */

export function Logo({
  showWordmark = true,
  markSize = 44,
  onDark = false,
}: {
  showWordmark?: boolean
  markSize?: number
  onDark?: boolean
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/brand/logo-mark.png"
        alt="Miskhane logosu"
        width={markSize}
        height={markSize}
        className="object-contain"
        style={{ height: markSize, width: markSize }}
        priority
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-serif text-xl font-bold tracking-[0.14em] ${
              onDark ? 'text-white' : 'text-navy'
            }`}
          >
            MİSKHANE
          </span>
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.5em] text-accent-text">
            Toptan
          </span>
        </span>
      )}
    </span>
  )
}
