# miskhane_toptan

Miskhane Toptan — toptan parfüm ambalajı ve koku ürünleri kataloğu.

Next.js 16 + Payload CMS 3 ile geliştirilmiş, 237 ürünlük B2B katalog sitesi.

## Stack

- **Next.js 16** (App Router) + React 19
- **Payload CMS 3** — SQLite (yerel) / Postgres (üretim), tek `DATABASE_URI` ile seçilir
- **Tailwind CSS 4** — tasarım tokenları `src/app/(frontend)/globals.css` içinde
- Cormorant Garamond (başlık) + Inter (arayüz)

## Kurulum

```bash
npm install
cp .env.example .env      # DATABASE_URI ve PAYLOAD_SECRET doldurun
npm run dev               # http://localhost:3000  ·  panel: /admin
```

## Katalog verisi

Ürünler `src/seed/data/products-manifest.json` dosyasından aktarılır:

```bash
npx tsx src/seed/import-urunler.ts
```

Betik veritabanını sıfırlar, 10 kategoriyi ve 237 ürünü (240 görsel) oluşturur.
Ürün görselleri `media/ürünler/` altında beklenir ve **yeniden kodlanmadan**
orijinal PNG olarak yüklenir (bkz. `src/collections/Media.ts`).

## Tasarım sistemi

Tüm renkler dört tokenden türer; kodda sabit renk kodu bulunmaz:

| Token | Rol |
|---|---|
| `--color-navy` | Koyu bölümler, başlıklar, aktif nav |
| `--color-cream` | Temel açık zemin |
| `--color-amber` | CTA dolgusu, rozet, ikon |
| `--color-clay` | Yalnızca ince ayraç ve pasif durumlar |

`--color-logo-accent` logonun kendi altın tonudur ve bilinçli olarak palet dışında tutulur.

## Notlar

- `media/` ve `source-assets/` klasörleri ile `*.db` dosyaları depoya dahil değildir.
- Kaynak katalog (`yenikatalog1.pdf`, ~427 MB) da depo dışındadır.
