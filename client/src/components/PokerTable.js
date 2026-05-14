import React, { useState } from 'react';
import Card from './Card';
import Player from './Player';

function PokerTable({ gameState, playerId, onAction }) {
  const [raiseAmount, setRaiseAmount] = useState(0);

  if (!gameState) {
    return (
      <div className="poker-table-container">
        <div style={{ color: 'white', textAlign: 'center', fontSize: '1.5em' }}>
          Đang chờ game bắt đầu...
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const myPlayer = gameState.players.find(p => p.id === playerId);
  const isMyTurn = currentPlayer && currentPlayer.id === playerId;
  const canCheck = myPlayer && myPlayer.bet === gameState.currentBet;
  const callAmount = myPlayer ? gameState.currentBet - myPlayer.bet : 0;

  // Position players around the table
  const getPlayerPosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radiusX = 45;
    const radiusY = 35;
    const x = 50 + radiusX * Math.cos(angle);
    const y = 50 + radiusY * Math.sin(angle);
    return { left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' };
  };

  return (
    <div className="poker-table-container">
      <div className="poker-table">
        <div className="table-info">
          <div className="pot-display">
            <h2>POT</h2>
            <div className="pot-amount">💰 {gameState.pot.toLocaleString()}</div>
          </div>
          
          {gameState.communityCards && gameState.communityCards.length > 0 && (
            <div className="community-cards">
              {gameState.communityCards.map((card, idx) => (
                <Card key={idx} card={card} />
              ))}
            </div>
          )}
          
          <div style={{ marginTop: '15px', color: '#ffd700', fontSize: '1.2em', fontWeight: 'bold' }}>
            {gameState.stage === 'preflop' && 'PRE-FLOP'}
            {gameState.stage === 'flop' && 'FLOP'}
            {gameState.stage === 'turn' && 'TURN'}
            {gameState.stage === 'river' && 'RIVER'}
            {gameState.stage === 'showdown' && 'SHOWDOWN'}
          </div>
        </div>

        <div className="players-container">
          {gameState.players.map((player, idx) => (
            <div
              key={player.id}
              style={getPlayerPosition(idx, gameState.players.length)}
            >
              <Player
                player={player}
                isCurrentTurn={idx === gameState.currentPlayerIndex}
                isDealer={idx === gameState.dealerIndex}
                isMe={player.id === playerId}
                showCards={gameState.stage === 'showdown'}
              />
            </div>
          ))}
        </div>
      </div>

      {myPlayer && !myPlayer.folded && !myPlayer.allIn && (
        <div className="action-controls">
          <button
            className="action-button fold"
            onClick={() => onAction('fold')}
            disabled={!isMyTurn}
          >
            Fold
          </button>

          {canCheck ? (
            <button
              className="action-button check"
              onClick={() => onAction('check')}
              disabled={!isMyTurn}
            >
              Check
            </button>
          ) : (
            <button
              className="action-button call"
              onClick={() => onAction('call')}
              disabled={!isMyTurn || callAmount > myPlayer.chips}
            >
              Call {callAmount.toLocaleString()}
            </button>
          )}

          <input
            type="number"
            className="raise-input"
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(Number(e.target.value))}
            min={gameState.currentBet + gameState.currentBet}
            max={myPlayer.chips}
            placeholder="Số tiền"
            disabled={!isMyTurn}
          />

          <button
            className="action-button raise"
            onClick={() => {
              if (raiseAmount > 0) {
                onAction('raise', raiseAmount);
                setRaiseAmount(0);
              }
            }}
            disabled={!isMyTurn || raiseAmount <= 0 || raiseAmount > myPlayer.chips}
          >
            Raise
          </button>
        </div>
      )}
    </div>
  );
}

export default PokerTable;
