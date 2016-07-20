var playerCash = 1000;
var playerBet = 100;
var playing = false;
var playerStands = false;
var dealerStands = false;
var shoeMode = true;

document.getElementById("playerCash").innerHTML = "Total Cash: " + playerCash;
document.getElementById("playerBet").innerHTML = "Current Bet: " + playerBet;

function newGame(){
	
	playing = true;
	playerStands = false;
	dealerStands = false;
	
	document.getElementById("winner").innerHTML = "";
	
	//set all player cards to blank
	for (var i = 0; i < 5; i++){
		document.getElementById(("playerCard" + i).toString()).src = "PNG-cards-1.3/blank.gif";
	}
	//set all dealer cards to blank
	for (var i = 0; i < 5; i++){
		document.getElementById(("dealerCard" + i).toString()).src = "PNG-cards-1.3/blank.gif";
	}
	
	playerHand = new hand();
	dealerHand = new hand();
	
	//blackjack default deals two cards to each player
	dealCard(playerHand);
	dealCard(dealerHand);
	dealCard(playerHand);
	dealCard(dealerHand);
	
	updateCards();
}

//"card" consists of number and suit, plus getters and setters
function card(){
	this.suit = null;
	this.number = null;
	this.setSuit = function(newSuit){
		this.suit = newSuit;
	};
	this.setNumber = function(newNumber){
		this.number = newNumber;
	};
}

//"hand" is a collection of 5 cards, aces tracked seperately to account for variable ace value
function hand(){
	this.cards = [];
	this.aces = 0;
	this.score = 0;
	
	this.incAces = function(){
		this.aces++;
	};
	this.decAces = function(){
		this.aces--;
	};
	this.incScore = function(scorePlus){
		this.score += scorePlus;
	};
	this.decScore = function(){
		this.score = this.score - 10;
	};
}

//update card images and player cash amount
function updateCards(){
	//construct a string based on value of card, retrieve image based on string name
	//there is probably a more elegant way of doing this, but this method functions
	for (var i = 0; i<playerHand.cards.length; i++){
		document.getElementById(("playerCard" + i).toString()).src =  "PNG-cards-1.3/" + playerHand.cards[i].number + "_of_" + playerHand.cards[i].suit + ".png";
	}
	for (var i = 0; i<dealerHand.cards.length; i++){
		document.getElementById(("dealerCard" + i).toString()).src =  "PNG-cards-1.3/" + dealerHand.cards[i].number + "_of_" + dealerHand.cards[i].suit + ".png";
	}
	
	document.getElementById("playerCash").innerHTML = "Total Cash: " + playerCash;
	document.getElementById("playerBet").innerHTML = "Current Bet: " + playerBet;
	document.getElementById("playerScore").innerHTML = "Player Score: " + playerHand.score;
	document.getElementById("dealerScore").innerHTML = "Dealer Score: " + dealerHand.score;
}

//add a card to either player or dealer hand
function dealCard(hand){
	var repeatCheck = true;
	nextCard = new card();
	
	if (shoeMode == false){
		while (repeatCheck){
			generateCard(nextCard);
			if (repeatCard(nextCard) == false){
				repeatCheck = false;
			}
		}
	}else{
		generateCard(nextCard);
	}
	
	if (nextCard.number == "ace"){
		hand.incAces(); //increase ace count if ace is dealt
	}
	
	hand.cards.push(nextCard);
	hand.incScore(faceValue(nextCard));
}

//create a random card with 1 of 4 suits and 13 face values
//"breaks" are supposed to be bad form, but greatly simplified this code
function generateCard(nextCard){
	var dealSuit;
	var dealNumber;
	
	dealSuit = Math.ceil(Math.random()*4);
	dealNumber = Math.ceil(Math.random()*13);
	
	//randomly choose from 1 of 4 suits
	switch (dealSuit){
	case 1:
		checkSuit = "hearts";
		break;
	case 2:
		checkSuit = "clubs";
		break;
	case 3: 
		checkSuit = "diamonds";
		break;
	default:
		checkSuit = "spades";
		break;
	}
	
	//randomly choose from 1 of 13 face values
	switch (dealNumber){
	case 11: 
		checkNumber = "jack";
		break;
	case 12:
		checkNumber = "queen";
		break;
	case 13:
		checkNumber = "king";
		break;
	case 1:
		checkNumber = "ace";
		break;
	default:
		checkNumber = dealNumber.toString();
		break;
	}
	
	nextCard.setSuit(checkSuit);
	nextCard.setNumber(checkNumber);
}

//correlates card face value string to numerical value int
function faceValue(card){
	switch (card.number){
	case "2":
		return 2;
	case "3":
		return 3;
	case "4":
		return 4;
	case "5":
		return 5;
	case "6":
		return 6;
	case "7":
		return 7;
	case "8":
		return 8;
	case "9":
		return 9;
	case "10":
		return 10;
	case "jack":
		return 10;
	case "queen":
		return 10;
	case "king":
		return 10;
	case "ace":
		return 11;
	}
}

function increaseBet(){
	if (!playing){
		if (playerBet < playerCash){
			playerBet += 10; //10 is the default value based on starting cash of 1000 and default bet of 100
		}
		updateCards();
	}
}

function decreaseBet(){
	if (!playing){
		if (playerBet != 0){
			playerBet -= 10; //only functions if bet is positive to prevent negative betting
		} 
		updateCards();
	}
}

function playerHit(){
	if (playing){ //button only active if game is active
		dealCard(playerHand);
		if (playerHand.score > 21){
			if (playerHand.aces > 0){ //checks for aces. in case of score > 21, ace count is decremented by 1 and score by 10, to account for variable value of aces
				playerHand.decAces();
				playerHand.decScore();
			}else{ //if there are no aces left to decrement
				dealerWins();
			}
		}
		if (playerHand.length >= 5){ //"five card charlie" rule always wins
			playerWins();
		}
		updateCards();
		dealerTurn();
	}
}

function playerStand(){
	if (playing){
		playerStands = true;
		if (dealerStands){ //final score comparison if both players stand
			scoreCompare();
		}
		dealerTurn();
	}
}

//assume dealer always hits on 16 or lower, otherwise stands
function dealerTurn(){
	if (playing){
		if (dealerHand.score < 17){
			dealCard(dealerHand);
			updateCards();
			if (dealerHand.score > 21){  //checks for aces. in case of score > 21, ace count is decremented by 1 and score by 10, to account for variable value of aces
				if (dealerHand.aces > 0){
					dealerHand.decAces();
					dealerHand.decScore();
					updateCards();
				}else{
					playerWins();
				}
			}
			if (dealerHand.length >= 5){ //"five card charlie" rule always wins
				dealerWins();
			}
		}else{
			dealerStands = true;
			if (playerStands){
				scoreCompare();
			}
		}
	}
}

function playerWins(){
	playerCash += playerBet;
	playing = false;
	updateCards();
	document.getElementById("winner").innerHTML = "PLAYER WINS"; //display player victory message
}

function dealerWins(){
	playerCash -= playerBet;
	playing = false;
	updateCards();
	document.getElementById("winner").innerHTML = "DEALER WINS"; //display dealer victory message
}

//check both players for bust, then compares scores
function scoreCompare(){
	updateCards();
	if (playerHand.score > 21){ //player score checked first, since ties awarded to dealer
		dealerWins();
	}else if (dealerHand.score > 21){
		playerWins();
	}else if (playerHand.score > dealerHand.score){
		playerWins();
	}else{
		dealerWins();
	}
}

//"shoe mode" allows duplicate cards to prevent card-counting, simulating casino "shoe" device 
//cannot be toggled while game is in session
function shoeToggle(){
	if (!playing){
		if (shoeMode){
			shoeMode = false;
			document.getElementById("shoeMode").innerHTML = "Shoe Mode OFF";
		}else{
			shoeMode = true;
			document.getElementById("shoeMode").innerHTML = "Shoe Mode ON";
		}
	}
}

//checks for repeat cards already in a hand. only active if shoe mode is on
//check new card against all existing cards in both players' hands
function repeatCard(number, suit){
	for (var i = 0; i < playerHand.length; i++){
		if ((suit == playerHand[i].suit)&&(number == playerHand[i].number)){
			return true;
		}
	}
	for (var i = 0; i < dealerHand.length; i++){
		if ((suit == dealerHand[i].suit)&&(number == dealerHand[i].number)){
			return true;
		}
	}
	return false;
}
