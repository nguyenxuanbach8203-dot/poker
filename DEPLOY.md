# 🚀 Hướng dẫn Deploy

## Bước 1: Deploy Backend lên Render

1. Vào https://render.com
2. Đăng nhập bằng GitHub (dùng account **nguyenxuanbach8203-dot**)
3. Click **"New +"** → **"Web Service"**
4. Connect repo: **poker**
5. Cấu hình:
   - **Name**: `texas-poker-backend` (hoặc tên gì cũng được)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
6. Click **"Create Web Service"**
7. Đợi deploy xong, copy URL (ví dụ: `https://texas-poker-backend.onrender.com`)

## Bước 2: Deploy Frontend lên Vercel

1. Vào https://vercel.com
2. Đăng nhập bằng GitHub (dùng account **nguyenxuanbach8203-dot**)
3. Click **"Add New..."** → **"Project"**
4. Import repo: **poker**
5. Cấu hình:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**: Thêm biến:
     - Key: `REACT_APP_SOCKET_URL`
     - Value: URL backend từ Render (bước 1)
6. Click **"Deploy"**
7. Đợi deploy xong, Vercel sẽ cho link (ví dụ: `https://poker-xxx.vercel.app`)

## Bước 3: Cập nhật CORS

Sau khi có URL frontend từ Vercel, cần update backend:

1. Vào Render dashboard → Web Service vừa tạo
2. **Environment** → Add environment variable:
   - Key: `CLIENT_URL`
   - Value: URL frontend từ Vercel
3. Save → Service sẽ tự động redeploy

## Bước 4: Update code Socket.IO

Cần sửa file `client/src/App.js`:

```javascript
// Thay dòng này:
const socket = io('http://localhost:3001');

// Thành:
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');
```

Sau đó push lại:
```bash
git add .
git commit -m "Update socket URL for production"
git push
```

Vercel sẽ tự động redeploy!

## ✅ Xong!

Giờ bố có thể chơi poker online miễn phí rồi! 🃏

**Lưu ý**: 
- Render free tier sẽ sleep sau 15 phút không dùng, lần đầu vào sẽ hơi lâu (30s)
- Vercel free tier không giới hạn
- Cả 2 đều miễn phí 100%!

---

**Coded & Deployed by Trump 🐶**
