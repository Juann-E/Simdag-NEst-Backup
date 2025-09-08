# Panduan Deployment Website SIMDAG ke Netlify

Panduan lengkap untuk menghost website SIMDAG di Netlify untuk pemula.

## 📋 Persiapan Sebelum Deployment

### 1. Pastikan Project Berjalan Lokal
Sebelum deploy, pastikan website berjalan dengan baik di komputer Anda:
```bash
cd Frontend
npm run dev
```
Buka http://localhost:5173 dan pastikan semua fitur berfungsi.

### 2. Buat Akun GitHub (Jika Belum Ada)
1. Kunjungi https://github.com
2. Klik "Sign up" dan buat akun baru
3. Verifikasi email Anda

### 3. Upload Project ke GitHub

#### Cara 1: Menggunakan GitHub Desktop (Mudah untuk Pemula)
1. Download dan install GitHub Desktop dari https://desktop.github.com
2. Login dengan akun GitHub Anda
3. Klik "Add an Existing Repository from your Hard Drive"
4. Pilih folder project SIMDAG Anda
5. Klik "Create Repository on GitHub.com"
6. Beri nama repository (contoh: `simdag-website`)
7. Pastikan repository bersifat **Public**
8. Klik "Publish Repository"

#### Cara 2: Menggunakan Command Line
```bash
# Di folder root project SIMDAG
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/simdag-website.git
git push -u origin main
```

## 🚀 Deployment ke Netlify

### Langkah 1: Buat Akun Netlify
1. Kunjungi https://netlify.com
2. Klik "Sign up" 
3. Pilih "Sign up with GitHub" untuk kemudahan
4. Authorize Netlify untuk mengakses GitHub Anda

### Langkah 2: Deploy dari GitHub
1. Di dashboard Netlify, klik "Add new site"
2. Pilih "Import an existing project"
3. Pilih "Deploy with GitHub"
4. Cari dan pilih repository `simdag-website` Anda
5. Konfigurasi build settings:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`

### Langkah 3: Konfigurasi Environment Variables
1. Setelah deploy pertama, masuk ke **Site settings**
2. Pilih **Environment variables**
3. Tambahkan variabel berikut:
   - `VITE_API_BASE_URL`: `https://your-backend-url.com` (ganti dengan URL backend Anda)

### Langkah 4: Konfigurasi Custom Domain (Opsional)
1. Di Site settings, pilih **Domain management**
2. Klik **Add custom domain**
3. Masukkan domain Anda (contoh: `simdag.yourdomain.com`)
4. Ikuti instruksi untuk mengatur DNS

## 📁 File Konfigurasi yang Diperlukan

### 1. File `_redirects` (Untuk React Router)
Buat file `_redirects` di folder `Frontend/public/`:
```
/*    /index.html   200
```

### 2. File `netlify.toml` (Opsional)
Buat file `netlify.toml` di root project:
```toml
[build]
  base = "Frontend"
  command = "npm run build"
  publish = "Frontend/dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Mengatasi Masalah Umum

### 1. Build Gagal
**Masalah**: Error saat build di Netlify
**Solusi**:
- Pastikan `package.json` ada di folder `Frontend`
- Cek apakah semua dependencies terinstall
- Periksa error log di Netlify dashboard

### 2. API Tidak Berfungsi
**Masalah**: Frontend tidak bisa connect ke backend
**Solusi**:
- Pastikan backend sudah di-deploy (lihat bagian Backend Hosting)
- Update environment variable `VITE_API_BASE_URL`
- Periksa CORS settings di backend

### 3. Routing Tidak Berfungsi
**Masalah**: Error 404 saat refresh halaman
**Solusi**:
- Pastikan file `_redirects` sudah dibuat
- Atau gunakan konfigurasi di `netlify.toml`

## 🖥️ Backend Hosting (Diperlukan untuk Fungsi Penuh)

Karena SIMDAG memerlukan backend, Anda perlu menghost backend juga:

### Opsi 1: Railway (Gratis dengan Batasan)
1. Kunjungi https://railway.app
2. Sign up dengan GitHub
3. Klik "New Project" → "Deploy from GitHub repo"
4. Pilih repository yang sama, tapi set:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`

### Opsi 2: Heroku (Berbayar)
1. Buat akun di https://heroku.com
2. Install Heroku CLI
3. Deploy backend ke Heroku

### Opsi 3: VPS (Lebih Advanced)
- Gunakan VPS seperti DigitalOcean, Linode, atau AWS EC2
- Install Node.js dan database
- Deploy manual atau gunakan Docker

## 📝 Checklist Deployment

- [ ] Project berjalan lokal tanpa error
- [ ] Repository sudah di GitHub
- [ ] Akun Netlify sudah dibuat
- [ ] Build settings sudah dikonfigurasi
- [ ] File `_redirects` sudah dibuat
- [ ] Environment variables sudah diset
- [ ] Backend sudah di-deploy (jika diperlukan)
- [ ] Website dapat diakses dan berfungsi

## 🔄 Update Website

Setelah deployment awal, untuk update website:
1. Lakukan perubahan di kode lokal
2. Push ke GitHub:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```
3. Netlify akan otomatis rebuild dan deploy

## 📞 Bantuan Tambahan

Jika mengalami kesulitan:
1. Cek dokumentasi Netlify: https://docs.netlify.com
2. Lihat error logs di Netlify dashboard
3. Pastikan semua file konfigurasi sudah benar
4. Test lokal terlebih dahulu sebelum deploy

---

**Catatan Penting**: 
- Website akan berfungsi penuh hanya jika backend juga sudah di-deploy
- Untuk demo/preview, Anda bisa deploy frontend saja terlebih dahulu
- Pastikan tidak ada informasi sensitif (password, API keys) yang ter-commit ke GitHub

**Selamat mencoba! 🎉**