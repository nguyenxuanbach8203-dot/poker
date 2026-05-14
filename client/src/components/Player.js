import React from 'react';
import Card from './Card';

function Player({ player, isCurrentTurn, isDealer, isMe, showCards }) {
  return (
    <div className="player-seat">
      <div className={`player-info ${isCurrentTurn ? 'current-turn' : ''} ${player.folded ? 'folded' : ''}`}>
        {isDealer && <div className="dealer-button">D</div>}
        
        <div className="player-name">
          {player.name} {isMe && '(Bạn)'}
        </div>
        
        <div className="player-chips">
          💰 {player.chips.toLocaleString()}
        </div>
        
        {player.bet > 0 && (
          <div className="player-bet">
            Bet: {player.bet.toLocaleString()}
          </div>
        )}
        
        {player.folded && (
          <div style={{ color: '#ff6b6b', fontSize: '0.9em' }}>FOLD</div>
        )}
        
        {player.allIn && (
          <div style={{ color: '#ffd700', fontSize: '0.9em' }}>ALL IN!</div>
        )}
      </div>
      
      {player.cards && player.cards.length > 0 && (
        <div className="player-cards">
          {player.cards.map((card, idx) => (
            <Card 
              key={idx} 
              card={card} 
              faceDown={!showCards && !isMe}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Player;
