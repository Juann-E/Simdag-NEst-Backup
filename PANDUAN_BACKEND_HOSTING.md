# Panduan Hosting Backend SIMDAG

Panduan untuk menghost backend API SIMDAG agar frontend dapat berfungsi penuh.

## 🎯 Pilihan Platform Hosting Backend

### 1. Railway (Recommended - Gratis dengan Batasan)
**Kelebihan**: Mudah setup, gratis $5/bulan credit, auto-deploy dari GitHub
**Kekurangan**: Batasan usage, perlu kartu kredit untuk verifikasi

### 2. Render (Gratis dengan Batasan)
**Kelebihan**: Benar-benar gratis, tidak perlu kartu kredit
**Kekurangan**: Sleep mode setelah 15 menit tidak aktif, startup lambat

### 3. Heroku (Berbayar)
**Kelebihan**: Stabil, banyak add-ons
**Kekurangan**: Tidak ada tier gratis lagi

## 🚀 Deployment ke Railway (Recommended)

### Langkah 1: Persiapan
1. Pastikan backend berjalan lokal:
   ```bash
   cd Backend
   npm install
   npm run start:dev
   ```
2. Test di http://localhost:3000

### Langkah 2: Setup Railway
1. Kunjungi https://railway.app
2. Sign up dengan GitHub
3. Klik "New Project"
4. Pilih "Deploy from GitHub repo"
5. Pilih repository SIMDAG Anda
6. Pilih "Backend" sebagai root directory

### Langkah 3: Konfigurasi Environment
1. Di Railway dashboard, masuk ke project Anda
2. Klik tab "Variables"
3. Tambahkan environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here
   AES_KEY=your-32-character-aes-key-here
   DATABASE_URL=your-database-connection-string
   ```

### Langkah 4: Setup Database
1. Di Railway, klik "New" → "Database" → "PostgreSQL"
2. Copy connection string yang diberikan
3. Paste ke environment variable `DATABASE_URL`

### Langkah 5: Deploy
1. Railway akan otomatis build dan deploy
2. Tunggu hingga status menjadi "Active"
3. Copy URL yang diberikan (contoh: `https://backend-production-xxxx.up.railway.app`)

## 🔧 Deployment ke Render (Alternatif Gratis)

### Langkah 1: Setup Render
1. Kunjungi https://render.com
2. Sign up dengan GitHub
3. Klik "New" → "Web Service"
4. Connect repository SIMDAG

### Langkah 2: Konfigurasi Build
- **Name**: `simdag-backend`
- **Root Directory**: `Backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### Langkah 3: Environment Variables
Tambahkan di Render dashboard:
```
NODE_ENV=production
JWT_SECRET=your-jwt-secret
AES_KEY=your-aes-key
DATABASE_URL=your-database-url
```

### Langkah 4: Database Setup
1. Buat PostgreSQL database di Render
2. Copy connection string
3. Update `DATABASE_URL` environment variable

## 🗄️ Setup Database

### Opsi 1: Railway PostgreSQL
1. Di Railway project, tambah PostgreSQL service
2. Otomatis mendapat connection string
3. Import schema dari file `Simdag_Main_db.sql`

### Opsi 2: Supabase (Gratis)
1. Kunjungi https://supabase.com
2. Buat project baru
3. Di SQL Editor, import schema database
4. Copy connection string dari Settings → Database

### Opsi 3: PlanetScale (Gratis)
1. Kunjungi https://planetscale.com
2. Buat database baru
3. Setup connection string
4. Import schema

## 📝 File Konfigurasi Backend

### 1. Update package.json
Pastikan ada script untuk production:
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "start:dev": "nest start --watch"
  }
}
```

### 2. Update main.ts untuk CORS
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:5173', // Development
      'https://your-netlify-site.netlify.app', // Production
      'https://your-custom-domain.com' // Custom domain
    ],
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
```

## 🔗 Menghubungkan Frontend ke Backend

### 1. Update Environment Variable di Netlify
1. Masuk ke Netlify dashboard
2. Pilih site SIMDAG Anda
3. Site settings → Environment variables
4. Update `VITE_API_BASE_URL` dengan URL backend:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```

### 2. Redeploy Frontend
Setelah update environment variable, trigger redeploy di Netlify.

## 🧪 Testing Deployment

### 1. Test Backend
```bash
# Test health check
curl https://your-backend-url.railway.app/

# Test API endpoint
curl https://your-backend-url.railway.app/public/markets
```

### 2. Test Frontend
1. Buka website Netlify Anda
2. Coba fitur yang memerlukan API (login, data pasar, dll)
3. Check browser console untuk error

## 🚨 Troubleshooting

### Backend Tidak Bisa Diakses
1. **Check logs** di platform hosting
2. **Verify environment variables** sudah benar
3. **Check database connection** string
4. **Verify CORS settings** untuk domain frontend

### Database Connection Error
1. **Check DATABASE_URL** format
2. **Verify database** sudah dibuat
3. **Import schema** jika belum
4. **Check firewall** settings database

### Frontend Tidak Bisa Connect
1. **Check VITE_API_BASE_URL** di Netlify
2. **Verify CORS** di backend
3. **Check network tab** di browser developer tools
4. **Test API** langsung dengan curl/Postman

## 💰 Estimasi Biaya

### Gratis (dengan Batasan)
- **Railway**: $5 credit/bulan (cukup untuk small app)
- **Render**: Gratis dengan sleep mode
- **Supabase**: 500MB database gratis

### Berbayar
- **Railway**: $5-20/bulan
- **Heroku**: $7-25/bulan
- **PlanetScale**: $29/bulan untuk production

## 📋 Checklist Deployment Backend

- [ ] Backend berjalan lokal tanpa error
- [ ] Repository sudah di GitHub
- [ ] Platform hosting dipilih (Railway/Render)
- [ ] Environment variables dikonfigurasi
- [ ] Database setup dan schema imported
- [ ] CORS dikonfigurasi untuk frontend domain
- [ ] Backend URL dapat diakses
- [ ] API endpoints berfungsi
- [ ] Frontend environment variable diupdate
- [ ] End-to-end testing berhasil

---

**Tips**: 
- Mulai dengan Railway atau Render untuk kemudahan
- Selalu test lokal sebelum deploy
- Simpan backup database secara berkala
- Monitor usage untuk menghindari overage charges