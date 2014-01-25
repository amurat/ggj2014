(function(document) {

var game = new Phaser.Game(1000, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render});


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
  game.load.image('enemyInverted','../assets/octopus_invert.png');

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
var cursors;

var player1;
var enemies;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = true;
  gameState = GAMESTATE_GAMEPLAY;

  player1 = game.add.sprite(100,200,'player1Image');
  player2 = game.add.sprite(100,400,'player2Image');
  enemies1 = game.add.group();
  enemies2 = game.add.group();

  //Make some enemies (temporary)
  var numEnemiesPerGroup = 10;
  var size= {width: game.width, height:game.height / 2}
  
  for(var i=0;i<numEnemiesPerGroup;i++)
  {
    enemies1.create(Math.random()*size.width, Math.random()*size.height,'enemy');
  }

  var offset =  {x: 0, y: game.height / 2};
  for(var i=0;i<numEnemiesPerGroup;i++)
  {
    var enemyToClone = enemies1.getAt(i);
    enemies2.create(offset.x + enemyToClone.x, offset.y + enemyToClone.y, 'enemyInverted');
  }

  
  
  // - - - RENDERING - - - //
  // levelText = game.add.text(LEVEL_TEXT_OFFSET,UI_TEXT_HEIGHT,"1", STYLE_HUD);
  
  //Add Input Handlers
 //  document.addEventListener("keydown",keyDownHandler, false);
	// document.addEventListener("keyup",keyUpHandler, false);

  cursors = game.input.keyboard.createCursorKeys();
}



  // - - - - - - - - - - - - - - - //
 //- - - - - GAME LOOP   - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Game Loop
function update() 
{
  //Toggle DEBUG mode
  // if(keyJustPressed("I")){
  //   debugging = !debugging;
  // }

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

  if(cursors.up.isDown) //UP or W
  {
    vy -= PLAYER_SPEED;
  }
  if(cursors.down.isDown) //DOWN or S
  {
    vy += PLAYER_SPEED;
  }
  if(cursors.left.isDown) //LEFT or A
  {
    vx -= PLAYER_SPEED;
  }
  if(cursors.right.isDown) //RIGHT or D
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
    
    game.debug.renderText("FPS: " + game.time.fps,5,20,"#FFFFFF","20px Courier");
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
/*
  IMPORTANT: This is ROHIT's hack for input, which seems to cause minor lag. 
      Use only if we need keyJustPressed() and the PHASER way is not working
*/

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