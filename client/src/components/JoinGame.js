import React, { useState } from 'react';

function JoinGame({ onJoin }) {
  const [gameId, setGameId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [buyIn, setBuyIn] = useState(1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gameId && playerName) {
      onJoin(gameId, playerName, buyIn);
    }
  };

  return (
    <div className="join-container">
      <h1>🃏 Texas Hold'em Poker</h1>
      <form className="join-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Game ID</label>
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Nhập ID phòng..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Tên của bạn</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên..."
            required
          />
        </div>
        
        <div className="form-group">
          <label>Buy-in (chips)</label>
          <input
            type="number"
            value={buyIn}
            onChange={(e) => setBuyIn(Number(e.target.value))}
            min="100"
            step="100"
            required
          />
        </div>
        
        <button type="submit" className="join-button">
          Vào bàn chơi
        </button>
      </form>
    </div>
  );
}

export default JoinGame;
