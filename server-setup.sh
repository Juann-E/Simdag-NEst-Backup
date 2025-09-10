#!/bin/bash

# SIMDAG Server Setup Script for Ubuntu
# Run this script on the Ubuntu server after uploading files

echo "========================================"
echo "    SIMDAG Server Setup Script"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

print_status "Starting SIMDAG server setup..."

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
print_status "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install PM2
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    print_status "PM2 already installed: $(pm2 --version)"
fi

# Install PostgreSQL
print_status "Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
else
    print_status "PostgreSQL already installed"
fi

# Install Nginx
print_status "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    print_status "Nginx already installed"
fi

# Setup database
print_status "Setting up database..."
read -p "Enter database name [simdag_db]: " DB_NAME
DB_NAME=${DB_NAME:-simdag_db}

read -p "Enter database username [simdag_user]: " DB_USER
DB_USER=${DB_USER:-simdag_user}

read -s -p "Enter database password: " DB_PASS
echo

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
\q
EOF

print_status "Database created successfully"

# Setup backend
print_status "Setting up backend..."
if [ -d "/home/bowo/deployment-package/backend" ]; then
    cd /home/bowo/deployment-package/backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install --production
    
    # Setup environment file
    if [ -f ".env.production" ]; then
        cp .env.production .env
        print_status "Environment file created from template"
        
        # Update database configuration
        sed -i "s/DB_USERNAME=simdag_user/DB_USERNAME=$DB_USER/g" .env
        sed -i "s/DB_PASSWORD=CHANGE_THIS_PASSWORD/DB_PASSWORD=$DB_PASS/g" .env
        sed -i "s/DB_DATABASE=simdag_db/DB_DATABASE=$DB_NAME/g" .env
        
        # Generate JWT secret
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s/JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING/JWT_SECRET=$JWT_SECRET/g" .env
        
        # Generate session secret
        SESSION_SECRET=$(openssl rand -base64 32)
        sed -i "s/SESSION_SECRET=CHANGE_THIS_SESSION_SECRET/SESSION_SECRET=$SESSION_SECRET/g" .env
        
        print_status "Environment variables configured"
    else
        print_warning "No .env.production template found. Please create .env manually"
    fi
    
    # Build application
    print_status "Building backend application..."
    npm run build
    
    # Import database if SQL file exists
    if [ -f "/home/bowo/Data Gambaran/Simdag_Main_db.sql" ]; then
        print_status "Importing database..."
        PGPASSWORD=$DB_PASS psql -U $DB_USER -d $DB_NAME -f "/home/bowo/Data Gambaran/Simdag_Main_db.sql"
    else
        print_warning "Database SQL file not found. Please import manually"
    fi
    
    # Start with PM2
    print_status "Starting backend with PM2..."
    pm2 delete simdag-backend 2>/dev/null || true
    pm2 start dist/main.js --name "simdag-backend"
    pm2 save
    pm2 startup
    
else
    print_error "Backend directory not found at /home/bowo/deployment-package/backend"
fi

# Setup Nginx
print_status "Configuring Nginx..."
cat > /tmp/simdag-nginx.conf << 'EOF'
server {
    listen 80;
    server_name 10.10.11.149 nodejs.hestia.lokal;
    
    # Frontend (Static files)
    location / {
        root /home/bowo/deployment-package/frontend;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
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
    
    # Uploads directory
    location /uploads {
        alias /home/bowo/deployment-package/backend/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

sudo cp /tmp/simdag-nginx.conf /etc/nginx/sites-available/simdag
sudo ln -sf /etc/nginx/sites-available/simdag /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    sudo systemctl reload nginx
    print_status "Nginx configured successfully"
else
    print_error "Nginx configuration failed"
fi

# Setup firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8083/tcp
sudo ufw --force enable

# Set proper permissions
print_status "Setting file permissions..."
sudo chown -R bowo:bowo /home/bowo/deployment-package
sudo chmod -R 755 /home/bowo/deployment-package

# Create uploads directory
mkdir -p /home/bowo/deployment-package/backend/uploads/{barang,komoditas,pasar,team,team-photos}

print_status "Setup completed!"
echo
echo "========================================"
echo "           Setup Summary"
echo "========================================"
echo "Frontend URL: http://10.10.11.149"
echo "Backend API: http://10.10.11.149/api"
echo "HestiaCP: https://10.10.11.149:8083"
echo
echo "Database:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: localhost"
echo
echo "Services Status:"
echo "  Backend: $(pm2 list | grep simdag-backend | awk '{print $10}')"
echo "  Nginx: $(sudo systemctl is-active nginx)"
echo "  PostgreSQL: $(sudo systemctl is-active postgresql)"
echo
echo "Next steps:"
echo "1. Test the website: http://10.10.11.149"
echo "2. Check PM2 logs: pm2 logs simdag-backend"
echo "3. Monitor services: pm2 monit"
echo "========================================"

# Show PM2 status
print_status "Current PM2 processes:"
pm2 status