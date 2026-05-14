const rankValues = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const handRanks = {
  'HIGH_CARD': 1,
  'PAIR': 2,
  'TWO_PAIR': 3,
  'THREE_OF_A_KIND': 4,
  'STRAIGHT': 5,
  'FLUSH': 6,
  'FULL_HOUSE': 7,
  'FOUR_OF_A_KIND': 8,
  'STRAIGHT_FLUSH': 9,
  'ROYAL_FLUSH': 10
};

function evaluateHand(cards) {
  const allCombinations = getCombinations(cards, 5);
  let bestHand = null;

  for (let combo of allCombinations) {
    const hand = evaluateFiveCards(combo);
    if (!bestHand || compareHands(hand, bestHand) > 0) {
      bestHand = hand;
    }
  }

  return bestHand;
}

function getCombinations(arr, k) {
  if (k === 1) return arr.map(x => [x]);
  
  const combinations = [];
  for (let i = 0; i <= arr.length - k; i++) {
    const head = arr[i];
    const tailCombos = getCombinations(arr.slice(i + 1), k - 1);
    for (let combo of tailCombos) {
      combinations.push([head, ...combo]);
    }
  }
  return combinations;
}

function evaluateFiveCards(cards) {
  const ranks = cards.map(c => rankValues[c.rank]).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  
  const rankCounts = {};
  ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
  
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => b - a);
  
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = checkStraight(ranks);
  const isRoyal = isStraight && ranks[0] === 14 && ranks[4] === 10;

  if (isFlush && isRoyal) {
    return { rank: handRanks.ROYAL_FLUSH, values: ranks, name: 'Royal Flush' };
  }
  
  if (isFlush && isStraight) {
    return { rank: handRanks.STRAIGHT_FLUSH, values: ranks, name: 'Straight Flush' };
  }
  
  if (counts[0] === 4) {
    return { rank: handRanks.FOUR_OF_A_KIND, values: uniqueRanks, name: 'Four of a Kind' };
  }
  
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: handRanks.FULL_HOUSE, values: uniqueRanks, name: 'Full House' };
  }
  
  if (isFlush) {
    return { rank: handRanks.FLUSH, values: ranks, name: 'Flush' };
  }
  
  if (isStraight) {
    return { rank: handRanks.STRAIGHT, values: ranks, name: 'Straight' };
  }
  
  if (counts[0] === 3) {
    return { rank: handRanks.THREE_OF_A_KIND, values: uniqueRanks, name: 'Three of a Kind' };
  }
  
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: handRanks.TWO_PAIR, values: uniqueRanks, name: 'Two Pair' };
  }
  
  if (counts[0] === 2) {
    return { rank: handRanks.PAIR, values: uniqueRanks, name: 'Pair' };
  }
  
  return { rank: handRanks.HIGH_CARD, values: ranks, name: 'High Card' };
}

function checkStraight(ranks) {
  for (let i = 0; i < ranks.length - 1; i++) {
    if (ranks[i] - ranks[i + 1] !== 1) {
      // Check for A-2-3-4-5 straight
      if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
        return true;
      }
      return false;
    }
  }
  return true;
}

function compareHands(hand1, hand2) {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }
  
  for (let i = 0; i < hand1.values.length; i++) {
    if (hand1.values[i] !== hand2.values[i]) {
      return hand1.values[i] - hand2.values[i];
    }
  }
  
  return 0;
}

module.exports = { evaluateHand, compareHands };
