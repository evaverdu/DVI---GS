var sprites = {
		ship: {sx:0, sy:0, w:38, h:43, frames:1},
		enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
		enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
		enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
		enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
		explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
		missile:{sx: 0, sy: 30, w:2, h:10, frames: 1 }
};

var enemies = {
	basic: { x: 100, y: -50, sprite: 'enemy_purple',
	B: 200, C: 8, E: 100, health:20 }
};

function startGame() { 
	Game.setBoard(0,new TitleScreen("Alien Invasion",
									"Press fire to start playing",
									playGame));
}

var playGame = function() {
	var board = new GameBoard();
	board.add(new PlayerShip());
	board.add(new Enemy(enemies.basic));
	board.add(new Enemy(enemies.basic, { x: 200 }));
	board.add(new Enemy(enemies.basic, { x: 150, y:-100 }));
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
	//Game.setBoard(0, new TitleScreen("Alien Invasion", "Game Started ..."));


// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function() {
	Game.initialize("game",sprites,startGame);
});

