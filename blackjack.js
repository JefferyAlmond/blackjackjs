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
	
	for (var i = 0; i < 5; i++){
		document.getElementById(("playerCard" + i).toString()).src = "PNG-cards-1.3/blank.gif";
	}
	for (var i = 0; i < 5; i++){
		document.getElementById(("dealerCard" + i).toString()).src = "PNG-cards-1.3/blank.gif";
	}
	
	playerHand = new hand();
	dealerHand = new hand();
	
	dealCard(playerHand);
	dealCard(dealerHand);
	dealCard(playerHand);
	dealCard(dealerHand);
	
	updateCards();
}

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

function updateCards(){
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
		hand.incAces();
	}
	
	hand.cards.push(nextCard);
	hand.incScore(faceValue(nextCard));
}

function generateCard(nextCard){
	var dealSuit;
	var dealNumber;
	
	dealSuit = Math.ceil(Math.random()*4);
	dealNumber = Math.ceil(Math.random()*13);
	
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
			playerBet += 10;
		}
		updateCards();
	}
}

function decreaseBet(){
	if (!playing){
		if (playerBet != 0){
			playerBet -= 10;
		} 
		updateCards();
	}
}

function playerHit(){
	if (playing){
		dealCard(playerHand);
		if (playerHand.score > 21){
			if (playerHand.aces > 0){
				playerHand.decAces();
				playerHand.decScore();
			}else{
				dealerWins();
			}
		}
		if (playerHand.length >= 5){
			playerWins();
		}
		updateCards();
		dealerTurn();
	}
}

function playerStand(){
	if (playing){
		playerStands = true;
		if (dealerStands){
			scoreCompare();
		}
		dealerTurn();
	}
}

function dealerTurn(){
	if (playing){
		if (dealerHand.score < 17){
			dealCard(dealerHand);
			updateCards();
			if (dealerHand.score > 21){
				if (dealerHand.aces > 0){
					dealerHand.decAces();
					dealerHand.decScore();
					updateCards();
				}else{
					playerWins();
				}
			}
			if (dealerHand.length >= 5){
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
	document.getElementById("winner").innerHTML = "PLAYER WINS";
}

function dealerWins(){
	playerCash -= playerBet;
	playing = false;
	updateCards();
	document.getElementById("winner").innerHTML = "DEALER WINS";
}

function scoreCompare(){
	updateCards();
	if (playerHand.score > 21){
		dealerWins();
	}else if (dealerHand.score > 21){
		playerWins();
	}else if (playerHand.score > dealerHand.score){
		playerWins();
	}else{
		dealerWins();
	}
}

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
