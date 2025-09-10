# 🚀 Panduan Deployment SIMDAG ke Server Ubuntu

## 📁 File-File Deployment yang Tersedia

Berikut adalah file-file yang telah dibuat untuk memudahkan proses deployment:

### 📋 Dokumentasi
- **`PANDUAN_HOSTING_UBUNTU.md`** - Panduan lengkap step-by-step deployment
- **`CHECKLIST_DEPLOYMENT.md`** - Checklist yang bisa dicentang satu per satu
- **`README_DEPLOYMENT.md`** - File ini, penjelasan semua file deployment

### 🔧 Script Otomatis
- **`deploy-to-server.bat`** - Script Windows untuk build dan package aplikasi
- **`server-setup.sh`** - Script Ubuntu untuk setup server otomatis

### ⚙️ File Konfigurasi
- **`Backend/.env.production`** - Template environment variables untuk production
- **`nginx-simdag.conf`** - Konfigurasi Nginx siap pakai

## 🎯 Informasi Server dari Boss

```
Server Ubuntu:
- IP: 10.10.11.149
- Username: bowo
- Password: Bowo@123

HestiaCP Panel:
- URL: https://10.10.11.149:8083
- Username: Bowo
- Password: Bowo@123
- FQDN: nodejs.hestia.lokal
- Hostname: node.js
```

## 🚀 Quick Start (Cara Tercepat)

### 1. Persiapan Lokal
```bash
# Jalankan script deployment
deploy-to-server.bat
```

### 2. Upload ke Server
**Pilih salah satu:**

**A. Menggunakan WinSCP (Recommended)**
- Download: https://winscp.net/
- Host: `10.10.11.149`, User: `bowo`, Pass: `Bowo@123`
- Upload folder `deployment-package` ke `/home/bowo/`

**B. Menggunakan HestiaCP**
- Login: https://10.10.11.149:8083
- File Manager → Upload files

### 3. Setup Server
```bash
# SSH ke server
ssh bowo@10.10.11.149

# Upload script setup
# (upload server-setup.sh ke /home/bowo/)

# Jalankan setup otomatis
chmod +x server-setup.sh
./server-setup.sh
```

### 4. Test Website
- Frontend: http://10.10.11.149
- Admin: http://10.10.11.149/admin
- API: http://10.10.11.149/api

## 📖 Panduan Detail

Jika quick start tidak berhasil atau ingin memahami prosesnya:

1. **Baca**: `PANDUAN_HOSTING_UBUNTU.md` untuk penjelasan lengkap
2. **Ikuti**: `CHECKLIST_DEPLOYMENT.md` step by step

## 🔧 Manual Setup (Jika Script Gagal)

### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y
```

### Setup Database
```bash
sudo -u postgres psql
CREATE DATABASE simdag_db;
CREATE USER simdag_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE simdag_db TO simdag_user;
\q
```

### Setup Backend
```bash
cd /home/bowo/deployment-package/backend
npm install --production
cp .env.production .env
nano .env  # Edit database credentials
npm run build
pm2 start dist/main.js --name "simdag-backend"
pm2 save
```

### Setup Nginx
```bash
# Copy konfigurasi
sudo cp /home/bowo/nginx-simdag.conf /etc/nginx/sites-available/simdag
sudo ln -s /etc/nginx/sites-available/simdag /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 Monitoring & Troubleshooting

### Check Status
```bash
# Backend
pm2 status
pm2 logs simdag-backend

# Nginx
sudo systemctl status nginx
sudo nginx -t

# Database
sudo systemctl status postgresql
```

### Common Issues

**Website tidak bisa diakses:**
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80/tcp

# Check nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

**Backend error:**
```bash
# Check PM2
pm2 logs simdag-backend

# Restart backend
pm2 restart simdag-backend

# Check environment
cat /home/bowo/deployment-package/backend/.env
```

**Database error:**
```bash
# Test connection
psql -U simdag_user -d simdag_db -c "SELECT 1;"

# Check PostgreSQL
sudo systemctl status postgresql
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📁 Struktur File Setelah Deployment

```
/home/bowo/
├── deployment-package/
│   ├── frontend/          # Built React app
│   │   ├── index.html
│   │   ├── assets/
│   │   └── ...
│   └── backend/           # Node.js backend
│       ├── dist/          # Compiled TypeScript
│       ├── uploads/       # File uploads
│       ├── .env           # Environment variables
│       ├── package.json
│       └── ...
├── server-setup.sh        # Setup script
└── nginx-simdag.conf      # Nginx config
```

## 🔐 Security Checklist

- [ ] Ganti password default
- [ ] Setup firewall (UFW)
- [ ] Update system secara berkala
- [ ] Backup database rutin
- [ ] Monitor log files
- [ ] Setup SSL certificate (optional)

## 📞 Bantuan

**Jika mengalami masalah:**

1. **Check log files:**
   ```bash
   pm2 logs simdag-backend
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Screenshot error message**

3. **Hubungi tim development dengan informasi:**
   - Error message
   - Log files
   - Langkah yang sudah dilakukan

## 🎉 Selesai!

Setelah deployment berhasil, website SIMDAG akan dapat diakses di:

- **Website Utama**: http://10.10.11.149
- **Admin Panel**: http://10.10.11.149/admin
- **API Endpoint**: http://10.10.11.149/api
- **HestiaCP**: https://10.10.11.149:8083

---

**Tips:**
- Simpan semua password dengan aman
- Lakukan backup rutin
- Monitor resource usage server
- Update aplikasi secara berkala