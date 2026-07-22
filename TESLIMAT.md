# Miskhane Toptan — Kurulum, Yönetim ve Yayın Rehberi

Toptan parfüm ambalajı katalog sitesi. **Next.js 16 + Payload CMS 3** ile tek uygulama:
hem müşteriye açık site, hem `/admin` yönetim paneli.

- Diller: Türkçe
- Fiyat gösterilmez → tüm iletişim WhatsApp üzerinden
- Katalog herkese açık (SEO uyumlu)

---

## 1. Yerel Çalıştırma

```bash
npm install
cp .env.example .env      # ilk kez; içindeki değerleri düzenleyin
npm run dev               # http://localhost:3000
```

- Site: http://localhost:3000
- Yönetim paneli: http://localhost:3000/admin

**Not:** Yerel geliştirmede veritabanı SQLite dosyasıdır (`miskhane.db`), görseller
yerel `media/` klasörüne yüklenir. Üretimde Postgres + bulut deposu kullanılır (bkz. Bölüm 4).

### Örnek veriyi yükleme (ilk kurulum)
`source-assets/urunler/` klasöründeki görsellerden 5 kategori + ürünleri oluşturur:

```bash
npm run seed
```

İlk çalıştırmada bir admin kullanıcı oluşturur:
`admin@miskhane.com` / `Miskhane2026!` — **giriş yaptıktan sonra şifreyi mutlaka değiştirin.**
(Farklı bilgi için `SEED_ADMIN_EMAIL` ve `SEED_ADMIN_PASSWORD` env değişkenlerini kullanın.)

---

## 2. Yönetim Paneli (Web Sorumlusu İçin)

`/admin` adresinden giriş yapılır. Panel tamamen Türkçedir.

| Bölüm | Ne işe yarar |
|---|---|
| **Ürünler** | Ürün ekleme/düzenleme: kod, ad, kategori, görseller, teknik özellikler |
| **Kategoriler** | Kategori adı, görseli, sırası |
| **Görseller** | Yüklenen tüm görseller (otomatik küçültülüp WebP'ye çevrilir) |
| **Site Ayarları** | WhatsApp no, telefon, adres, logo, ana sayfa metinleri, sosyal medya |
| **Yöneticiler** | Panel giriş hesapları |

### Yeni ürün ekleme
1. **Ürünler → Yeni** tıklayın.
2. **Ürün Kodu** (örn. `MHK-200`) ve **Ürün Adı** girin.
3. **Görseller** bölümüne bir veya birkaç fotoğraf yükleyin (ilki kapak görseli olur).
4. **Kategori** seçin (sağ kenar çubuğu).
5. İsteğe bağlı **Teknik Özellikler**: hacim, yükseklik, min. alım vb.
6. **Kaydet**. Ürün sitede anında görünür. (URL adresi koddan otomatik oluşur.)

> Fiyat alanı yoktur — bu bilinçli bir tercihtir. Müşteri fiyatı ürün sayfasındaki
> WhatsApp butonundan sorar; mesaj ürün koduyla otomatik hazırlanır.

### WhatsApp numarasını ayarlama
**Site Ayarları → İletişim → WhatsApp Numarası**: başında `+` olmadan, ülke koduyla,
sadece rakam. Örn. `905321234567`. Bu numara sitedeki tüm WhatsApp butonlarında kullanılır.

---

## 3. Görseller Hakkında
- Yüklenen görseller otomatik olarak **WebP**'ye çevrilip 3 boyutta (küçük/kart/büyük)
  üretilir. Büyük PNG'ler bile mobilde hızlı açılır.
- En iyi sonuç için ürünleri **beyaz/nötr zeminde** ve kare/dikey oranda yükleyin.

---

## 4. Yayına Alma (Üretim)

Kod tamamen taşınabilir. Önerilen yönetilen kurulum: **Vercel + Neon (Postgres) + Cloudflare R2**.

### 4.1 Veritabanı — Neon (Postgres)
1. [neon.tech](https://neon.tech) üzerinde ücretsiz proje açın.
2. Bağlantı adresini alın ve `DATABASE_URI` olarak verin:
   ```
   DATABASE_URI=postgres://kullanici:sifre@host/veritabani?sslmode=require
   ```
   Uygulama `postgres://` ile başlayan adreste otomatik olarak Postgres'e geçer.

### 4.2 Görsel Deposu — Cloudflare R2
1. Cloudflare R2'de bir bucket oluşturun (örn. `miskhane-media`) ve API anahtarı üretin.
2. Şu env değişkenlerini doldurun (dolunca görseller diske değil buluta yüklenir):
   ```
   S3_BUCKET=miskhane-media
   S3_ENDPOINT=https://<hesap-id>.r2.cloudflarestorage.com
   S3_REGION=auto
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=...
   ```

### 4.3 Vercel'e Deploy
1. Kodu bir GitHub deposuna gönderin, Vercel'de içe aktarın.
2. Yukarıdaki tüm env değişkenlerini + `PAYLOAD_SECRET` (uzun rastgele dize) +
   `NEXT_PUBLIC_SERVER_URL=https://alanadiniz` ekleyin.
3. Deploy edin. İlk açılışta `/admin`'den yönetici hesabı oluşturun.
4. Alan adı: `toptan.miskhane.com` alt alan adı önerilir (DNS'te CNAME).

> **Not:** Vercel Hobby planı ticari kullanıma kapalıdır; ticari site için **Vercel Pro** gerekir.

### 4.4 Yayına ilk veri aktarımı
Üretim veritabanı boşsa, kategorileri ve örnek ürünleri panelden elle ekleyebilir
veya `source-assets/urunler/` görselleriyle sunucuda `npm run seed` çalıştırabilirsiniz.

---

## 5. Faydalı Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Üretim derlemesi / çalıştırma |
| `npm run seed` | Örnek kategori + ürünleri yükler |
| `npm run generate:types` | Veri modeli değişince TypeScript tiplerini günceller |

---

## 6. Teknik Özet
- **Framework:** Next.js 16 (App Router, Turbopack)
- **CMS/Admin:** Payload CMS 3 (`/admin`)
- **Veritabanı:** SQLite (yerel) / Postgres (üretim) — `DATABASE_URI` ile otomatik seçim
- **Görsel deposu:** Yerel disk / Cloudflare R2 — S3 env'leri dolunca otomatik geçiş
- **Stil:** Tailwind CSS v4
- **SEO:** `sitemap.xml`, `robots.txt`, ürün yapılandırılmış verisi (JSON-LD), Türkçe meta

Kaynak kodda önemli yerler:
- Veri modeli: `src/collections/*`, `src/globals/Settings.ts`
- Sayfalar: `src/app/(frontend)/*`
- Bileşenler: `src/components/*`
- Veri sorguları: `src/lib/queries.ts`
