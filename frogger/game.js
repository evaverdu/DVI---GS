var sprites = {
		title:{sx: 0, sy: 392, w:277, h:171, frames: 1 },
		background: { sx: 421, sy: 0, w: 550, h: 625, frames: 1 },
		frog: {sx:38, sy:341, w:40, h:36, frames:1},
		turtle: { sx: 5, sy: 285, w: 51, h: 47, frames: 4 },
		dead: { sx: 210, sy: 128, w: 48, h: 35, frames: 4 },
		car1: { sx: 3, sy: 6, w: 99, h: 49, frames: 1 },
		car2: { sx: 3, sy: 106, w: 99, h: 49, frames: 1 },
		car3: { sx: 3, sy: 210, w: 99, h: 49, frames: 1  },
		slog: { sx: 268, sy: 169, w: 140, h: 46, frames: 1 },
		mlog: { sx: 5, sy: 119, w: 197, h: 46, frames: 1 },
		blog: { sx: 5, sy: 169, w: 260, h: 46, frames: 1 },
		smalltruck: { sx: 5, sy: 58, w: 131, h: 54, frames: 1 },
		bigtruck: { sx:143 , sy: 58, w: 210, h: 54, frames: 1 }		
};

var enemies = {
	basic: { x: 100, y: -50, sprite: 'slog',
	B: 200, C: 8, E: 100, health:20 }
};

function startGame() { 
	Game.setBoard(0,new TitleScreen("Alien Invasion",
									"Press Enter to start playing",
									playGame));
}

var playGame = function() {
	var board = new GameBoard();
	board.add(new Background());
	board.add(new Frog());
	Game.setBoard(0,board);
};

var winGame = function() {
	Game.setBoard(0,new TitleScreen("You win!",
	"Press fire to play again",
	playGame));
};

var loseGame = function() {
	Game.setBoard(0,new TitleScreen("You lose!",
	"Press fire to play again",
	playGame));
};

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
	Game.initialize("game",sprites,playGame);
});
