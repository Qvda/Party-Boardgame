var gameApp = angular.module('gameApp', ['ngRoute']);

gameApp.run(function($rootScope, $window) {
	$rootScope.windowWidth = $window.innerWidth;
	$rootScope.windowHeight = $window.innerHeight;
	
	angular.element($window).bind('resize',function() {
		$rootScope.windowWidth = $window.innerWidth;
		$rootScope.windowHeight = $window.innerHeight;
		
		$rootScope.$apply('windowWidth');
		$rootScope.$apply('windowHeight');
	});
});

gameApp.config(function ($routeProvider) {
	$routeProvider
		.when('/',
			{
				controller: 'GameController',
				templateUrl: 'partials/menu.html'
			})
		.when('/gameboard',
			{
				controller: 'GameController',
				templateUrl: 'partials/gameboard.html'
			})
		.when('/multiplayer_local',
			{
				controller: 'GameController',
				templateUrl: 'partials/multiplayer_local.html'
			})
		.when('/information',
			{
				controller: 'GameController',
				templateUrl: 'partials/information.html'
			})
		.when('/minigame',
			{
				controller: 'MinigameController',
				templateUrl: 'partials/minigame.html'
			})
		.otherwise({ redirectTo: '/' });
});

gameApp.factory('factory', function() {
	var board = [];
	var turn = 0;
	var jackpot = 5;
	var numberOfSquares = 10;
	var multiplayer = false;
	var pawns = [
		{id: 0, type: "human", color: 'dark_red', name: "Red", score: 0, location: 0, left: 0, top: 0, x_alignment: 0, y_alignment: 0},
		{id: 1, type: "computer", color: 'dark_blue', name: "Blue", score: 0, location: 0, left: 0, top: 0, x_alignment: 1, y_alignment: 0},
		{id: 2, type: "computer", color: 'dark_green', name: "Green", score: 0, location: 0, left: 0, top: 0, x_alignment: 0, y_alignment: 1},
		{id: 3, type: "computer", color: 'dark_yellow', name: "Yellow", score: 0, location: 0, left: 0, top: 0, x_alignment: 1, y_alignment: 1},
	];
	var minigames = [
		{id: 0, name: "Guess the word!", description: "Every second a new letter appears. First one to guess the word wins!", message: ""},
		{id: 1, name: "Star game", description: "Push the button to get your star up. Get your star into the sky first to win!", message: ""},
		{id: 2, name: "Pirate's treasure", description: "There is a treasure hidden somewhere! Take turns to search for it.", message: ""},
		{id: 3, name: "Rock, Paper, Scissors", description: "The classic game. Scissors cuts paper, paper covers rock and, as it's always been, rock crushes scissors.", message: ""},
		{id: 4, name: "Trivia", description: "Correctly answer the questions.", message: ""},
	];
	var multiplayerMinigames = [2, 3, 4];
	var previousMinigame = -1;
	var wordlist = ["anchor", "badger", "croissant", "dragon", "evasion", "forest", "geometry", "hexagon", "infinite", "juggler", "knight", "length", "morning", "notation", "overcoat", "personal", "quarter", "random", "stupefy", "tradition", "urban", "vitamin", "windmill", "x-ray", "yellow", "zoology"];
	var triviaQuestions = [
		{
			question: "Which is the youngest American city?",
			a: "Killeen, TX",
			b: "Jacksonville, NC",
			c: "Paramount, CA",
			d: "Layton, UT",
			correct: "1"
		},
		{
			question: "The Nile River is the longest river in the world (at 4,160 miles). Which one's the next longest?",
			a: "Yangtze River",
			b: "Congo River",
			c: "Amazon River",
			d: "Hunang He",
			correct: "2"
		},
		{
			question: "What is the 10th most spoken language worldwide?",
			a: "German",
			b: "Bengali",
			c: "Russian",
			d: "Portuguese",
			correct: "0"
		},
		{
			question: "What do Grenada and Costa Rica have in common?",
			a: "They have no army",
			b: "They sit on the Equator",
			c: "Voted world's best place to live",
			d: "Countries with the least crime",
			correct: "0"
		},
		{
			question: "Vancouver has the SkyTrain, London has the London Underground. What's the name of Hong Kong's metro system?",
			a: "Metrorail",
			b: "RTA Rapid Transit",
			c: "Docklands Light Railway",
			d: "MTR",
			correct: "3"
		},
		{
			question: "Ouagadougou is the capital city of which African country?",
			a: "Chad",
			b: "Burkina Faso",
			c: "Eritrea",
			d: "Djibouti",
			correct: "1"
		},
		{
			question: "As of July 2011, Kosovo and the Vatican City are still not members of the United Nations. Who else isn't?",
			a: "Rwanda",
			b: "Taiwan",
			c: "Afghanistan",
			d: "El Salvador",
			correct: "1"
		},
		{
			question: "Completed in 2012, The Shard (based in London) is Europe's tallest building. How many floors does it have?",
			a: "94",
			b: "68",
			c: "72",
			d: "81",
			correct: "2"
		},
		{
			question: "The second longest coastline, after Canada, is where?",
			a: "Chile",
			b: "Australia",
			c: "Russia",
			d: "Indonesia",
			correct: "3"
		},
		{
			question: "Soekarno-Hatta, Guangzhou Baiyun and Madrid Barajas are all names for what?",
			a: "Airports",
			b: "Bridges",
			c: "Race courses",
			d: "Coastal resorts",
			correct: "0"
		},
		{
			question: "Which country actually has the world's longest official name (except it's known by a shortened version)?",
			a: "Libya",
			b: "Tajikistan",
			c: "Guatemala",
			d: "Mongolia",
			correct: "0"
		},
		{
			question: "Trabzon is a coastal city in north-eastern Turkey. Which sea does it border?",
			a: "The Mediterranean Sea",
			b: "The Black Sea",
			c: "The Thracian Sea",
			d: "The Balearic Sea",
			correct: "1"
		},
		{
			question: "Approximately how many people live in Greenland (to the closest thousand)?",
			a: "44,000",
			b: "32,000",
			c: "85,000",
			d: "57,000",
			correct: "3"
		},
		{
			question: "You cannot drive on the left in which of these countries?",
			a: "Ireland",
			b: "Nepal",
			c: "Italy",
			d: "Malaysia",
			correct: "2"
		},
		{
			question: "The Prime Meridian does not run through which continent?",
			a: "Europe",
			b: "Africa",
			c: "Antarctica",
			d: "South America",
			correct: "3"
		},
		{
			question: "Which is the second largest city in New Zealand, after Auckland?",
			a: "Christchurch",
			b: "Wellington",
			c: "Hamilton",
			d: "Napier-Hastings",
			correct: "1"
		},
		{
			question: "One of these countries isn't landlocked. Which is it?",
			a: "Zambia",
			b: "Paraguay",
			c: "Slovakia",
			d: "Croatia",
			correct: "3"
		},
		{
			question: "In 2012, which one of the following was not the name of a hurricane?",
			a: "Patty",
			b: "Humberto",
			c: "Julian",
			d: "Valerie",
			correct: "2"
		},
		{
			question: "Which country contains the most languages?",
			a: "Papua New Guinea",
			b: "China",
			c: "Australia",
			d: "Jamaica",
			correct: "0"
		},
		{
			question: "How do crickets hear?",
			a: "Through their wings",
			b: "Through their belly",
			c: "Through their knees",
			d: "Through their tongue",
			correct: "2"
		},
		{
			question: "Which American city invented plastic vomit?",
			a: "Chicago",
			b: "Detroit",
			c: "Columbus",
			d: "Baltimore",
			correct: "0"
		},
		{
			question: "In 'Ben Hur', which modern thing can be seen during the chariot scene?",
			a: "A waitress",
			b: "A car",
			c: "A postbox",
			d: "A street lamp",
			correct: "1"
		},
		{
			question: "What was Karl Marx's favorite color?",
			a: "Brown",
			b: "Blue",
			c: "Red",
			d: "Purple",
			correct: "2"
		},
		{
			question: "What's the best way to stop crying while peeling onions?",
			a: "Lick almonds",
			b: "Suck lemons",
			c: "Eat cheese",
			d: "Chew gum",
			correct: "3"
		},
		{
			question: "How old was the youngest Pope?",
			a: "11",
			b: "17",
			c: "22",
			d: "29",
			correct: "0"
		},
		{
			question: "Which animal sleeps for only five minutes a day?",
			a: "A chameleon",
			b: "A koala",
			c: "A giraffe",
			d: "A beaver",
			correct: "2"
		},
		{
			question: "How many words in the English language end in 'dous'?",
			a: "Two",
			b: "Four",
			c: "Six",
			d: "Eight",
			correct: "1"
		},
		{
			question: "One human hair can support how many kilograms?",
			a: "Three",
			b: "Five",
			c: "Seven",
			d: "Nine",
			correct: "0"
		},
		{
			question: "The bikini was originally called the what?",
			a: "Poke",
			b: "Range",
			c: "Half",
			d: "Atom",
			correct: "3"
		},
		{
			question: "Which European city is home to the Fairy Investigation Society?",
			a: "Poznan",
			b: "Dublin",
			c: "Bratislava",
			d: "Tallinn",
			correct: "1"
		},
		{
			question: "What's a frog's favorite color?",
			a: "Blue",
			b: "Orange",
			c: "Yellow",
			d: "Brown",
			correct: "0"
		},
		{
			question: "Which one of these planets rotates clockwise?",
			a: "Uranus",
			b: "Mercury",
			c: "Pluto",
			d: "Venus",
			correct: "3"
		},
		{
			question: "What perspires half a pint of fluid a day?",
			a: "Your scalp",
			b: "Your armpits",
			c: "Your feet",
			d: "Your buttocks",
			correct: "2"
		},
		{
			question: "St Stephen is the patron saint of who?",
			a: "Plumbers",
			b: "Bricklayers",
			c: "Roofers",
			d: "Carpenters",
			correct: "1"
		},
		{
			question: "Which country leads the world in cork production?",
			a: "Greece",
			b: "Australia",
			c: "Spain",
			d: "Mexico",
			correct: "2"
		},
		{
			question: "On average, what do you do 15 times a day?",
			a: "Laugh",
			b: "Burp",
			c: "Break wind",
			d: "Lick your lips",
			correct: "0"
		},
		{
			question: "What color was Coca-Cola originally?",
			a: "Red",
			b: "Purple",
			c: "Beige",
			d: "Green",
			correct: "3"
		},
		{
			question: "Bubble gum contains what?",
			a: "Plastic",
			b: "Calcium",
			c: "Rubber",
			d: "Pepper",
			correct: "2"
		},
		{
			question: "The inventor of the paint roller was of which nationality?",
			a: "Hungarian",
			b: "Canadian",
			c: "Norwegian",
			d: "Argentinian",
			correct: "1"
		},
		{
			question: "I am thinking about a number. Which is it?",
			a: "1",
			b: "2",
			c: "3",
			d: "4",
			correct: "" + Math.floor(Math.random() * 4)
		}
	];
	
	var squares1 = {
		squares: [0, 1, 2, 3, 4, 14, 15, 16, 6, 7, 8, 18, 19, 29, 39, 49, 48, 47, 57, 67, 68, 69, 79, 89, 99, 98, 97, 96, 95, 85, 75, 74, 73, 72, 82, 92, 91, 90, 80, 70, 60, 50, 51, 52, 53, 54, 55, 45, 35, 34, 33, 32, 22, 21, 20, 10],
		yellow: [1, 15, 21, 50, 53, 57, 80, 99],
		purple: [4, 6, 20, 39, 55, 73, 75, 79, 96],
		blue: [18, 33, 92],
	};
		
	var squares2 = {
		squares: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 19, 29, 28, 27, 26, 25, 24, 23, 22, 32, 42, 43, 44, 45, 46, 47, 48, 49, 59, 69, 79, 89, 99, 98, 97, 87, 77, 67, 66, 65, 75, 85, 95, 94, 93, 83, 73, 63, 62, 61, 60, 50, 40, 30, 20, 10],
		yellow: [1, 2, 3, 4, 5, 6, 7, 8, 9, 29, 28, 27, 26, 25, 24, 23, 22, 42, 43, 44, 45, 46,47, 48],
		purple: [49, 99, 97, 67, 65, 95, 93, 63, 60],
		blue: [19, 32],
	};
	
	var squares3 = {
		squares: [0, 1, 2, 13, 24, 25, 16, 7, 8, 9, 19, 29, 38, 47, 57, 68, 79, 89, 99, 98, 97, 86, 75, 74, 73, 83, 92, 91, 80, 70, 61, 62, 52, 42, 31, 20, 10],
		yellow: [2, 13, 7, 16, 29, 38, 68, 79, 97, 86, 73, 83, 92, 91, 80, 70, 61, 62, 31, 20],
		purple: [24, 25, 47, 57, 75, 42],
		blue: [99],
	};
	
	createNewBoard = function() {
		board = [];
		var squares;
		
		for (var x = 0; x < numberOfSquares; x++) {	
			for (var y = 0; y < numberOfSquares; y++) {
				board.push({left: x, top: y, color: 'hidden', next: 0, content: ""});
			}
		}
		
		switch (Math.floor(Math.random() * 3)) {
			case 0:
				squares = squares1;
				break;
			case 1:
				squares = squares2;
				break;
			case 2:
				squares = squares3;
				break;
			default:
				squares = squares1;
		}
		
		for (var i = 1; i < squares.squares.length; i++) {
			board[squares.squares[i]].color = 'orange';
			board[squares.squares[i - 1]].next = squares.squares[i];
		}
		
		for (var i = 0; i < squares.yellow.length; i++) {
			board[squares.yellow[i]].color = 'yellow';
		}
		
		for (var i = 0; i < squares.purple.length; i++) {
			board[squares.purple[i]].color = 'purple';
		}
		
		for (var i = 0; i < squares.blue.length; i++) {
			board[squares.blue[i]].color = 'blue';
		}
		
		board[0].color = 'green';
		
		for (var i = 0; i < board.length; i++) {
			if (board[i].color == 'purple') {
				board[i].content = "M";
			} else if (board[i].color == 'blue') {
				board[i].content = "J";
			} else if (board[i].color == 'yellow' || board[i].color == 'red') {
				board[i].content = "P";
			}
		}
	}
	
	createNewBoard();
	
	return {
		reset: function() {
			turn = 0;
			jackpot = 5;
			
			for(var i = 0; i < pawns.length; i++) {
				pawns[i].score = 0;
				pawns[i].location = 0;
				pawns[i].left = 0;
				pawns[i].top = 0;
			}
			
			createNewBoard();
		},
		getBoard: function() {
			return board;
		},
		getTurn: function() {
			return turn;
		},
		setTurn: function(value) {
			turn = value;
		},
		getJackpot: function() {
			return jackpot;
		},
		addJackpot: function(value) {
			jackpot += value;
		},
		resetJackpot: function() {
			jackpot = 5;
		},
		getPawns: function() {
			return pawns;
		},
		setMultiplayer: function() {
			multiplayer = true;
		},
		isMultiplayer: function() {
			return multiplayer;
		},
		getNumberOfSquares: function() {
			return numberOfSquares;
		},
		getMinigame: function() {
			var newMinigame = previousMinigame;
			
			while (newMinigame == previousMinigame) {
				if (multiplayer) {
					newMinigame = multiplayerMinigames[Math.floor(Math.random() * multiplayerMinigames.length)];
				} else {
					newMinigame = Math.floor(Math.random() * minigames.length);
				}
			}
			
			previousMinigame = newMinigame;
			
			return minigames[newMinigame];
		},
		getWord: function() {
			return wordlist[Math.floor(Math.random() * wordlist.length)];
		},
		getTriviaQuestion: function() {
			return triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
		}
	};
});

gameApp.controller('GameController', function($scope, $rootScope, factory, $timeout) {
	var windowWidth = 0;
	var windowHeight = 0;
	var turn = factory.getTurn();
	var timer;
	var dieDisabled = false;
	
	$scope.board = factory.getBoard();
	$scope.pawns = factory.getPawns();
	$scope.scale = 50;
	$scope.boardSize = 500;
	$scope.die = 6;
	$scope.turn = $scope.pawns[turn].name;
	$scope.minigameMessage = false;
	$scope.winCondition = 250;
	$scope.winnerMessage = false;
	$scope.jackpotMessage = false;
	
	//Used to create transition between partitions
	$scope.$on("$routeChangeSuccess", function (scope, next, current) {
        $scope.transitionState = "active"
    });
	
	//Used to scale window
	$rootScope.$watch('windowWidth', function(newWidth, oldWidth) {
		windowWidth = newWidth;
		calculateScale();
	});
	
	//Used to scale window
	$rootScope.$watch('windowHeight', function(newHeight, oldHeight) {
		windowHeight = newHeight;
		calculateScale();
	});
	
	//Used to scale window
	calculateScale = function() {
		var size = windowWidth;
		
		if (windowHeight < windowWidth) {
			size = windowHeight;
		}
		
		$scope.scale = Math.round(size / factory.getNumberOfSquares());
		$scope.boardSize = size;
	}
	
	//Submits multiplayer settings and starts a new game
	$scope.startMultiplayer = function(settings) {
		$scope.pawns[0].type = (settings.red ? "human" : "computer");
		$scope.pawns[1].type = (settings.blue ? "human" : "computer");
		$scope.pawns[2].type = (settings.green ? "human" : "computer");
		$scope.pawns[3].type = (settings.yellow ? "human" : "computer");
		
		factory.setMultiplayer();
		
		window.open("#/gameboard", "_self");
	}
	
	//Rolls the die if a computer is at turn when the gameboard initializes
	initialize = function() {
		if ($scope.pawns[turn].type == 'computer') {
			$scope.rollDie();
		}
		
		$timeout(checkOrientation, 1000);
	}
	
	var previousOrientation = window.orientation;
	
	checkOrientation = function() {
		if (window.orientation != previousOrientation){
			previousOrientation = window.orientation;
			
			if ($scope.pawns[turn].type == 'human') {
				$scope.rollDie();
			}
		}
		
		$timeout(checkOrientation, 100);
	};
	
	//Code to exit app in Phonegap
	$scope.exitApp = function() {
		window.close();
	}
	
	//Starts player turn
	$scope.rollDie = function() {
		if (!checkWinner() && !dieDisabled) {
			dieDisabled = true;
			$scope.die = Math.floor(Math.random() * 6);
			
			if ($scope.die == 0) {
				increaseScore(1);
			}
			
			timer = $timeout(movePawn, 1000);
		}
	}
	
	//Moves pawn over board
	movePawn = function() {
		getNextLocation();
		
		if ($scope.die > 0) {
			$scope.die--;
			timer = $timeout(movePawn, 250);
		} else {
			checkLocation();
			
			if (!checkWinner()) {
				nextPlayer();
			}
		}
    }
	
	//Fetches next square for pawn movement
	getNextLocation = function() {
		increaseScore(1);
	
		var pawn = $scope.pawns[turn];
		var square = $scope.board[$scope.board[pawn.location].next];
		
		pawn.left = square.left;
		pawn.top = square.top;
		pawn.location = $scope.board[pawn.location].next;
	}
	
	//Checks whether an action should occur on the current location
	checkLocation = function() {
		var location = $scope.board[$scope.pawns[turn].location];
	
		if (location.color == 'purple') {
			$scope.minigameMessage = true;
			timer = $timeout(openMinigame, 2000);
		} else if (location.color == 'green') {
			increaseScore(10);
		} else if (location.color == 'yellow') {
			increaseScore(5);
			location.color = 'red';
		} else if (location.color == 'red') {
			increaseScore(-3);
			factory.addJackpot(3);
			location.color = 'yellow';
		} else if (location.color == 'blue') {
			increaseScore(factory.getJackpot());
			$scope.jackpotMessage = "You have won " + factory.getJackpot() + " jackpot points!";
			timer = $timeout(clearJackpotMessage, 2500);
			factory.resetJackpot();
		}
	}
	
	//Fetches player for next turn
	nextPlayer = function() {
		turn++;
		$scope.die = 6;
		if (!$scope.minigameMessage) {
			dieDisabled = false;
		}
		
		if (turn == $scope.pawns.length) {
			turn = 0;
		}
		
		if ($scope.pawns[turn].type == 'computer') {
			$scope.rollDie();
		}
		
		$scope.turn = $scope.pawns[turn].name;
	}
	
	//Increases the score and checks if a player has won
	increaseScore = function(value) {
		$scope.pawns[turn].score += value;
	}
	
	//Checks whether a player has won the game
	checkWinner = function() {
		var gameFinished = false;
		
		for (var i = 0; i < $scope.pawns.length; i++) {
			if ($scope.pawns[i].score >= $scope.winCondition) {
				$scope.winnerMessage = $scope.pawns[i].name + " has won the game!";
				timer = $timeout(resetGame, 2500);
				gameFinished = true;
			}
		}
		
		return gameFinished;
	}
	
	//Opens a minigame
	openMinigame = function() {
		factory.setTurn(turn);
		dieDisabled = false;
		$scope.minigameMessage = false;
		window.open("#/minigame", "_self");
	}
	
	//Clears jackpot message
	clearJackpotMessage = function() {
		$scope.jackpotMessage = false;
	}
	
	//Resets game and returns to start screen
	resetGame = function() {
		factory.reset();
		window.open("#", "_self");
	}

	initialize();
});

gameApp.controller('MinigameController', function($scope, factory, $timeout, $http) {
	$scope.minigame = factory.getMinigame();
	$scope.playerId = 0;
	var timer;
	var running = false;
	
	$scope.onTimeout = function() {
	
		if ($scope.minigame.id == 0) {
			if (running) {
				if ($scope.lettersShown != $scope.word.length) {
					var random = Math.floor(Math.random() * $scope.word.length);
					
					while ($scope.word[random].value == $scope.word[random].letter) {
						random = Math.floor(Math.random() * $scope.word.length);
					}
					
					$scope.word[random].value = $scope.word[random].letter;
					$scope.lettersShown++;
				}
				
				if ($scope.word.length - 3 < Math.random() * $scope.lettersShown) {
					running = false;
					var computer = Math.floor(Math.random() * (factory.getPawns().length - 1)) + 1;
					$scope.minigame.message = factory.getPawns()[computer].name + " has won the game!";
					$scope.showWord();
					factory.getPawns()[computer].score += 5;
					$timeout(backToBoard, 2000);
				}
			
				timer = $timeout($scope.onTimeout, 1000);
			}
		}
	
		if ($scope.minigame.id == 1) {
			
			for (var i = 1; i < 4; i++) {
				if (Math.random() < $scope.stars[i].random) {
					$scope.raiseStar(i);
				}
			}
			
			if (running) {
				timer = $timeout($scope.onTimeout, 100);
			}
		}
		
		if ($scope.minigame.id == 2) {
			$scope.digComputer();
		}
		
		if ($scope.minigame.id == 3) {
			$scope.newRPSGame();
		}
		
		if ($scope.minigame.id == 4) {
			$scope.nextQuestion();
		}
    }
	
	if ($scope.minigame.id == 0) {
		var word = factory.getWord();
		$scope.word = [];
		$scope.started = false;
		$scope.lettersShown = 0;
		
		for (var i = 0; i < word.length; i++) {
			$scope.word.push({id: i, letter: word.charAt(i), value: "?"});
		}
		
		$scope.startGuessTheWord = function() {
			$scope.started = true;
			running = true;
			timer = $timeout($scope.onTimeout, 1000);
		}
		
		$scope.guessWord = function(guess) {
			if (running && guess == word) {
				running = false;
				
				$scope.minigame.message = "You have won the game!";
				$scope.showWord();
				factory.getPawns()[0].score += 5;
				$timeout(backToBoard, 2000);
			}
			
			 document.forms["guessForm"].reset();
		}
		
		$scope.showWord = function() {
			for (var i = 0; i < $scope.word.length; i++) {
				$scope.word[i].value = $scope.word[i].letter;
			}
		}

	}
	
	if ($scope.minigame.id == 1) {
		$scope.minigame.message = "";
		$scope.stars = [
			{id: 0, name: "redstar", top: 80, left: 10, random: (Math.random() * 0.55) + 0.25},
			{id: 1, name: "bluestar", top: 80, left: 30, random: (Math.random() * 0.55) + 0.25},
			{id: 2, name: "greenstar", top: 80, left: 50, random: (Math.random() * 0.55) + 0.25},
			{id: 3, name: "yellowstar", top: 80, left: 70, random: (Math.random() * 0.55) + 0.25},
		];
		
		var won = false;

		$scope.raiseStar = function(id) {
			if (! won) {
				$scope.stars[id].top--;
			
				if ($scope.stars[id].top <= 20) {
					running = false;
					won = true;
					$scope.minigame.message = factory.getPawns()[id].name + " has won!";
					factory.getPawns()[id].score += 5;
					$timeout(backToBoard, 2000);
				} else if (!running) {
					timer = $timeout($scope.onTimeout, 100);
					running = true;
				}
			}
		}
	}
	
	if ($scope.minigame.id == 2) {
		var field = [];
		var turn = 0;
		var rowLength = 5;
		var dug = false;
		
		$scope.minigame.message = factory.getPawns()[turn].name + "'s turn.";
		
		for (var x = 0; x < rowLength; x++) {	
			for (var y = 0; y < rowLength; y++) {
				field.push({id: (x * rowLength) + y, left: x * 50, top: y * 50, shown: false, treasure: false});
			}
		}
		
		field[Math.floor(Math.random() * field.length)].treasure = true;
		
		$scope.dig = function(id) {
			if (!dug && factory.getPawns()[turn].type == "human") {
				field[id].shown = true;
				dug = true;
				
				if (!treasureFound(id)) {
					nextTurn();
				}
			}
		}
		
		$scope.digComputer = function() {
			var random = Math.floor(Math.random() * field.length);
			
			while (field[random].shown) {
				random = (random + 1) % (rowLength * rowLength);
			}
			
			field[random].shown = true;
			
			if (!treasureFound(random)) {
				nextTurn();
			}
		}
		
		treasureFound = function(value) {
			var treasureFound = false;
			
			if (field[value].treasure) {
				$scope.minigame.message = factory.getPawns()[turn].name + " has won!";
				factory.getPawns()[turn].score += 5;
				$timeout(backToBoard, 2000);
				running = false;
				treasureFound = true;
			}
			
			return treasureFound;
		}
		
		nextTurn = function() {
			turn = (turn + 1) % 4;
			$scope.minigame.message = factory.getPawns()[turn].name + "'s turn.";
			
			if (factory.getPawns()[turn].type == "computer") {
				timer = $timeout($scope.onTimeout, 1500);
			} else {
				dug = false;
			}
		}
		
		$scope.field = field;
		
		if (factory.getPawns()[turn].type == "computer") {
			timer = $timeout($scope.onTimeout, 1500);
			dug = true;
		}
	}
	
	if ($scope.minigame.id == 3) {
		$scope.minigame.message = "Make a choice.";
		$scope.players = [];
		var currentPlayer = 0;
		
		for (var i = 0; i < factory.getPawns().length; i++) {
			$scope.players.push(
				{
					id: i,
					name: factory.getPawns()[i].name,
					type: factory.getPawns()[i].type,
					ready: false,
					choice: "none",
					show: false,
					wins: 0
				}
			);
		}
		
		setChoosingMessage = function() {
			if (factory.isMultiplayer()) {
				$scope.choosingMessage = $scope.players[currentPlayer].name + "'s turn - Others look away!";
			} else {
				$scope.choosingMessage = "You";
			}
		}
		
		setNextPlayer = function() {
			currentPlayer++;
			
			if (currentPlayer >= $scope.players.length) {
				currentPlayer = 0;
				checkWinner();
			} else if ($scope.players[currentPlayer].type == "computer" || $scope.players[currentPlayer].ready) {
				setNextPlayer();
			}
		}
		
		$scope.choose = function(choice) {
			if (!$scope.players[currentPlayer].ready) {
				$scope.players[currentPlayer].choice = choice;
				$scope.players[currentPlayer].ready = true;
				
				setNextPlayer();
				setChoosingMessage();
			}
		}
		
		chooseComputer = function() {
			for (var i = 0; i < $scope.players.length; i++) {
				var player = $scope.players[i];
				
				if (player.type != "human") {
					var choices = ["rock", "paper", "scissors"];
					
					player.choice = choices[Math.floor(Math.random() * 3)];
					player.ready = true;
				}
			}
		}
		
		checkWinner = function() {
			var allReady = true;
			var rock = 0;
			var paper = 0;
			var scissors = 0;
			
			for (var i = 0; allReady && i < $scope.players.length; i++) {
				allReady = $scope.players[i].ready;
				
				if ($scope.players[i].choice == "rock") {
					rock++;
				} else if ($scope.players[i].choice == "paper") {
					paper++;
				} else {
					scissors++;
				}
			}
			
			if (allReady) {
			
				showChoices();
			
				if (
					(rock == 0 && paper == 0)
					||(rock == 0 && scissors == 0)
					|| (paper == 0 && scissors == 0)
					|| (rock != 0 && paper != 0 && scissors != 0)
				) {
					$scope.minigame.message = "Draw game!";
				} else {
					if (rock == 0) {
						$scope.minigame.message = "All players with scissors win!";
						increaseWins("scissors");
					} else if (paper == 0) {
						$scope.minigame.message = "All players with rock win!";
						increaseWins("rock");
					} else {
						$scope.minigame.message = "All players with paper win!";
						increaseWins("paper");
					}
				}
				
				var winner = checkGameWinner();
				
				if (winner) {
					$scope.minigame.message = $scope.players[winner - 1].name + " has won the game!";
					factory.getPawns()[winner - 1].score += 5;
					$timeout(backToBoard, 2000);
				} else {				
					timer = $timeout($scope.onTimeout, 1500);
				}
			}
		}
		
		checkGameWinner = function() {
			var winner = false;
			var mostWins = 0;
			var count = 0;
			
			for (var i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i].wins > mostWins) {
					mostWins = $scope.players[i].wins;
				}
			}
			
			if (mostWins >= 3) {
				for (var i = 0; i < $scope.players.length; i++) {
					if ($scope.players[i].wins == mostWins) {
						count++;
						winner = (i + 1);
					}
				}
			}
			
			if (count > 1) {
				winner = false;
			}
			
			return winner;
		}
		
		showChoices = function() {
			for (var i = 0; i < $scope.players.length; i++) {
				$scope.players[i].show = true;
			}
		}
		
		increaseWins = function(choice) {
			for (var i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i].choice == choice) {
					$scope.players[i].wins++;
				}
			}
		}
		
		$scope.newRPSGame = function() {
			for (var i = 0; i < $scope.players.length; i++) {
				$scope.players[i].ready = false;
				$scope.players[i].choice = "none";
				$scope.players[i].show = false;
			}
			
			$scope.minigame.message = "Make a choice.";
			chooseComputer();
			setNextPlayer();
			setChoosingMessage();
		}
		
		chooseComputer();
		setNextPlayer();
		setChoosingMessage();
	}
	
	if ($scope.minigame.id == 4) {
		$scope.triviaQuestion = factory.getTriviaQuestion();
		$scope.players = [];
		var currentPlayer = 0;
		
		for (var i = 0; i < factory.getPawns().length; i++) {
			$scope.players.push(
				{
					id: i,
					name: factory.getPawns()[i].name,
					type: factory.getPawns()[i].type,
					ready: false,
					choice: -1,
					correct: 0
				}
			);
		}
		
		$scope.answer = function(answer) {
			if (!$scope.players[currentPlayer].ready) {
				$scope.players[currentPlayer].choice = answer;
				$scope.players[currentPlayer].ready = true;

				setNextPlayer();
				setMessage();
				if (currentPlayer == 0) {
					if (!checkWinner()) {
						timer = $timeout($scope.onTimeout, 1500);
					}
				}
			}
		}
		
		checkWinner = function() {	
			for (var i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i].choice == $scope.triviaQuestion.correct) {
					$scope.players[i].correct++;
				}
			}
			
			var winner = checkGameWinner();

			if (winner) {
				$scope.minigame.message = $scope.players[winner - 1].name + " has won the game!";
				factory.getPawns()[winner - 1].score += 5;
				$timeout(backToBoard, 2000);
			}
			
			return winner;
		}
		
		checkGameWinner = function() {
			var winner = false;
			var mostCorrect = 0;
			var count = 0;
			
			for (var i = 0; i < $scope.players.length; i++) {
				if ($scope.players[i].correct > mostCorrect) {
					mostCorrect = $scope.players[i].correct;
				}
			}
			
			if (mostCorrect >= 3) {
				for (var i = 0; i < $scope.players.length; i++) {
					if ($scope.players[i].correct == mostCorrect) {
						count++;
						winner = (i + 1);
					}
				}
			}
			
			if (count > 1) {
				winner = false;
			}
			
			return winner;
		}
		
		setNextPlayer = function() {
			currentPlayer++;
			
			if (currentPlayer >= $scope.players.length) {
				currentPlayer = 0;
			} else if ($scope.players[currentPlayer].type == "computer" || $scope.players[currentPlayer].ready) {
				setNextPlayer();
			}
		}
		
		setMessage = function() {
			if (factory.isMultiplayer()) {
				$scope.minigame.message = $scope.players[currentPlayer].name + "'s turn - Others look away!";
			} else {
				$scope.minigame.message = "";
			}
		}
		
		$scope.nextQuestion = function() {
			$scope.triviaQuestion = factory.getTriviaQuestion();

			for (var i = 0; i < $scope.players.length; i++) {
				$scope.players[i].ready = false;
			}
			
			computerAnswer();
			setNextPlayer();
			setMessage();
		}
		
		computerAnswer = function() {
			for (var i = 0; i < $scope.players.length; i++) {
				var player = $scope.players[i];
				
				if (player.type != "human") {
					player.choice = Math.floor(Math.random() * 4);
					player.ready = true;
				}
			}
		}
		
		computerAnswer();
		setNextPlayer();
		setMessage();
	}
	
	backToBoard = function() {
		$scope.minigame.message = "";
		history.back();
	}
});