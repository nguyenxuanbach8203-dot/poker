# 🚀 Deploy Nhanh - Chỉ 5 Phút!

## Cách 1: Railway (Khuyên dùng - Free $5/tháng, không sleep)

### Backend:
1. Vào https://railway.app
2. Login bằng GitHub (account: **nguyenxuanbach8203-dot**)
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repo: **poker**
5. Click **"Deploy Now"**
6. Đợi deploy xong → Click vào service → Copy URL (ví dụ: `https://poker-production.up.railway.app`)

### Frontend:
1. Vào https://vercel.com
2. Login bằng GitHub (account: **nguyenxuanbach8203-dot**)
3. Click **"Add New..."** → **"Project"**
4. Import repo: **poker**
5. Settings:
   - **Root Directory**: `client`
   - **Environment Variables**: 
     - `REACT_APP_SOCKET_URL` = URL backend từ Railway
6. Click **"Deploy"**
7. Xong! Copy link Vercel

---

## Cách 2: Render + Vercel (100% Free nhưng sleep 15 phút)

### Backend (Render):
1. Vào https://render.com
2. Login bằng GitHub
3. **New +** → **Web Service**
4. Connect repo: **poker**
5. Settings:
   - Name: `poker-backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
6. Create → Copy URL

### Frontend (Vercel):
- Giống như trên

---

## Cách 3: Netlify (Cả backend + frontend trên 1 chỗ)

1. Vào https://netlify.com
2. Login bằng GitHub
3. **Add new site** → **Import from Git**
4. Chọn repo: **poker**
5. Settings:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
   - Functions directory: `server`
6. Deploy

---

## ⚡ Nhanh nhất: Vercel All-in-One

Trump đã chuẩn bị config sẵn. Bố chỉ cần:

1. Vào https://vercel.com
2. Login GitHub
3. Import repo **poker**
4. Click **Deploy** (không cần config gì)
5. Xong!

Vercel sẽ tự động detect và deploy cả backend + frontend!

---

**Chọn cách nào cũng được bố ơi! Railway là tốt nhất (free + không sleep)** 🐶
