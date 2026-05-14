class PokerBot {
  constructor(id, name, chips) {
    this.id = id;
    this.name = name;
    this.chips = chips;
    this.isBot = true;
    this.personality = Math.random(); // 0 = tight, 1 = aggressive
  }

  makeDecision(gameState, myPlayer) {
    // Simple AI logic
    const handStrength = this.evaluateHandStrength(myPlayer.cards, gameState.communityCards);
    const potOdds = gameState.pot / (gameState.currentBet - myPlayer.bet);
    const callAmount = gameState.currentBet - myPlayer.bet;
    
    // Random delay to simulate thinking
    const delay = 1000 + Math.random() * 2000;
    
    return new Promise(resolve => {
      setTimeout(() => {
        // Fold if hand is weak and bet is high
        if (handStrength < 0.3 && callAmount > myPlayer.chips * 0.2) {
          resolve({ action: 'fold' });
          return;
        }

        // Check if possible
        if (callAmount === 0) {
          // Raise with strong hand
          if (handStrength > 0.7 && Math.random() < this.personality) {
            const raiseAmount = Math.min(
              gameState.currentBet * 2,
              myPlayer.chips
            );
            resolve({ action: 'raise', amount: raiseAmount });
          } else {
            resolve({ action: 'check' });
          }
          return;
        }

        // Call or raise with decent hand
        if (handStrength > 0.5) {
          if (Math.random() < this.personality * handStrength) {
            const raiseAmount = Math.min(
              gameState.currentBet * (1 + Math.random() * 2),
              myPlayer.chips
            );
            resolve({ action: 'raise', amount: raiseAmount });
          } else {
            resolve({ action: 'call' });
          }
          return;
        }

        // Call with medium hand if pot odds are good
        if (handStrength > 0.3 && potOdds > 3) {
          resolve({ action: 'call' });
          return;
        }

        // Otherwise fold
        resolve({ action: 'fold' });
      }, delay);
    });
  }

  evaluateHandStrength(holeCards, communityCards) {
    if (!holeCards || holeCards.length === 0) return 0;
    
    // Simple hand strength evaluation
    const allCards = [...holeCards, ...(communityCards || [])];
    
    // Check for pairs, high cards, etc.
    const ranks = allCards.map(c => c.rank);
    const suits = allCards.map(c => c.suit);
    
    const rankCounts = {};
    ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
    
    const hasPair = Object.values(rankCounts).some(c => c >= 2);
    const hasThree = Object.values(rankCounts).some(c => c >= 3);
    const hasFour = Object.values(rankCounts).some(c => c >= 4);
    
    const suitCounts = {};
    suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);
    const hasFlushDraw = Object.values(suitCounts).some(c => c >= 4);
    
    // Simple scoring
    let strength = 0.2; // Base strength
    
    if (hasFour) strength = 0.95;
    else if (hasThree) strength = 0.7;
    else if (hasPair) strength = 0.5;
    else if (hasFlushDraw) strength = 0.6;
    
    // High cards bonus
    const highCards = ['A', 'K', 'Q', 'J'];
    const hasHighCard = holeCards.some(c => highCards.includes(c.rank));
    if (hasHighCard) strength += 0.1;
    
    return Math.min(strength, 1);
  }
}

module.exports = PokerBot;
