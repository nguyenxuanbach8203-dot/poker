const Deck = require('./Deck');
const { evaluateHand, compareHands } = require('./HandEvaluator');
const PokerBot = require('./PokerBot');

class Game {
  constructor(id, io) {
    this.id = id;
    this.io = io;
    this.players = [];
    this.deck = new Deck();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.dealerIndex = 0;
    this.currentPlayerIndex = 0;
    this.stage = 'waiting'; // waiting, preflop, flop, turn, river, showdown
    this.smallBlind = 10;
    this.bigBlind = 20;
    this.bots = [];
    this.botThinking = false;
  }

  addPlayer(player, isBot = false) {
    if (this.players.length >= 9) return false;
    
    this.players.push({
      ...player,
      cards: [],
      bet: 0,
      folded: false,
      allIn: false,
      isBot: isBot
    });

    if (this.players.length >= 2 && this.stage === 'waiting') {
      this.startNewRound();
    }
    return true;
  }

  addBots(numBots) {
    const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Bot Delta', 'Bot Epsilon', 'Bot Zeta', 'Bot Eta', 'Bot Theta'];
    
    for (let i = 0; i < numBots && this.players.length < 9; i++) {
      const bot = new PokerBot(
        `bot_${Date.now()}_${i}`,
        botNames[i] || `Bot ${i + 1}`,
        1000
      );
      this.bots.push(bot);
      this.addPlayer({
        id: bot.id,
        name: bot.name,
        chips: bot.chips
      }, true);
    }
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }

  startNewRound() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.stage = 'preflop';

    // Reset players
    this.players.forEach(player => {
      player.cards = [];
      player.bet = 0;
      player.folded = false;
      player.allIn = false;
    });

    // Post blinds
    const sbIndex = (this.dealerIndex + 1) % this.players.length;
    const bbIndex = (this.dealerIndex + 2) % this.players.length;
    
    this.players[sbIndex].bet = this.smallBlind;
    this.players[sbIndex].chips -= this.smallBlind;
    this.players[bbIndex].bet = this.bigBlind;
    this.players[bbIndex].chips -= this.bigBlind;
    
    this.pot = this.smallBlind + this.bigBlind;
    this.currentBet = this.bigBlind;
    this.currentPlayerIndex = (bbIndex + 1) % this.players.length;

    // Deal cards
    this.players.forEach(player => {
      player.cards = [this.deck.draw(), this.deck.draw()];
    });

    // Trigger bot action if first player is bot
    setTimeout(() => {
      const firstPlayer = this.players[this.currentPlayerIndex];
      if (firstPlayer && firstPlayer.isBot && !this.botThinking) {
        this.botThinking = true;
        const bot = this.bots.find(b => b.id === firstPlayer.id);
        if (bot) {
          bot.makeDecision(this.getState(), firstPlayer).then(decision => {
            this.botThinking = false;
            this.handleAction(firstPlayer.id, decision.action, decision.amount || 0);
            this.io.to(this.id).emit('gameState', this.getState());
          });
        }
      }
    }, 500);
  }

  handleAction(playerId, action, amount = 0) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || player.folded) return;

    const currentPlayer = this.players[this.currentPlayerIndex];
    if (currentPlayer.id !== playerId) return;

    switch (action) {
      case 'fold':
        player.folded = true;
        break;

      case 'check':
        if (player.bet < this.currentBet) return;
        break;

      case 'call':
        const callAmount = this.currentBet - player.bet;
        const actualCall = Math.min(callAmount, player.chips);
        player.chips -= actualCall;
        player.bet += actualCall;
        this.pot += actualCall;
        if (player.chips === 0) player.allIn = true;
        break;

      case 'raise':
        const raiseAmount = Math.min(amount, player.chips);
        player.chips -= raiseAmount;
        player.bet += raiseAmount;
        this.pot += raiseAmount;
        this.currentBet = player.bet;
        if (player.chips === 0) player.allIn = true;
        break;
    }

    this.nextPlayer();
  }

  nextPlayer() {
    const activePlayers = this.players.filter(p => !p.folded && !p.allIn);
    
    if (activePlayers.length === 1) {
      this.endRound();
      return;
    }

    let startIndex = this.currentPlayerIndex;
    let attempts = 0;
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      attempts++;
      if (attempts > this.players.length) break;
    } while (this.players[this.currentPlayerIndex].folded || this.players[this.currentPlayerIndex].allIn);

    // Check if betting round is complete
    const allBetsEqual = activePlayers.every(p => p.bet === this.currentBet);
    if (allBetsEqual && this.currentPlayerIndex === startIndex) {
      this.nextStage();
      return;
    }

    // If current player is a bot, make it play
    const currentPlayer = this.players[this.currentPlayerIndex];
    if (currentPlayer && currentPlayer.isBot && !this.botThinking) {
      this.botThinking = true;
      this.io.to(this.id).emit('gameState', this.getState());
      
      const bot = this.bots.find(b => b.id === currentPlayer.id);
      if (bot) {
        bot.makeDecision(this.getState(), currentPlayer).then(decision => {
          this.botThinking = false;
          this.handleAction(currentPlayer.id, decision.action, decision.amount || 0);
          this.io.to(this.id).emit('gameState', this.getState());
        });
      }
    }
  }

  nextStage() {
    // Reset bets
    this.players.forEach(p => p.bet = 0);
    this.currentBet = 0;

    switch (this.stage) {
      case 'preflop':
        this.communityCards = [this.deck.draw(), this.deck.draw(), this.deck.draw()];
        this.stage = 'flop';
        break;
      case 'flop':
        this.communityCards.push(this.deck.draw());
        this.stage = 'turn';
        break;
      case 'turn':
        this.communityCards.push(this.deck.draw());
        this.stage = 'river';
        break;
      case 'river':
        this.stage = 'showdown';
        this.showdown();
        return;
    }

    this.currentPlayerIndex = (this.dealerIndex + 1) % this.players.length;
  }

  showdown() {
    const activePlayers = this.players.filter(p => !p.folded);
    
    if (activePlayers.length === 1) {
      activePlayers[0].chips += this.pot;
    } else {
      const hands = activePlayers.map(p => ({
        player: p,
        hand: evaluateHand([...p.cards, ...this.communityCards])
      }));

      hands.sort((a, b) => compareHands(b.hand, a.hand));
      
      const winners = [hands[0]];
      for (let i = 1; i < hands.length; i++) {
        if (compareHands(hands[i].hand, hands[0].hand) === 0) {
          winners.push(hands[i]);
        } else {
          break;
        }
      }

      const winAmount = Math.floor(this.pot / winners.length);
      winners.forEach(w => w.player.chips += winAmount);
    }

    setTimeout(() => {
      this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
      this.startNewRound();
      this.io.to(this.id).emit('gameState', this.getState());
    }, 5000);
  }

  endRound() {
    const winner = this.players.find(p => !p.folded);
    winner.chips += this.pot;
    
    setTimeout(() => {
      this.dealerIndex = (this.dealerIndex + 1) % this.players.length;
      this.startNewRound();
      this.io.to(this.id).emit('gameState', this.getState());
    }, 3000);
  }

  getState() {
    return {
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        chips: p.chips,
        bet: p.bet,
        folded: p.folded,
        allIn: p.allIn,
        cards: p.cards
      })),
      communityCards: this.communityCards,
      pot: this.pot,
      currentBet: this.currentBet,
      currentPlayerIndex: this.currentPlayerIndex,
      dealerIndex: this.dealerIndex,
      stage: this.stage
    };
  }
}

module.exports = Game;
