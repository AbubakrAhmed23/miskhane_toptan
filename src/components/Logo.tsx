import Image from 'next/image'

export function Logo({
  showWordmark = true,
  markSize = 44,
}: {
  showWordmark?: boolean
  markSize?: number
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
          <span className="gold-text font-serif text-xl font-semibold tracking-[0.16em]">
            MİSKHANE
          </span>
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.5em] text-cream/60">
            Toptan
          </span>
        </span>
      )}
    </span>
  )
}
