# 🃏 Texas Hold'em Poker - Multiplayer Web Game

Web game poker Texas Hold'em chuyên nghiệp với React + Node.js + Socket.IO

## 🎮 Tính năng

- ✅ Multiplayer realtime (tối đa 9 người chơi)
- ✅ Game logic Texas Hold'em đầy đủ
- ✅ UI đẹp mắt, chuyên nghiệp
- ✅ Blinds tự động
- ✅ Dealer button rotation
- ✅ All-in support
- ✅ Hand evaluation (xếp hạng bài)
- ✅ Responsive design

## 🚀 Cài đặt

```bash
cd texas-poker
npm install
cd client
npm install
cd ..
```

## ▶️ Chạy game

### Chạy cả server + client cùng lúc:
```bash
npm run dev
```

### Hoặc chạy riêng:

**Server (Backend):**
```bash
npm run server
```

**Client (Frontend):**
```bash
npm run client
```

## 🎯 Cách chơi

1. Mở trình duyệt: `http://localhost:3000`
2. Nhập Game ID (ví dụ: `room1`)
3. Nhập tên của bạn
4. Chọn số chips buy-in
5. Nhấn "Vào bàn chơi"
6. Chờ ít nhất 2 người để bắt đầu!

## 🎲 Luật chơi Texas Hold'em

- Mỗi người được 2 lá bài riêng
- 5 lá bài chung (community cards)
- Các vòng: Pre-flop → Flop (3 lá) → Turn (1 lá) → River (1 lá) → Showdown
- Xếp hạng bài từ cao xuống thấp:
  - Royal Flush
  - Straight Flush
  - Four of a Kind
  - Full House
  - Flush
  - Straight
  - Three of a Kind
  - Two Pair
  - Pair
  - High Card

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- Socket.IO (WebSocket)
- Game logic tự code

**Frontend:**
- React
- Socket.IO Client
- CSS3 (animations, gradients)

## 📁 Cấu trúc project

```
texas-poker/
├── server/
│   ├── index.js              # Server chính
│   └── game/
│       ├── Game.js           # Game logic
│       ├── Deck.js           # Bộ bài
│       └── HandEvaluator.js  # Đánh giá bài
├── client/
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── components/
│           ├── JoinGame.js
│           ├── PokerTable.js
│           ├── Player.js
│           └── Card.js
└── package.json
```

## 🎨 Features nổi bật

- **Realtime multiplayer**: Dùng WebSocket, mượt mà không lag
- **UI chuyên nghiệp**: Bàn poker hình ellipse, animation đẹp
- **Game logic hoàn chỉnh**: Blinds, dealer button, all-in, hand evaluation
- **Responsive**: Chơi được trên mobile

## 🔧 Cấu hình

- Server port: `3001`
- Client port: `3000`
- Small blind: `10`
- Big blind: `20`
- Default buy-in: `1000`

## 📝 TODO (nếu muốn mở rộng)

- [ ] Thêm chat trong game
- [ ] Lưu lịch sử game
- [ ] Leaderboard
- [ ] Sound effects
- [ ] Animations nâng cao
- [ ] Tournament mode
- [ ] Authentication

---

**Coded by Trump 🐶**
*Chúc bố chơi vui!*
