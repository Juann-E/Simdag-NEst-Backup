# Panduan Hosting Website SIMDAG di Ubuntu Server dengan HestiaCP

## Informasi Server yang Diberikan Boss

**Server Details:**
- IP Address: `10.10.11.149`
- OS: Ubuntu
- Username: `bowo`
- Password: `Bowo@123`

**HestiaCP Panel:**
- Username: `Bowo`
- Password: `Bowo@123`
- FQDN: `nodejs.hestia.lokal`
- Hostname: `node.js`

## Langkah-Langkah Deployment

### 1. Akses Server Ubuntu

#### Menggunakan SSH (Recommended)
```bash
# Buka Command Prompt atau PowerShell
ssh bowo@10.10.11.149
# Masukkan password: Bowo@123
```

#### Menggunakan PuTTY (Windows)
- Download PuTTY dari https://putty.org/
- Host Name: `10.10.11.149`
- Port: `22`
- Connection Type: SSH
- Username: `bowo`
- Password: `Bowo@123`

### 2. Akses HestiaCP Panel

```
URL: https://10.10.11.149:8083
atau
URL: https://nodejs.hestia.lokal:8083

Username: Bowo
Password: Bowo@123
```

### 3. Persiapan File untuk Upload

#### A. Build Frontend
```bash
# Di folder Frontend lokal
cd "d:\Kuliah\Magang\Local\Simdg backup\Frontend"
npm run build
# atau
yarn build
```

#### B. Persiapan Backend
```bash
# Di folder Backend lokal
cd "d:\Kuliah\Magang\Local\Simdg backup\Backend"
npm run build
# atau pastikan semua file siap untuk production
```

### 4. Upload Files ke Server

#### Menggunakan SCP (Command Line)
```bash
# Upload Frontend (hasil build)
scp -r "d:\Kuliah\Magang\Local\Simdg backup\Frontend\dist" bowo@10.10.11.149:/home/bowo/

# Upload Backend
scp -r "d:\Kuliah\Magang\Local\Simdg backup\Backend" bowo@10.10.11.149:/home/bowo/
```

#### Menggunakan WinSCP (Windows GUI)
- Download WinSCP dari https://winscp.net/
- Host name: `10.10.11.149`
- User name: `bowo`
- Password: `Bowo@123`
- Protocol: SFTP

### 5. Setup di Server Ubuntu

#### A. Install Node.js dan npm
```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js (versi LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### B. Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### C. Setup Database
```bash
# Install PostgreSQL (jika menggunakan PostgreSQL)
sudo apt install postgresql postgresql-contrib -y

# Atau MySQL (jika menggunakan MySQL)
sudo apt install mysql-server -y
```

### 6. Configure Backend

```bash
# Masuk ke folder backend
cd /home/bowo/Backend

# Install dependencies
npm install

# Copy dan edit file environment
cp .env.example .env
nano .env
```

**Edit file .env:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=simdag_db

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=your_jwt_secret_key
```

### 7. Setup Database

#### PostgreSQL Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE simdag_db;
CREATE USER simdag_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE simdag_db TO simdag_user;
\q
```

#### Import Database
```bash
# Import SQL file
psql -U simdag_user -d simdag_db -f "/path/to/Simdag_Main_db.sql"
```

### 8. Start Backend dengan PM2

```bash
# Di folder Backend
cd /home/bowo/Backend

# Build aplikasi
npm run build

# Start dengan PM2
pm2 start dist/main.js --name "simdag-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 9. Setup Nginx (Web Server)

```bash
# Install Nginx
sudo apt install nginx -y

# Create site configuration
sudo nano /etc/nginx/sites-available/simdag
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name 10.10.11.149 nodejs.hestia.lokal;

    # Frontend (Static files)
    location / {
        root /home/bowo/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/simdag /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 10. Setup Firewall

```bash
# Allow necessary ports
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 8083    # HestiaCP
sudo ufw enable
```

### 11. Menggunakan HestiaCP (Alternative)

Jika ingin menggunakan HestiaCP untuk management:

1. Login ke HestiaCP: `https://10.10.11.149:8083`
2. Buat domain baru
3. Upload files melalui File Manager
4. Setup database melalui panel
5. Configure Node.js application

## Troubleshooting

### Check Status Services
```bash
# Check PM2 processes
pm2 status
pm2 logs simdag-backend

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check database
sudo systemctl status postgresql
# atau
sudo systemctl status mysql
```

### Common Issues

1. **Port sudah digunakan:**
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo kill -9 <PID>
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R bowo:bowo /home/bowo/
   sudo chmod -R 755 /home/bowo/
   ```

3. **Database connection error:**
   - Check database credentials di .env
   - Pastikan database service running
   - Check firewall rules

## Testing

```bash
# Test backend API
curl http://10.10.11.149:3000/api/health

# Test frontend
curl http://10.10.11.149/
```

## Maintenance Commands

```bash
# Update aplikasi
cd /home/bowo/Backend
git pull origin main  # jika menggunakan git
npm install
npm run build
pm2 restart simdag-backend

# Backup database
pg_dump -U simdag_user simdag_db > backup_$(date +%Y%m%d).sql

# Monitor logs
pm2 logs simdag-backend --lines 100
tail -f /var/log/nginx/access.log
```

---

**Catatan Penting:**
- Ganti semua password default dengan yang lebih aman
- Setup SSL certificate untuk HTTPS
- Regular backup database dan files
- Monitor resource usage (CPU, Memory, Disk)
- Update system dan aplikasi secara berkala