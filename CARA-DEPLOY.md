# Cara Deploy SIPADU (Versi Mandiri)

Aplikasi ini punya 2 bagian:
- `index.html` — tampilan yang dibuka staf lewat browser
- `api/claude.js` — "petugas" di server yang menyimpan API key dengan aman dan meneruskan permintaan ke Anthropic

Karena API key disimpan di server (bukan di `index.html`), staf yang memakai aplikasi ini TIDAK BISA melihat atau mencuri key tersebut.

## Langkah 1 — Siapkan API Key Anthropic

1. Buka https://console.anthropic.com dan buat akun (kalau belum punya)
2. Isi saldo/kredit sesuai kebutuhan (tarif dihitung per pemakaian, bukan langganan bulanan)
3. Masuk ke menu **API Keys**, klik **Create Key**, beri nama (misal "sipadu-produksi")
4. Salin key yang muncul (formatnya `sk-ant-...`) — simpan baik-baik, cuma muncul sekali

## Langkah 2 — Deploy ke Vercel (gratis untuk skala ini)

**Cara paling mudah (tanpa install apa pun):**

1. Buat akun di https://vercel.com (bisa pakai akun Google/GitHub)
2. Upload folder ini ke akun GitHub Anda dulu:
   - Buat repository baru di https://github.com/new (boleh private)
   - Upload semua isi folder ini ke repository tersebut
3. Di Vercel, klik **Add New > Project**, pilih repository GitHub tadi, klik **Import**
4. Sebelum klik "Deploy", buka bagian **Environment Variables**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (tempel API key dari Langkah 1)
5. Klik **Deploy**. Tunggu sampai selesai (biasanya <1 menit)
6. Vercel akan memberi link seperti `https://sipadu-persuratan-xxxx.vercel.app` — inilah link yang dibagikan ke staf

## Langkah 3 — Uji Coba

1. Buka link Vercel tadi dari browser (HP atau laptop, siapa saja bisa akses)
2. Upload contoh PDF surat masuk, klik "Analisis Surat Masuk"
3. Kalau berhasil, lanjut klik "Buat Draf Surat Keluar"

## Kalau Ada Error

- **"ANTHROPIC_API_KEY belum diatur di server"** → cek lagi Environment Variables di Vercel, lalu klik **Redeploy** dari tab Deployments (perubahan environment variable butuh redeploy manual)
- **Error 401 dari Anthropic** → API key salah/kadaluarsa, buat key baru
- **Error 400/insufficient credit** → saldo API di console.anthropic.com habis, isi ulang

## Catatan Keamanan

- Jangan pernah menaruh API key langsung di `index.html` atau file yang bisa diakses browser — selalu lewat `api/claude.js` seperti sudah disiapkan di sini.
- Kalau butuh membatasi siapa saja yang boleh akses (tidak semua orang di internet), Vercel punya fitur **Password Protection** di paket berbayarnya, atau bisa ditambah sistem login sederhana sebagai pengembangan lanjutan.
- Pantau pemakaian biaya di console.anthropic.com > Usage, supaya tidak kebobolan kalau linknya tersebar ke luar.
