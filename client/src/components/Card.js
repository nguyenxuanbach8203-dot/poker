import React from 'react';

function Card({ card, faceDown = false }) {
  if (!card) return null;

  if (faceDown) {
    return <div className="card card-back">🂠</div>;
  }

  const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };

  return (
    <div className={`card ${card.suit}`}>
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">{suitSymbols[card.suit]}</div>
    </div>
  );
}

export default Card;
