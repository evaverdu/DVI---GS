var Sprite = function() { }

Sprite.prototype.setup = function(sprite,props) {
	this.sprite = sprite;
	this.merge(props);
	this.frame = this.frame || 0;
	this.w = SpriteSheet.map[sprite].w;
	this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function(props) {
	if(props) {
		for (var prop in props) {
			this[prop] = props[prop];
		}
	}
}

Sprite.prototype.hit = function(damage) {
	this.board.remove(this);
}

Sprite.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y,this.frame);
}

var OBJECT_PLAYER = 1,
	OBJECT_PLAYER_PROJECTILE = 2,
	OBJECT_ENEMY = 4,
	OBJECT_ENEMY_PROJECTILE = 8,
	OBJECT_POWERUP = 16;

///////////////////////////////////////
//Fondo DEL FROGGER
///////////////////////////////////////

var Background = function(){
	this.setup('background',{frame: 0});
	this.x = 0;
	this.y = 0;
}

Background.prototype = new Sprite();
Background.prototype.step = function(dt) {}

///////////////////////////////////////
//Frog
///////////////////////////////////////
var Frog = function(){
	//Variable booleana que sea false 
	//this.setup('frog',{ vx: 0, vy: 0, frame: 0, reloadTime: 0.25, moveX : 40, moveY: 48 });
	this.setup('frog',{ vx: 0, vy: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });
	this.x = Game.width/2 - this.w / 2;
	//this.y = Game.height - 10 - this.h;
	this.y = Game.height - this.h;
	this.reload = this.reloadTime;
	this.delaytime = -1;
	this.dx = 0;
	this.dy = 0;
	this.row = 1;
	this.col = 0;
}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function(dt) {
	//if !this.moving haces lo siengueinte delay ttime(500)
	if(this.delaytime < 0){
		if(Game.keys['left']) 		{ this.vx = -this.maxVel; this.delaytime = 0.3; this.dx = this.x - this.w; }
		else if(Game.keys['right']) { this.vx =  this.maxVel; this.delaytime = 0.3; this.dx = this.x + this.w; }
		else if(Game.keys['up'])	{ this.vy = -this.maxVel; this.delaytime = 0.3; this.row++; this.dy = Game.height - this.h * this.row;}
		else if(Game.keys['down'])	{ this.vy =  this.maxVel; this.delaytime = 0.3; this.row--;  this.dy = Game.height - this.h * this.row;}
		else { this.vx = 0; this.vy = 0;}
	}
	else{
		this.delaytime -= dt;
	}

	this.x += this.vx * dt ;
	if ( ((this.vx < 0) && (this.x < this.dx)) || ((this.vx > 0) && (this.x > this.dx)) ){
		this.x = this.dx;
	}

	this.y += this.vy * dt;
	//console.log (this.vy + " " + this.y + " " + this.dy);
	if ((this.vy < 0) && (this.y < this.dy)){
		this.y = this.dy;
	}
	if((this.vy > 0) && (this.y > this.dy)){
		this.y = this.dy;
	}

	if(this.x < 0) { this.x = 0; }
	else if(this.x > Game.width - this.w) {
		this.x = Game.width - this.w
	}

	if(this.y < 0) { this.y = 0; }
	else if(this.y > Game.height - this.h) {
		this.y = Game.height - this.h
	}
}

Frog.prototype.hit = function(damage) {
	
	if(this.board.remove(this)) {
		this.board.add(new Dead(this.x + this.w/2,
									 this.y + this.h/2));
		loseGame();
	}
		
}

Frog.prototype.onTrunk = function(vt) {
	if(this.board.remove(this)) {
		loseGame();
	}
}

///////////////////////////////////////
//Coche
///////////////////////////////////////
var Car = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Car.prototype = new Sprite();
Car.prototype.type =  OBJECT_ENEMY;
Car.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
									E: 0, F: 0, G: 0, H: 0,
									t: 0 };

Car.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
	this.x += this.vx * dt;
	this.y += this.vy * dt;

	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit(this.damage);
		//this.board.remove(this);
	}

	if(this.y > Game.height ||
		this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Car.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Troncos
///////////////////////////////////////
var Trunk = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Trunk.prototype = new Sprite();
//Trunk.prototype.type =  OBJECT_ENEMY;
Trunk.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
									E: 0, F: 0, G: 0, H: 0,
									t: 0 };

Trunk.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
	this.x += this.vx * dt;
	this.y += this.vy * dt;

	/*
	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit(this.damage);
		//this.board.remove(this);
	}
	*/
	if(this.y > Game.height ||
		this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Trunk.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Tortugas
///////////////////////////////////////
var Turtle = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Turtle.prototype = new Sprite();
//Trunk.prototype.type =  OBJECT_ENEMY;
Turtle.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
									E: 0, F: 0, G: 0, H: 0,
									t: 0 };

Turtle.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
	this.x += this.vx * dt;
	this.y += this.vy * dt;

	/*
	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit(this.damage);
		//this.board.remove(this);
	}
	*/
	if(this.y > Game.height ||
		this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}

Turtle.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

///////////////////////////////////////
//Agua
///////////////////////////////////////
var Water = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Water.prototype = new Sprite();
Water.prototype.type =  OBJECT_ENEMY;

Water.prototype.step = function(dt) {
	
	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit(this.damage);
		//this.board.remove(this);
	}
	
}

Water.prototype.draw = function(ctx) {}

///////////////////////////////////////
//Objeto jugador
///////////////////////////////////////

var PlayerShip = function() {
	this.setup('ship', { vx: 0, frame: 0, reloadTime: 0.25, maxVel: 200 });
	this.x = Game.width/2 - this.w / 2;
	this.y = Game.height - 10 - this.h;
	this.reload = this.reloadTime;

	this.step = function(dt) {
		if(Game.keys['left']) { this.vx = -this.maxVel; }
		else if(Game.keys['right']) { this.vx = this.maxVel; }
		else { this.vx = 0; }

		this.x += this.vx * dt;

		if(this.x < 0) { this.x = 0; }
		else if(this.x > Game.width - this.w) {
			this.x = Game.width - this.w
		}

		this.reload-=dt;
		if(Game.keys['fire'] && this.reload < 0) {
			Game.keys['fire'] = false;
			this.reload = this.reloadTime;
			this.board.add(new PlayerMissile(this.x,this.y+this.h/2));
			this.board.add(new PlayerMissile(this.x+this.w,this.y+this.h/2));
		}
	}
}

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
	if(this.board.remove(this)) {
		loseGame();
	}
}

///////////////////////////////////////
//PLAYER MISSILE
///////////////////////////////////////

var PlayerMissile = function(x,y) {
	this.setup('missile',{ vy: -700, damage:10 });
	// El misil aparece centrado en 'x'
	this.x = x - this.w/2;
	// Con la parte inferior del misil en 'y'
	this.y = y - this.h;

};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt) {
	this.y += this.vy * dt;
	var collision = this.board.collide(this,OBJECT_ENEMY);
	if(collision) {
		collision.hit(this.damage);
		this.board.remove(this);
		
	}
	else if(this.y < -this.h) { this.board.remove(this); }
};

PlayerMissile.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,'missile',this.x,this.y);
};

///////////////////////////////////////
//enemy
///////////////////////////////////////

var Enemy = function(blueprint,override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite,blueprint);
	this.merge(override);
}

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;
Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
									E: 0, F: 0, G: 0, H: 0,
									t: 0 };

Enemy.prototype.step = function(dt) {
	this.t += dt;
	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
	this.x += this.vx * dt;
	this.y += this.vy * dt;

	var collision = this.board.collide(this,OBJECT_PLAYER);
	if(collision) {
		collision.hit(this.damage);
		this.board.remove(this);
	}

	if(this.y > Game.height ||
		this.x < -this.w ||
		this.x > Game.width) {
			this.board.remove(this);
	}
}
Enemy.prototype.draw = function(ctx) {
	SpriteSheet.draw(ctx,this.sprite,this.x,this.y);
}

Enemy.prototype.hit = function(damage) {
	this.health -= damage;
	if(this.health <= 0){
		if(this.board.remove(this)) {
			this.board.add(new Explosion(this.x + this.w/2,
										 this.y + this.h/2));
		}
	}
}

///////////////////////////////////////
//Explosion
///////////////////////////////////////

var Explosion = function(centerX,centerY) {
	this.setup('explosion', { frame: 0 });
	this.x = centerX - this.w/2;
	this.y = centerY - this.h/2;
	this.subFrame = 0;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
	this.frame = Math.floor(this.subFrame++ / 3);
	if(this.subFrame >= 36) {
		this.board.remove(this);
	}
};

///////////////////////////////////////
//Dead animation
///////////////////////////////////////

var Dead = function(centerX,centerY) {
	this.setup('dead', { frame: 0 });
	this.x = centerX - this.w/2;
	this.y = centerY - this.h/2;
	this.subFrame = 0;
};

Dead.prototype = new Sprite();

Dead.prototype.step = function(dt) {
	this.frame = Math.floor(this.subFrame++ / 10);
	if(this.subFrame >= 36) {
		this.board.remove(this);
	}
};