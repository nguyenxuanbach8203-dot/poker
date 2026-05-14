const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Game = require('./game/Game');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const games = new Map();
const players = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('joinGame', ({ gameId, playerName, buyIn }) => {
    let game = games.get(gameId);
    
    if (!game) {
      game = new Game(gameId, io);
      games.set(gameId, game);
    }

    const player = {
      id: socket.id,
      name: playerName,
      chips: buyIn || 1000
    };

    players.set(socket.id, { gameId, player });
    socket.join(gameId);
    
    game.addPlayer(player);
    io.to(gameId).emit('gameState', game.getState());
  });

  socket.on('action', ({ action, amount }) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;

    const game = games.get(playerData.gameId);
    if (!game) return;

    game.handleAction(socket.id, action, amount);
    io.to(playerData.gameId).emit('gameState', game.getState());
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    const playerData = players.get(socket.id);
    
    if (playerData) {
      const game = games.get(playerData.gameId);
      if (game) {
        game.removePlayer(socket.id);
        io.to(playerData.gameId).emit('gameState', game.getState());
        
        if (game.players.length === 0) {
          games.delete(playerData.gameId);
        }
      }
      players.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
