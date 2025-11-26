# Client Deployment Guide

## Environment Variables

Project ini menggunakan environment variables untuk manage API endpoints. Ada 3 file env:

### 1. `.env` (Development)
Digunakan saat development di lokal.
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PAYMENT_API_URL=http://localhost:3000
```

### 2. `.env.production` (Production)
Digunakan saat build untuk production.
```env
VITE_API_BASE_URL=https://superadmin.merzzmlbb.com
VITE_PAYMENT_API_URL=https://superadmin.merzzmlbb.com
```

### 3. `.env.example` (Template)
Template untuk setup environment baru.

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Preview production build
npm run build
npm run preview
```

---

## Production Deployment ke VPS

### Step 1: Upload ke VPS

**Opsi A: Via Git (Recommended)**
```bash
# Di lokal
git add .
git commit -m "refactor: use env variables for API endpoints"
git push

# Di VPS
cd /var/www
git clone <URL_REPO_CLIENT> client
cd client
```

**Opsi B: Via SCP**
```bash
# Dari laptop Windows (PowerShell)
scp -r "C:\project_tokogame\client_view" merzmlbb@103.189.234.91:/tmp/client_view

# Di VPS
mv /tmp/client_view /var/www/client
sudo chown -R $USER:$USER /var/www/client
```

---

### Step 2: Install Dependencies di VPS

```bash
cd /var/www/client

# Load nvm
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use --lts

# Install
npm install
```

---

### Step 3: Build untuk Production

Vite akan otomatis load `.env.production` saat build:

```bash
npm run build
```

Output ada di folder `dist/`.

---

### Step 4: Deploy ke Nginx

```bash
# Buat folder untuk static files
sudo mkdir -p /var/www/client-build
sudo chown $USER:$USER /var/www/client-build

# Copy build output
cp -r dist/* /var/www/client-build/
```

---

### Step 5: Konfigurasi Nginx

Edit file Nginx:
```bash
sudo nano /etc/nginx/sites-available/merzzmlbb.com
```

Tambahkan server block:
```nginx
server {
    listen 80;
    server_name merzzmlbb.com www.merzzmlbb.com;

    root /var/www/client-build;
    index index.html;

    # React SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy ke API (Next.js admin)
    location /api/ {
        proxy_pass         http://127.0.0.1:3001/api/;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        
        client_max_body_size 20M;
    }
}
```

Enable & reload:
```bash
sudo ln -sf /etc/nginx/sites-available/merzzmlbb.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 6: Setup SSL

```bash
sudo certbot --nginx -d merzzmlbb.com -d www.merzzmlbb.com
```

Pilih opsi **2** (redirect HTTP to HTTPS).

---

## Update Workflow

Kalau ada perubahan code:

```bash
cd /var/www/client

# Pull latest code
git pull

# Install dependencies (kalau ada perubahan package.json)
npm install

# Build ulang
npm run build

# Update static files
cp -r dist/* /var/www/client-build/
```

**TIDAK perlu restart service** karena ini static files.

---

## Troubleshooting

### 1. API endpoint tidak bisa diakses

Cek apakah admin panel (Next.js) jalan:
```bash
curl http://127.0.0.1:3001/api/akun/all
pm2 status
pm2 logs admin
```

### 2. White screen setelah deploy

Cek browser console untuk error. Biasanya:
- API endpoint salah (cek `.env.production`)
- CORS issue (cek config di admin panel)

### 3. Images tidak load

Cek MinIO jalan:
```bash
sudo systemctl status minio
curl http://localhost:9000/merz-images/
```

---

## Environment Variables Reference

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | `https://superadmin.merzzmlbb.com` |
| `VITE_PAYMENT_API_URL` | `http://localhost:3000` | `https://superadmin.merzzmlbb.com` |

**Note**: 
- Semua env variable untuk Vite harus diawali `VITE_`
- Perubahan env variable HARUS rebuild (`npm run build`)
- Env variables akan di-embed ke bundle saat build time
