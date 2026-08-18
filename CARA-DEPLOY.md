# Cara Deploy SIPADU (Versi Groq)

Aplikasi ini punya 2 bagian:
- `index.html` — tampilan yang dibuka staf lewat browser (memakai pdf.js untuk membaca teks dari PDF langsung di browser)
- `api/groq.js` — "petugas" di server yang menyimpan API key dengan aman dan meneruskan permintaan ke Groq

## ⚠️ Keterbatasan penting versi Groq

Groq tidak bisa "melihat" dokumen seperti Anthropic — dia hanya menerima teks. Jadi:
- ✅ **PDF digital** (dibuat dari Word, dokumen elektronik, dsb) — teksnya diekstrak otomatis di browser, lalu dikirim ke AI. Ini akan bekerja baik.
- ❌ **PDF hasil scan/foto surat kertas** — karena isinya berupa gambar, bukan teks, tidak akan terbaca sama sekali. Aplikasi akan memberi peringatan kalau ini terjadi.
- Untuk kasus scan, solusinya nanti: pakai tab "Tempel Teks" (ketik manual), atau tambah OCR terpisah sebagai pengembangan lanjutan.

## Langkah 1 — Siapkan API Key Groq

1. Buka https://console.groq.com, login dengan akun yang sudah ada
2. Masuk ke menu **API Keys**, klik **Create API Key**, beri nama (misal "sipadu")
3. Salin key yang muncul — simpan baik-baik, biasanya cuma ditampilkan sekali

## Langkah 2 — Deploy ke Vercel

1. Buat akun di https://vercel.com (bisa pakai akun Google/GitHub), kalau belum
2. Upload folder ini ke GitHub:
   - Buat repository baru di https://github.com/new
   - Upload semua isi folder ini ke repository tersebut
3. Di Vercel, klik **Add New > Project**, pilih repository GitHub tadi, klik **Import**
4. Sebelum klik "Deploy", buka bagian **Environment Variables**:
   - Name: `GROQ_API_KEY`
   - Value: (tempel API key dari Langkah 1)
5. Klik **Deploy**. Tunggu sampai selesai
6. Link project bisa dilihat dari dashboard Vercel setelah deploy selesai (klik project-nya, domain tertera di bagian atas)

## Kalau Sudah Terlanjur Deploy dengan Environment Variable yang Salah

1. Buka project di dashboard Vercel → tab **Settings** → **Environment Variables**
2. Hapus/ganti variable lama, tambahkan `GROQ_API_KEY` dengan value yang benar
3. Masuk ke tab **Deployments** → klik titik tiga pada deployment teratas → **Redeploy** (perubahan environment variable butuh redeploy manual, tidak otomatis)

## Kalau Ada Error

- **"GROQ_API_KEY belum diatur di server"** → cek Environment Variables di Vercel, lalu Redeploy
- **Error 401 dari Groq** → API key salah/kadaluarsa
- **"Tidak ada teks yang terbaca" saat upload PDF** → itu tandanya PDF-nya hasil scan/gambar, coba tab "Tempel Teks" sebagai gantinya

## Catatan Keamanan

- Jangan pernah menaruh API key langsung di `index.html` — selalu lewat `api/groq.js`.
- Kalau butuh membatasi siapa saja yang boleh akses, Vercel punya fitur Password Protection di paket berbayar, atau bisa ditambah sistem login sederhana sebagai pengembangan lanjutan.
- Pantau pemakaian biaya di console.groq.com, supaya tidak kebobolan kalau linknya tersebar ke luar.
