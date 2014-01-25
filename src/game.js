(function(document) {

var game = new Phaser.Game(1000, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render});


  // - - - - - - - - - - - - - - - //
 // - - - - - PRELOADING - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Preload assets
function preload() {
	//LOAD STUFF
  //game.load.tilemap('level1', 'bnb_map1TEST.json', null, Phaser.Tilemap.TILED_JSON);
	
  //LOAD IMAGES
	// game.load.image('block', 'images/block2.png');
  game.load.image('player1Image', ART_ASSETS.PLAYER1);
  game.load.image('player2Image', ART_ASSETS.PLAYER2);
  game.load.image('enemy', ART_ASSETS.ENEMY1);
  game.load.image('enemyInverted', ART_ASSETS.ENEMY2);
  game.load.image('background', ART_ASSETS.BACKGROUND);
  game.load.image('background', ART_ASSETS.MENU_TOP);
  game.load.image('background', ART_ASSETS.MENU_BOTTOM);


	//LOAD SOUNDS
	// game.load.audio('thunk','sound/blop_2.wav');
}







  // - - - - - - - - - - - - - - - //
 //- - - - INITIALIZE GAME - - - -//
// - - - - - - - - - - - - - - - //


//- - VARIABLES - - //
//Set up all important game variables (stubs)
var debugging;
var graphics;
var gameState;

var player1;
var player2;
var enemies1;
var enemies2;
var gameBackground;

//health
var health1;
var health2;

//input
var cursors;
var raiseButton;
var lowerButton;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = true;
  gameState = GAMESTATE_GAMEPLAY;

  //out of 100;
  health1 = 50;
  health2 = 50;

  gameBackground = game.add.sprite(0,0,'background');

  player1 = game.add.sprite(100,200,'player1Image');
  player2 = game.add.sprite(100,600,'player2Image');
  
  enemies1 = game.add.group();
  enemies2 = game.add.group();

  graphics = game.add.graphics(0,0);

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
  raiseButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
  lowerButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
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

function enemyUpdate()
{
    var i = 0;
    enemies1.forEach(function(enemy1) {
        var enemy2 = enemies2.getAt(i);

        // update velocity
        var vx = (2.0 * Math.random() - 1.0)* PLAYER_SPEED;
        var vy = (2.0 * Math.random() - 1.0)* PLAYER_SPEED;

        // resolve world boundary collision
        if(enemy2.body.y+enemy2.body.height > game.height){
          vy = -PLAYER_SPEED;
        }
        if(enemy1.body.x+enemy1.body.width > game.width){
          vx = -PLAYER_SPEED;
        }
        if(enemy1.body.y < enemy1.body.height){
          vy = PLAYER_SPEED;
        }
        if(enemy1.body.x < enemy1.body.width){
          vx = PLAYER_SPEED;
        }

        enemy1.body.velocity.x = vx;
        enemy1.body.velocity.y = vy;
        
        // clone velocity from enemy1 to enemy2
        enemy2.body.velocity = enemy1.body.velocity;
        
        i += 1;
    });
}

//Change Logic
function updateGame(modifier)
{
  //Set VELOCITY by input
  var vx = 0;
  var vy = 0;

  if(cursors.up.isDown) //UP or W
  {
    if(player1.body.y >= 0){
      vy -= PLAYER_SPEED;
    }
  }
  if(cursors.down.isDown) //DOWN or S
  {
    if(player2.body.y+player2.body.height <= game.height){
      vy += PLAYER_SPEED;
    }
  }
  if(cursors.left.isDown) //LEFT or A
  {
    if(player1.body.x >= 0){
      vx -= PLAYER_SPEED;
    }
  }
  if(cursors.right.isDown) //RIGHT or D
  {
    if(player1.body.x+player1.body.height <= game.width){
      vx += PLAYER_SPEED;
    }
  }

  if(raiseButton.isDown){
    if(health1<100) health1 += 1;
    if(health2>0) health2 -= 1;
  }
  if(lowerButton.isDown){
    if(health1>0) health1 -= 1;
    if(health2<100) health2 += 1;
  }

  //Move the player
  player1.body.velocity.x = vx;
  player1.body.velocity.y = vy;

  player2.body.velocity.x = vx;
  player2.body.velocity.y = vy;
  
  enemyUpdate();
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



    //temporary health bars
    var upperY = 50;
    var startX = game.width/2 - BAR_LENGTH/2;

    graphics.clear();

    graphics.beginFill(0x000000);
    graphics.lineStyle(20, 0x000000, 1);

    graphics.moveTo(startX,upperY);
    graphics.lineTo(startX+health1/100*BAR_LENGTH,upperY);
    graphics.endFill();

    graphics.beginFill(0xFFFFFF);
    graphics.lineStyle(20, 0xFFFFFF, 1);
    graphics.moveTo(startX, upperY+MID_LINE);
    graphics.lineTo(startX+health2/100*BAR_LENGTH, upperY+MID_LINE);
    graphics.endFill();
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