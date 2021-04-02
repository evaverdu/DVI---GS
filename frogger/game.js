var sprites = {
		title:{sx: 0, sy: 392, w:277, h:171, frames: 1 },
		background: { sx: 421, sy: 0, w: 550, h: 625, frames: 1 },
		frog: {sx:120, sy:340, w:40, h:48, frames:1},
		turtle: { sx: 5, sy: 285, w: 51, h: 47, frames: 4 },
		dead: { sx: 210, sy: 128, w: 48, h: 35, frames: 4 },
		car_1: { sx: 4, sy: 6, w: 99, h: 48, frames: 1 },
		car_2: { sx: 106, sy: 6, w: 99, h: 48, frames: 1 },
		car_3: { sx: 210, sy: 6, w: 99, h: 48, frames: 1  },
		slog: { sx: 268, sy: 169, w: 140, h: 46, frames: 1 },
		mlog: { sx: 5, sy: 119, w: 197, h: 46, frames: 1 },
		blog: { sx: 5, sy: 169, w: 260, h: 46, frames: 1 },
		small_truck: { sx: 5, sy: 62, w: 128, h: 48, frames: 1 },
		big_truck: { sx:146 , sy: 62, w: 206, h: 48, frames: 1 }		
};

var enemies = {
	straight: { x: 0, y: -50, sprite: 'enemy_ship', health: 10,
				E: 100 },
	ltr: { x: 0, y: -100, sprite: 'enemy_purple', health: 10,
				B: 200, C: 1, E: 200 },
	circle: { x: 400, y: -50, sprite: 'enemy_circle', health: 10,
				A: 0, B: -200, C: 1, E: 20, F: 200, G: 1, H: Math.PI/2 },
	wiggle: { x: 100, y: -50, sprite: 'enemy_bee', health: 20,
				B: 100, C: 4, E: 100 },
	step: { x: 0, y: -50, sprite: 'enemy_circle', health: 10,
				B: 300, C: 1.5, E: 60 }
};

var cars = {
	car1: { x: -99, y: 337, sprite: 'car_1', health: 10,
				A: 100 },
	car2: { x: -99, y: 385, sprite: 'car_2', health: 10,
				A: 150 },
	car3: { x: -99, y: 433, sprite: 'car_3', health: 10,
				A: 300 },
	smalltruck: { x: -128, y: 481, sprite: 'small_truck', health: 20,
				A: 150 },
	bigtruck: { x: 550, y: 529, sprite: 'big_truck', health: 10,
				A: -100 }
};

var level1 = [
	// Start, End, Gap, Type, Override
	[ 0, 999999, 3000, 'car1' ],
	[ 0, 999999, 4000, 'car2' ],
	[ 0, 999999, 3000, 'car3' ],
	[ 0, 999999, 5000, 'smalltruck' ],
	[ 0, 999999, 7000, 'bigtruck' ]
	/*
	[ 6000, 13000, 800, 'ltr' ],
	[ 12000, 16000, 400, 'circle' ],
	[ 18200, 20000, 500, 'straight', { x: 150 } ],
	[ 18200, 20000, 500, 'straight', { x: 100 } ],
	[ 18400, 20000, 500, 'straight', { x: 200 } ],
	[ 22000, 25000, 400, 'wiggle', { x: 300 }],
	[ 22000, 25000, 400, 'wiggle', { x: 200 }]
	*/
];

function startGame() { 
	Game.setBoard(0,new TitleScreen("Alien Invasion",
									"Press Enter to start playing",
									playGame));
}

var playGame = function() {
	var board_0 = new GameBoard();
	var board_1 = new GameBoard();
	board_0.add(new Background());
	Game.setBoard(0,board_0);
	board_1.add(new Frog());
	//SpriteSheet.draw(Game.ctx, "car_1", 100,100);
	//board_1.add(new Car(cars.car1));
	board_1.add(new Level(level1,winGame));
	Game.setBoard(1,board_1);
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
