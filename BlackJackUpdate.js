//
// Blackjack
// By Adefolaju
//

// card variables
const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
const values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 'Two'];

// DOM variables
const textArea = document.getElementById('textArea');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const stayButton = document.getElementById('stay-button');
const Player = document.getElementById('Player');
const Dealer = document.getElementById('Dealer');
const playerCardsDisplay = document.getElementById('playerCardsDisplay');
const dealerCardsDisplay = document.getElementById('dealerCardsDisplay');
const playerScoreDisplay = document.getElementById('playerScoreDisplay');
const dealerScoreDisplay = document.getElementById('dealerScoreDisplay');

// Game variables
let gameStarted = false;
let gameOver = false;
let playerWon = false;
let draw = false; // i added to account for draw
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let deck = [];

Player.style.display = 'none';
Dealer.style.display = 'none';
hitButton.style.display = 'none';
stayButton.style.display = 'none';

function createDeck() {
        const deck = [];
        for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
                for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
                        const card = {
                                suit: suits[suitIdx],
                                value: values[valueIdx],
                        };
                        deck.push(card);
                }
        }
        return deck;
}

function shuffleDeck(deck) {
        for (let i = 0; i < deck.length; i++) {
                const swapIdx = Math.trunc(Math.random() * deck.length);
                const tmp = deck[swapIdx];
                deck[swapIdx] = deck[i];
                deck[i] = tmp;
        }
}

function getCardString(card) {
        return `${card.value  } of ${  card.suit}`;
}

function getNextCard() {
        return deck.shift();
}

function getCardNumericValue(card) {
        switch (card.value) {
                case 'Ace':
                        return 1;
                case 'Two':
                        return 2;
                case 'Three':
                        return 3;
                case 'Four':
                        return 4;
                case 'Five':
                        return 5;
                case 'Six':
                        return 6;
                case 'Seven':
                        return 7;
                case 'Eight':
                        return 8;
                case 'Nine':
                        return 9;
                default:
                        return 10;
        }
}

function getScore(cardArray) {
        let score = 0;
        let hasAce = false; // Ace in blackjack could worth 1 or 11 points depending on the scenerio
        for (let i = 0; i < cardArray.length; i++) {
                const card = cardArray[i];
                score += getCardNumericValue(card);
                if (card.value === 'Ace') {
                        hasAce = true;
                }
        }
        if (hasAce && score + 10 <= 21) {
                return score + 10;
        }
        return score;
}

function updateScores() {
        dealerScore = getScore(dealerCards);
        playerScore = getScore(playerCards);
}

function checkForEndOfGame() {
        updateScores();

        if (gameOver) {
                // let dealer take cards
                while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21 && dealerCards.length < 5) {
                        // to allow dealer win if his card is up to 5 and less than 21 in value
                        dealerCards.push(getNextCard());
                        updateScores();
                }
        }
        // to allow dealer win if his card is up to 5 and less than 21 in value
        if (dealerScore <= 21 && dealerCards.length === 5) {
                gameOver = true;
                playerWon = false;
        } 
        // to allow dealer win if his card is up to 5 and less than 21 in value
          else if (playerScore <= 21 && playerCards.length === 5) {
                gameOver = true;
                playerWon = true;
        } else if (playerScore > 21) {
                playerWon = false;
                gameOver = true;
        } else if (dealerScore > 21) {
                playerWon = true;
                gameOver = true;
        } else if (gameOver) {
                if (playerScore > dealerScore) {
                        playerWon = true;
                } else if (playerScore < dealerScore) {
                        playerWon = false;
                } else if (playerScore === dealerScore) {
                        draw = true;
                        // to set draw === true
                }
        }
}

function showStatus() {
        if (!gameStarted) {
                textArea.innerText = 'Welcome to BlackJack!';
                return;
        }

        let dealerCardString = '';
        for (let i = 0; i < dealerCards.length; i++) {
                dealerCardString += `${getCardString(dealerCards[i])}\n`;
        }

        let playerCardString = '';
        for (let i = 0; i < playerCards.length; i++) {
                playerCardString += `${getCardString(playerCards[i])}\n`;
        }

        updateScores();
        // display dealer and player card in their box
        dealerCardsDisplay.innerText = dealerCardString;

        dealerScoreDisplay.innerText = `Score: ${  dealerScore}`;

        playerCardsDisplay.innerText = playerCardString;

        playerScoreDisplay.innerText = `Score: ${  playerScore}`;

        Player.style.display = 'block';
        Dealer.style.display = 'block';

        // if 21 is dealt immediately after dealing
        if (playerScore === 21 && playerCards.length === 2) {
                playerWon = true;
                gameOver = true;
        } else if (dealerScore === 21 && dealerCards.length === 2) {
                playerWon = false;
                gameOver = true;
        }

        if (gameOver) {
                if (playerWon) {
                        textArea.textContent = 'YOU WIN! YOU SABI GAN O. NEW GAME?';
                } else if (!playerWon && !draw) {
                        textArea.textContent = 'DEALER WINS, TRY AGAIN';
                }
                // to denote draw
                else if (draw) {
                        textArea.textContent = "It is a DRAW!!! Let's go again";
                }

                newGameButton.style.display = 'inline-block';
                hitButton.style.display = 'none';
                stayButton.style.display = 'none';
        }
}



newGameButton.addEventListener('click', function() {
        // change text to encourage player
        textArea.textContent = 'LEGGO';
        gameStarted = true;
        gameOver = false;
        draw = false;
        playerWon = false;

        deck = createDeck();
        shuffleDeck(deck);
        dealerCards = [getNextCard(), getNextCard()];
        playerCards = [getNextCard(), getNextCard()];

        newGameButton.style.display = 'none';
        hitButton.style.display = 'inline-block';
        stayButton.style.display = 'inline-block';
        showStatus();
});

hitButton.addEventListener('click', function() {
        playerCards.push(getNextCard());
        checkForEndOfGame();
        showStatus();
});

stayButton.addEventListener('click', function() {
        gameOver = true;
        checkForEndOfGame();
        showStatus();
});

