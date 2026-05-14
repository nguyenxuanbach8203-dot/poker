import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import PokerTable from './components/PokerTable';
import JoinGame from './components/JoinGame';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://poker-server-production-7494.up.railway.app');

function App() {
  const [gameState, setGameState] = useState(null);
  const [joined, setJoined] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setPlayerId(socket.id);
    });

    socket.on('gameState', (state) => {
      setGameState(state);
    });

    return () => {
      socket.off('connect');
      socket.off('gameState');
    };
  }, []);

  const handleJoinGame = (gameId, playerName, buyIn, gameMode, numBots) => {
    socket.emit('joinGame', { gameId, playerName, buyIn, gameMode, numBots });
    setJoined(true);
  };

  const handleAction = (action, amount = 0) => {
    socket.emit('action', { action, amount });
  };

  return (
    <div className="App">
      {!joined ? (
        <JoinGame onJoin={handleJoinGame} />
      ) : (
        <PokerTable 
          gameState={gameState} 
          playerId={playerId}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

export default App;
