/**
 * Katalogun her ürün sayfasının tepesinde duran altın rozet.
 * Üst satır kategori (küçük), alt satır boyut (büyük) — örn. "PARFÜM ŞİŞELERİ / 50 ML".
 * Boyut yoksa kategori tek başına ve büyük gösterilir.
 */
export function CatalogBadge({ category, size }: { category: string; size?: string | null }) {
  if (!size) {
    return (
      <span className="cat-badge">
        <span className="cat-badge__size">{category.toLocaleUpperCase('tr-TR')}</span>
      </span>
    )
  }
  return (
    <span className="cat-badge">
      <span className="cat-badge__kicker">{category.toLocaleUpperCase('tr-TR')}</span>
      <span className="cat-badge__size">{size.toLocaleUpperCase('tr-TR')}</span>
    </span>
  )
}
