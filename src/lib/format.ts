import type { Product } from '@/payload-types'

/** Katalogdaki gibi biçimlendirir: 0,39 $ · 225,00 ₺ */
export function formatPrice(
  price?: number | null,
  currency?: Product['currency'],
): string | null {
  if (price == null) return null
  const symbol = currency === 'TRY' ? '₺' : '$'
  const decimals = currency === 'TRY' ? 2 : 2
  const text = price.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${text} ${symbol}`
}

export type SpecKind = 'price' | 'units' | 'ml' | 'g' | 'height' | 'width'

export interface SpecCell {
  kind: SpecKind
  /** Katalogdaki sütun başlığı */
  label: string
  value: string
}

/**
 * Katalogdaki teknik özellik tablosunun sütunlarını üretir.
 * Katalog düzeni: FİYAT · KOLİ İÇİ ADET · ml · g · mm (yükseklik) · mm (genişlik)
 * Değeri olmayan sütunlar atlanır.
 */
export function specCells(product: Product): SpecCell[] {
  const cells: SpecCell[] = []
  const price = formatPrice(product.price, product.currency)
  if (price) cells.push({ kind: 'price', label: 'Fiyat', value: price })
  if (product.unitsPerBox != null)
    cells.push({ kind: 'units', label: 'Koli İçi Adet', value: String(product.unitsPerBox) })
  if (product.capacityMl != null)
    cells.push({ kind: 'ml', label: 'ml', value: String(product.capacityMl) })
  if (product.weightG != null) cells.push({ kind: 'g', label: 'g', value: String(product.weightG) })
  if (product.height != null)
    cells.push({ kind: 'height', label: 'mm', value: String(product.height) })
  if (product.width != null) cells.push({ kind: 'width', label: 'mm', value: String(product.width) })
  return cells
}

/**
 * Katalogda basılı olan ürün kodu. Kolonya / buhur / oda kokusu gibi kodsuz
 * ürünlerde null döner — bu ürünler katalogda da kod yerine adıyla listelenir.
 */
export function displayCode(product: Product): string | null {
  return product.catalogCode || null
}
