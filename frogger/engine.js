///////////////////////////////////////
//Objeto que maneja logica del juego.
/////////////////////////////////////// 
//document.getElementById("game").addEventListener("click", function(){console.log("click")});
var Game = new function() {
	// Inicialización del juego
	// se obtiene el canvas, se cargan los recursos y se llama a callback
	this.initialize = function(canvasElementId, sprite_data, callback) {
		this.canvas = document.getElementById(canvasElementId)
		this.width = this.canvas.width;
		this.height= this.canvas.height;

		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		if(!this.ctx) {
			return alert("Please upgrade your browser to play"); }

		this.setupInput();

		this.loop();

		SpriteSheet.load(sprite_data,callback);
	};

	var KEY_CODES = {13:'enter', 32 :'fire', 37:'left', 38: 'up', 39:'right', 40:'down'};
	this.keys = {};


	this.setupInput = function(){
		window.addEventListener('keydown',function(e) {
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = true;
				e.preventDefault();
			}
		},false);
		window.addEventListener('keyup',function(e) {
			if(KEY_CODES[e.keyCode]) {
				Game.keys[KEY_CODES[e.keyCode]] = false;
				e.preventDefault();
			}
		},false);

	}

	var boards = [];

	this.loop = function(){
		var fps = 60;
		var dt = 1000/fps;

		// Cada pasada borramos el canvas
		Game.ctx.fillStyle = "#000";
		Game.ctx.fillRect(0,0,Game.width,Game.height);

		// y actualizamos y dibujamos todas las entidades
		for(var i=0,len = boards.length;i<len;i++) {
			if(boards[i]) {
				boards[i].step(dt/1000.0);
				boards[i].draw(Game.ctx);
			}
		}

		setTimeout(Game.loop,dt);

	};

	// Change an active game board
	this.setBoard = function(num,board) { boards[num] = board; };
}

///////////////////////////////////////
//Objeto que maneja hoja de sprites.
///////////////////////////////////////
var SpriteSheet = new function() {
	this.map = { };
	this.load = function(spriteData, callback) {
		this.map = spriteData;
		this.image = new Image();
		this.image.onload = callback;
		this.image.src = 'images/sprites.png';
	};
	this.draw = function(ctx,sprite,x,y,frame) {
		var s = this.map[sprite];   
		if(!frame) frame = 0;
		ctx.drawImage(this.image,
							s.sx + frame * s.w,
							s.sy,
							s.w, s.h,
							x, y,
							s.w, s.h);
	};
}

///////////////////////////////////////
//Objeto que define la  pantalla de titulo
///////////////////////////////////////


var TitleScreen = function TitleScreen(title,subtitle,callback) {
	var up = false;

	this.step = function(dt) {
		if( ! Game.keys['fire'] ) up = true;
		if( up && Game.keys['fire'] && callback ) callback();
	};
	this.draw = function(ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.font = "bold 40px bangers";
		ctx.fillText(title,Game.width/2,Game.height/2);
		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle,Game.width/2,Game.height/2 + 140);
	};
};



///////////////////////////////////////
//Tablero juego
///////////////////////////////////////

var GameBoard = function() {
	var board = this;
	// The current list of objects
	this.objects = [];
	this.cnt = {};
	// Add a new object to the object list
	this.add = function(obj) {
		obj.board=this;
		this.objects.push(obj);
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
		return obj;
	}
	// Reset the list of removed objects
	this.resetRemoved = function() { this.removed = []; };
	// Mark an object for removal
	this.remove = function(obj) {
		var idx = this.removed.indexOf(obj);
		if(idx == -1) {
			this.removed.push(obj);
			return true;
		} else {
			return false;
		}
	};
	// Removed an objects marked for removal from the list
	this.finalizeRemoved = function() {
		for(var i=0,len=this.removed.length;i<len;i++) {
			var idx = this.objects.indexOf(this.removed[i]);
			if(idx != -1) {
				this.cnt[this.removed[i].type]--;
				this.objects.splice(idx,1);
			}
		}
	};

	// Call the same method on all current objects
	this.iterate = function(funcName) {
		var args = Array.prototype.slice.call(arguments,1);
		for(var i=0,len=this.objects.length; i < len; i++) {
			var obj = this.objects[i];
			obj[funcName].apply(obj,args);
		}
	};

	// Find the first object for which func is true
	this.detect = function(func) {
		for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
			if(func.call(this.objects[i])) return this.objects[i];
		}
		return false;
	};

	// Call step on all objects and them delete
	// any object that have been marked for removal
	this.step = function(dt) {
		this.resetRemoved();
		this.iterate('step',dt);
		this.finalizeRemoved();
	};
	// Draw all the objects
	this.draw= function(ctx) {
		this.iterate('draw',ctx);
	};

	this.overlap = function(o1,o2) {
		return !((o1.y+o1.h-1 < o2.y) || (o1.y > o2.y+o2.h-1) ||
			(o1.x+o1.w-1 < o2.x) || (o1.x > o2.x+o2.w-1));
	};

	this.collide = function(obj,type) {
		return this.detect(function() {
			if(obj != this) {
				var col = (!type || this.type & type) && board.overlap(obj,this);
				return col ? this : false;
			}
		});
	};


};

///////////////////////////////////////
//Niveles
///////////////////////////////////////
var Level = function(levelData,callback) {
	this.levelData = [];
	for(var i = 0; i < levelData.length; i++) {
		this.levelData.push(Object.create(levelData[i]));
	}
	this.t = 0;
	this.callback = callback;
}

Level.prototype.draw = function(ctx) { }

Level.prototype.step = function(dt) {
	var idx = 0, remove = [], curShip = null;
	// Update the current time offset
	this.t += dt * 1000;
	// Example levelData
	// Start, End, Gap, Type, Override
	// [[ 0, 4000, 500, 'step', { x: 100 } ]

	while((curShip = this.levelData[idx]) && (curShip[0] < this.t + 2000)) {
		// Check if past the end time
		if(this.t > curShip[1]) {
		// If so, remove the entry
			remove.push(curShip);
		} else if(curShip[0] < this.t) {
		// Get the enemy definition blueprint
			var enemy = enemies[curShip[3]],
				override = curShip[4];
			// Add a new enemy with the blueprint and override
			this.board.add(new Enemy(enemy,override));
			// Increment the start time by the gap
			curShip[0] += curShip[2];
		}
		idx++;
	}

	// Remove any objects from the levelData that have passed
	for(var i = 0, len = remove.length; i < len; i++) {
		var idx = this.levelData.indexOf(remove[i]);
		if(idx != -1) this.levelData.splice(idx,1);
	}

	// If there are no more enemies on the board or in
	// levelData, this level is done
	if(this.levelData.length == 0 && this.board.cnt[OBJECT_ENEMY] == 0) {
		if(this.callback) this.callback();
	}
}

///////////////////////////////////////
//Analiticas
///////////////////////////////////////
var analytics = new function(){
	var lastDate = Date.now();
	var time = 0;
	var frames = 0;
	var fps = 0;
	this.step = function(dt){
		var now = Date.now();
		//Ignoramos el dt que nos indica el método loop()
		var dt = (now-lastDate);
		lastDate = now;

		time += dt;
		++frames;

		fps = frames*1000 / time ;

		if(time>5000){
			time = 0;
			frames = 0;
		}
	}
	this.draw = function(ctx){
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "left";
		ctx.font = "bold 16px arial";
		ctx.fillText(Math.round(fps * 100) / 100,0,20);
	}
}
