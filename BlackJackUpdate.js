//
//Blackjack
// By Adefolaju
// 

// card variables
let suits =['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = [ 'Ace', 'King', 'Queen', 'Jack','Ten','Nine','Eight','Seven','Six','Five','Four',
                'Three','Two'];

// DOM variables
let textArea = document.getElementById('textArea');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');
let Player = document.getElementById('Player');
let Dealer = document.getElementById('Dealer')
let playerCardsDisplay = document.getElementById('playerCardsDisplay');
let dealerCardsDisplay = document.getElementById('dealerCardsDisplay');
let playerScoreDisplay = document.getElementById('playerScoreDisplay');
let dealerScoreDisplay = document.getElementById('dealerScoreDisplay');


// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    draw = false, //i added to account for draw
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [] ;

Player.style.display ="none";
Dealer.style.display = "none";
hitButton.style.visibility = "hidden";
stayButton.style.visibility = "hidden";


function createDeck() {
    let deck = [];
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
   
        for(let valueIdx = 0; valueIdx < values.length; valueIdx++ ) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };   
        deck.push (card);
        }
    }
    return deck;
} 

function shuffleDeck(deck) {
    for(let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx]; 
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }
}

function getCardString(card) {
    return card.value + " of " + card.suit
}

function getNextCard() {
    return deck.shift();
}

function getCardNumericValue(card) {
    switch(card.value){
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
    let hasAce = false;  //Ace in blackjack could worth 1 or 11 points depending on the scenerio
    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getCardNumericValue(card);
        if (card.value === 'Ace') {
            hasAce= true;
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
    while (dealerScore < playerScore
        && playerScore <=21 
        && dealerScore <=21
        && dealerCards.length < 5) { // to allow dealer win if his card is up to 5 and less than 21 in value
            dealerCards.push(getNextCard());
            updateScores();   
        }
    }
// to allow dealer win if his card is up to 5 and less than 21 in value
    if (dealerScore <= 21 && dealerCards.length === 5) {
        gameOver = true;
        playerWon = false;
        }
    else if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
        }
    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
        }
    else if (gameOver) {

        if (playerScore > dealerScore) {
            playerWon = true;
        }
    else if (playerScore < dealerScore) {
        playerWon = false;
        }
    else if (playerScore === dealerScore) {
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
        dealerCardString += getCardString(dealerCards[i]) + '\n'
    }

    let playerCardString = '';
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + '\n'
    }


    updateScores();
  // display dealer and player card in their box
    dealerCardsDisplay.innerText = dealerCardString ;

    dealerScoreDisplay.innerText = 
    'score: ' + dealerScore 


    playerCardsDisplay.innerText = playerCardString;

    playerScoreDisplay.innerText =
    'score: ' + playerScore ;

    Player.style.display ="block";
    Dealer.style.display = "block";

    // if 21 is dealt immediately after dealing
    if (playerScore === 21 && playerCards.length === 2) {
        playerWon = true;
        gameOver = true;
    } else
    if (dealerScore === 21 && dealerCards.length === 2) {
        playerWon = false;
        gameOver = true;
    }

    if (gameOver) {
        if (playerWon) {
            textArea.innerText = "YOU WIN!" ;
        }
        
        else if (!playerWon && !draw) {
            textArea.innerText = "DEALER WINS";
        }
        // to denote draw
        else if (draw) {
            textArea.innerText = "It is a DRAW!!! Let's go again"
        }

        // make result text appear when there is result to announce
        textArea.style.visibility = "visible";

        newGameButton.style.visibility = "visible";
        hitButton.style.visibility = "hidden";
        stayButton.style.visibility = "hidden";
    }
}


newGameButton.addEventListener('click', function(){
    // make result text disappear until there is result
    textArea.style.visibility = "hidden";
    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards= [getNextCard() , getNextCard()];
    playerCards= [getNextCard() , getNextCard()];
   
    newGameButton.style.visibility = "hidden";
    hitButton.style.visibility = "visible";
    stayButton.style.visibility = "visible";
    showStatus();
});

hitButton.addEventListener('click', function() {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

stayButton.addEventListener('click', function(){
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});