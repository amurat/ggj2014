(function(document) {

var game = new Phaser.Game(900, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render});


  // - - - - - - - - - - - - - - - //
 // - - - - - PRELOADING - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Preload assets
function preload() {
	//LOAD STUFF
  //game.load.tilemap('level1', 'bnb_map1TEST.json', null, Phaser.Tilemap.TILED_JSON);
	
  //LOAD IMAGES
	// game.load.image('block', 'images/block2.png');
  game.load.image('player1Image','../assets/brawny.png');
  game.load.image('player2Image','../assets/brainy.png');
  game.load.image('enemy','../assets/octopus.png');

	//LOAD SOUNDS
	// game.load.audio('thunk','sound/blop_2.wav');
}







  // - - - - - - - - - - - - - - - //
 //- - - - INITIALIZE GAME - - - -//
// - - - - - - - - - - - - - - - //


//- - VARIABLES - - //
//Set up all important game variables (stubs)
var debugging;
var gameState;

var player1;
var enemies;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = false;
  gameState = GAMESTATE_GAMEPLAY;

  player1 = game.add.sprite(100,200,'player1Image');
  player2 = game.add.sprite(100,400,'player2Image');
  enemies = game.add.group();

  //Make some enemies (temporary)
  var startX = 100;
  for(var i=0;i<10;i++)
  {
    enemies.create(Math.random()*600,Math.random()*900,'enemy');
  }

  // - - - RENDERING - - - //
  // levelText = game.add.text(LEVEL_TEXT_OFFSET,UI_TEXT_HEIGHT,"1", STYLE_HUD);
  
  //Add Input Handlers
  document.addEventListener("keydown",keyDownHandler, false);
	document.addEventListener("keyup",keyUpHandler, false);
}



  // - - - - - - - - - - - - - - - //
 //- - - - - GAME LOOP   - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Game Loop
function update() 
{
  //Enable DEBUG mode
  if(keyJustPressed("I")){
    debugging = !debugging;
  }

  //Choose correct state!
	if (gameState == GAMESTATE_GAMEPLAY)
	{
		//User Input
		updateGame();
	}

  //ROUND all values (to fix stupid phaser physics stuff)
  // heroSmart.body.x = Math.round(heroSmart.body.x);
  // heroSmart.body.y = Math.round(heroSmart.body.y);

	//clean out all saved input fields!
	clearInput();
}

//Change Logic
function updateGame(modifier)
{
  var vx = 0;
  var vy = 0;

  if(keyIsDown("&") || keyIsDown("W")) //UP or W
  {
    vy -= PLAYER_SPEED;
  }
  if(keyIsDown("(&)") || keyIsDown("S")) //DOWN or S
  {
    vy += PLAYER_SPEED;
  }
  if(keyIsDown("%") || keyIsDown("A")) //LEFT or A
  {
    vx -= PLAYER_SPEED;
  }
  if(keyIsDown("'") || keyIsDown("D")) //RIGHT or D
  {
    vx += PLAYER_SPEED;
  }

  player1.body.velocity.x = vx;
  player1.body.velocity.y = vy;

  player2.body.velocity.x = vx;
  player2.body.velocity.y = vy;
}


  // - - - - - - - - - - - - - - - //
 //- - - - - -RENDERING  - - - - -//
// - - - - - - - - - - - - - - - //
function render()
{
  if(debugging){
    // game.debug.renderSpriteCoords(heroSmart,30,150);

    // game.debug.renderSpriteCollision(heroSmart,30,550);
    
    // game.debug.renderSpriteBody(heroSmart);
    
    // game.debug.renderText("FPS: " + game.time.fps,100,100,"#FFFFFF","14px Courier");
  }
}


  // - - - - - - - - - - - - - - - //
 //- - - - LEVEL FUNCTIONS - - - -//
// - - - - - - - - - - - - - - - //

//unloads the current level + loads the next level in the array
function nextLevel()
{
}

  // - - - - - - - - - - - - - - - //
 //- - - - -HANDLE INPUT - - - - -//
// - - - - - - - - - - - - - - - //
var keysDown = {};
var keysPressedThisFrame = [];

function keyDownHandler(e)
{
  if(!(e.keyCode in keysDown)){
    keysDown[e.keyCode] = 1; //just pressed
    //keysPressedThisFrame.push(e.keyCode);
  }
  if (e.keyCode == 13 || e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 
			|| e.keyCode == 40) 
	{
    e.preventDefault();
  }
}

function keyUpHandler(e)
{
  delete keysDown[e.keyCode];
}

function keyIsDown(target)
{
  var keyCode = target.charCodeAt(0);
  
  if(keyCode in keysDown){
    return true;
  }
  
  return false;
}

function keyJustPressed(target)
{
  var keyCode = target.charCodeAt(0);
  
  if(keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      return true;
    }
  }
  
  return false;
}

function keyCodeJustPressed(keyCode)
{
  if(keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      return true;
    }
  }
  
  return false;
}

function anyKeyJustPressed()
{
  for(var key in keysDown)
  {
    if(keysDown.hasOwnProperty(key)){
      if(keysDown[key]==1)
        return true;
    }
  }

  return false;
}

function clearInput()
{
  for(var keyCode in keysDown){
    if(keysDown[keyCode] == 1){
      keysDown[keyCode] = 2;
    }
  }
}

})(document);