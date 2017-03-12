var app;
var bunny;
var ground;
var gravity = 4;
var bunnySpeed = 5;
var jumpRate = 4, jumpTime = .75, jumpStart;
var isJumping = false;
var isMovingLeft = false;
var isMovingRight = false;
var frog;
var bump;

var newTexture;

function onLoad () {
	console.log("test");
	app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
	document.body.appendChild(app.view);

	// create a new Sprite from an image path
	bunny = PIXI.Sprite.fromImage('images/bunny.png');

	// create a new Sprite for frog
	frog = PIXI.Sprite.fromImage('images/frog.png');
	//ground = PIXI.Sprite.fromImage('images/ground.png');
	var texture = PIXI.Texture.fromImage('images/ground.png');
	ground = new PIXI.extras.TilingSprite(
										    texture, 
										    app.renderer.width,
										    60 // current image is 76px tall, only use 60 to "stretch it"
										);


	var section = new PIXI.Rectangle( 0, 0, 630, 60);
	newTexture = new PIXI.Texture(ground._texture.baseTexture, section);
	ground.texture = newTexture;

	// center the sprite's anchor point
	bunny.anchor.set(0.5, 1);

	//center frog's anchor
	frog.anchor.set(0.5, 1);
	// add flag for hit tests
	frog.caught = false;

	// move ground to bottom of screen
	ground.y = app.renderer.height - ground.height;

	//set frog to ground
	frog.y = ground.y;
	frog.x = app.renderer.width -750; 


	// move the sprite to the center of the screen
	bunny.x = app.renderer.width / 2;
	bunny.y = app.renderer.height / 2;


	app.stage.addChild(ground);
	app.stage.addChild(bunny);
	app.stage.addChild(frog);


	// Listen for animate update
	app.ticker.add(update);

	bump = new Bump(PIXI);
}

function update (delta) {
	//bunny.rotation += 0.1 * delta;

	//check horizontal motion
	if (isMovingLeft){
		bunny.x -= bunnySpeed * delta;
	}

	if (isMovingRight){
		bunny.x += bunnySpeed * delta;
	}

	// check jumping/falling
	if(isJumping){		
		// End of jump
		if(app.ticker.lastTime >= (jumpStart + (jumpTime * 1000))){
			isJumping = false;
		}
		else bunny.y -= jumpRate * delta;
	}
	// Apply gravity when not jumping
	else bunny.y += gravity * delta;

	// Check for falling through ground
	if (bunny.y >= ground.y) {
		bunny.y = ground.y;
	}

	// Check for walking offscreen
	if(bunny.x < 0){
		bunny.x = app.renderer.width;
	} else if(bunny.x > app.renderer.width){
		bunny.x = 0;
	}

	checkCollisions();
}

function checkCollisions(){
	if(!frog.caught && bump.hitTestRectangle(bunny,frog)){
		console.log("touching frog!");
		var tweenSpeed = .35;
		TweenLite.to(frog.scale, tweenSpeed, {x:0, y:0});
		frog.caught = true;
	}
}

function onKeyPress(e){
	console.log("pressed [" + e.key + "]");
	if (e.key == "ArrowLeft"){
		isMovingLeft = true;
	}

	if (e.key == "ArrowRight"){
		isMovingRight = true;
	}

	if (e.key == "ArrowUp" && bunny.y == ground.y){
		console.log("JUMPMAN!");
		isJumping = true;
		jumpStart = app.ticker.lastTime;
	}
}

function onKeyUp(e){
	console.log("released [" + e.key + "]");
	if (e.key == "ArrowLeft"){
		isMovingLeft = false;
	}

	if (e.key == "ArrowRight"){
		isMovingRight = false;
	}

}








