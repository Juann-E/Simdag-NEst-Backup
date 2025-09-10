# ✅ Checklist Deployment SIMDAG ke Server Ubuntu

## 📋 Persiapan Lokal

- [ ] **Build Frontend**
  ```bash
  cd Frontend
  npm run build
  ```
  ✅ Hasil: Folder `dist` terbuat di Frontend

- [ ] **Build Backend**
  ```bash
  cd Backend
  npm run build
  ```
  ✅ Hasil: Folder `dist` terbuat di Backend

- [ ] **Jalankan Script Deployment**
  ```bash
  deploy-to-server.bat
  ```
  ✅ Hasil: Folder `deployment-package` terbuat

## 🌐 Akses Server

- [ ] **Test Koneksi SSH**
  ```bash
  ssh bowo@10.10.11.149
  # Password: Bowo@123
  ```
  ✅ Berhasil login ke server

- [ ] **Test Akses HestiaCP**
  - URL: `https://10.10.11.149:8083`
  - Username: `Bowo`
  - Password: `Bowo@123`
  ✅ Berhasil login ke panel

## 📤 Upload Files

**Pilih salah satu metode:**

### Metode A: WinSCP (Recommended)
- [ ] Download WinSCP dari https://winscp.net/
- [ ] Koneksi ke server:
  - Host: `10.10.11.149`
  - Username: `bowo`
  - Password: `Bowo@123`
- [ ] Upload folder `deployment-package` ke `/home/bowo/`

### Metode B: HestiaCP File Manager
- [ ] Login ke HestiaCP
- [ ] Buka File Manager
- [ ] Upload files melalui web interface

### Metode C: SCP Command
- [ ] Jalankan command:
  ```bash
  scp -r deployment-package bowo@10.10.11.149:/home/bowo/
  ```

## ⚙️ Setup Server

- [ ] **Upload Script Setup**
  ```bash
  scp server-setup.sh bowo@10.10.11.149:/home/bowo/
  ```

- [ ] **Jalankan Script Setup**
  ```bash
  ssh bowo@10.10.11.149
  chmod +x server-setup.sh
  ./server-setup.sh
  ```
  ✅ Script berjalan tanpa error

- [ ] **Verifikasi Database**
  - Database name: `simdag_db`
  - Username: `simdag_user`
  - Password: (yang diinput saat setup)

## 🔧 Manual Setup (Jika Script Gagal)

### Install Dependencies
- [ ] **Update System**
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

- [ ] **Install Node.js**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

- [ ] **Install PM2**
  ```bash
  sudo npm install -g pm2
  ```

- [ ] **Install PostgreSQL**
  ```bash
  sudo apt install postgresql postgresql-contrib -y
  ```

- [ ] **Install Nginx**
  ```bash
  sudo apt install nginx -y
  ```

### Setup Database
- [ ] **Create Database**
  ```bash
  sudo -u postgres psql
  CREATE DATABASE simdag_db;
  CREATE USER simdag_user WITH PASSWORD 'your_password';
  GRANT ALL PRIVILEGES ON DATABASE simdag_db TO simdag_user;
  \q
  ```

- [ ] **Import Database**
  ```bash
  psql -U simdag_user -d simdag_db -f "Data Gambaran/Simdag_Main_db.sql"
  ```

### Setup Backend
- [ ] **Install Dependencies**
  ```bash
  cd /home/bowo/deployment-package/backend
  npm install --production
  ```

- [ ] **Setup Environment**
  ```bash
  cp .env.production .env
  nano .env  # Edit database credentials
  ```

- [ ] **Build & Start**
  ```bash
  npm run build
  pm2 start dist/main.js --name "simdag-backend"
  pm2 save
  pm2 startup
  ```

### Setup Nginx
- [ ] **Create Site Config**
  ```bash
  sudo nano /etc/nginx/sites-available/simdag
  ```
  (Copy config dari PANDUAN_HOSTING_UBUNTU.md)

- [ ] **Enable Site**
  ```bash
  sudo ln -s /etc/nginx/sites-available/simdag /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```

## 🧪 Testing

- [ ] **Test Backend API**
  ```bash
  curl http://10.10.11.149:3000/api/health
  ```
  ✅ Response: Status OK

- [ ] **Test Frontend**
  - Buka browser: `http://10.10.11.149`
  ✅ Website loading dengan benar

- [ ] **Test Login Admin**
  - URL: `http://10.10.11.149/admin`
  - Test login dengan credentials admin
  ✅ Login berhasil

- [ ] **Test Upload Foto**
  - Masuk ke admin panel
  - Test upload foto tim
  ✅ Upload berhasil

- [ ] **Test Database Connection**
  ```bash
  pm2 logs simdag-backend
  ```
  ✅ Tidak ada error database

## 🔍 Monitoring

- [ ] **Check PM2 Status**
  ```bash
  pm2 status
  pm2 logs simdag-backend
  ```

- [ ] **Check Nginx Status**
  ```bash
  sudo systemctl status nginx
  sudo nginx -t
  ```

- [ ] **Check Database Status**
  ```bash
  sudo systemctl status postgresql
  ```

- [ ] **Check Disk Space**
  ```bash
  df -h
  ```

- [ ] **Check Memory Usage**
  ```bash
  free -h
  htop
  ```

## 🚨 Troubleshooting

### Jika Website Tidak Bisa Diakses
- [ ] Check firewall: `sudo ufw status`
- [ ] Check nginx: `sudo systemctl status nginx`
- [ ] Check nginx config: `sudo nginx -t`
- [ ] Check nginx logs: `sudo tail -f /var/log/nginx/error.log`

### Jika Backend Error
- [ ] Check PM2: `pm2 status`
- [ ] Check logs: `pm2 logs simdag-backend`
- [ ] Check .env file: `cat /home/bowo/deployment-package/backend/.env`
- [ ] Restart backend: `pm2 restart simdag-backend`

### Jika Database Error
- [ ] Check PostgreSQL: `sudo systemctl status postgresql`
- [ ] Check database connection: `psql -U simdag_user -d simdag_db -c "SELECT 1;"`
- [ ] Check database logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`

## ✅ Final Checklist

- [ ] Website accessible: `http://10.10.11.149` ✅
- [ ] Admin panel working: `http://10.10.11.149/admin` ✅
- [ ] API responding: `http://10.10.11.149/api` ✅
- [ ] Database connected ✅
- [ ] File uploads working ✅
- [ ] All services running ✅
- [ ] Firewall configured ✅
- [ ] PM2 auto-startup enabled ✅

## 📞 Kontak Darurat

**Jika ada masalah:**
1. Screenshot error message
2. Copy log files:
   ```bash
   pm2 logs simdag-backend > backend-logs.txt
   sudo tail -100 /var/log/nginx/error.log > nginx-logs.txt
   ```
3. Hubungi tim development dengan informasi error

---

**🎉 Deployment Selesai!**

Website SIMDAG sekarang sudah live di:
- **Frontend**: http://10.10.11.149
- **Admin Panel**: http://10.10.11.149/admin
- **API**: http://10.10.11.149/api