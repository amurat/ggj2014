(function(document) {

var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});


  // - - - - - - - - - - - - - - - //
 // - - - - - PRELOADING - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Preload assets
function preload() {
	//LOAD STUFF
  //game.load.tilemap('level1', 'bnb_map1TEST.json', null, Phaser.Tilemap.TILED_JSON);
	
  //LOAD IMAGES
	// game.load.image('block', 'images/block2.png');
  //game.load.image('player1Image', ART_ASSETS.PLAYER1);
  //game.load.image('player2Image', ART_ASSETS.PLAYER2);
  game.load.image('enemy', ART_ASSETS.ENEMY1);
  game.load.image('enemyInverted', ART_ASSETS.ENEMY2);
  game.load.image('background', ART_ASSETS.BACKGROUND);
  game.load.image('menuTop', ART_ASSETS.MENU_TOP);
  game.load.image('menuBottom', ART_ASSETS.MENU_BOTTOM);

  game.load.atlasJSONHash('player1', ART_ASSETS.PLAYER1.SPRITESHEET, ART_ASSETS.PLAYER1.JSON);
  game.load.atlasJSONHash('player2', ART_ASSETS.PLAYER2.SPRITESHEET, ART_ASSETS.PLAYER2.JSON);
  game.load.atlasJSONHash('char1', ART_ASSETS.CHAR1.SPRITESHEET, ART_ASSETS.CHAR1.JSON);
  game.load.atlasJSONHash('char2', ART_ASSETS.CHAR2.SPRITESHEET, ART_ASSETS.CHAR2.JSON);

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
var currentLevel;
var levelTimer;
var resetting;

var player1;
var player2;
var enemies1;
var enemies2;
var gameBackground;

var numEnemiesPerGroup;
var cloneEnemies1ToEnemies2;

//health
var health1;
var health2;

//input
var cursors;
var raiseButton;
var lowerButton;
var resetButton;
var nextButton;

//formatting
var levelText;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = true;
  resetting = false;
  gameState = GAMESTATE_GAMEPLAY;
  currentLevel = 1;

  levelTimer = new Phaser.Timer(game);

  gameBackground = game.add.sprite(0, 0, 'background');
  gameHUD = game.add.group();
  gameHUD.create(10, 10, 'menuTop');
  gameHUD.create(10, 410, 'menuBottom');

  //out of 100;
  health1 = 50;
  health2 = 50;

  cloneEnemies1ToEnemies2 = false;
  numEnemiesPerGroup = 22;
  enemies1 = game.add.group();
  enemies2 = game.add.group();

  player1 = game.add.sprite(PLAYER_START_X,PLAYER1_START_Y,'player1');
  player1.anchor = new Phaser.Point(0.5,0.5);
  player1.animations.add('walk');
  player1.animations.add('stand', [2]);

  player2 = game.add.sprite(PLAYER_START_X,PLAYER2_START_Y,'player2');
  player2.anchor = new Phaser.Point(0.5,0.5);
  player2.animations.add('walk');
  player2.animations.add('stand', [2]);

  graphics = game.add.graphics(0,0);

  loadLevel();

  
  
  // - - - RENDERING - - - //
  levelText = game.add.text(500,360,"0", STYLE_HUD);

  // - - - - INPUT - - - - //
  cursors = game.input.keyboard.createCursorKeys();
  raiseButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
  lowerButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
  resetButton = game.input.keyboard.addKey(Phaser.Keyboard.L);
  resetButton.onDown.add(reset,this);
  resetButton = game.input.keyboard.addKey(Phaser.Keyboard.N);
  resetButton.onDown.add(nextLevel,this);
}

function createEnemies()
{
  //Make some enemies (temporary)
  var size= {width: game.width, height:game.height / 2}
  var exclusionZoneSize = {width: 10, height: 10};
  for(var i=0;i<numEnemiesPerGroup;i++)
  {
    var x = Math.random()*size.width;
    var y = Math.random()*size.height;
    var enemy = enemies1.create(x, y,'char1');
    x = Math.max(2.0 * enemy.body.width, Math.min(x, size.width - 2.0 * enemy.body.width));
    y = Math.max(2.0 * enemy.body.width, Math.min(y, size.height - 2.0 * enemy.body.height));
    enemy.x = x;
    enemy.y = y;
    var vx = (2.0 * Math.random() - 1.0)* ENEMY_SPEED;
    var vy = (2.0 * Math.random() - 1.0)* ENEMY_SPEED;
    enemy.body.velocity.x = vx;
    enemy.body.velocity.y = vy;
    enemy.anchor = new Phaser.Point(0.5,0.5);
    enemy.angle = Math.random() * 360.0;
    enemy.animations.add('walk');
    enemy.animations.add('stand', [2]);
    enemy._lastDecisionOffset = 1000 * (2.0 * Math.random() - 1.0);
    enemy._lastDecisionTime = game.time.now;
  }

  // clone initial enemies1 states to enemy2
  var offset =  {x: 0, y: game.height / 2};
  for(var i=0;i<numEnemiesPerGroup;i++)
  {
    var enemyToClone = enemies1.getAt(i);
    var enemy = enemies2.create(offset.x + enemyToClone.x, offset.y + enemyToClone.y, 'char2');
    enemy.body.velocity = enemyToClone.body.velocity;
    enemy.angle = enemyToClone.angle;
    enemy.anchor = new Phaser.Point(0.5,0.5);
    enemy.animations.add('walk');
    enemy.animations.add('stand', [2]);
  }
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

    if(gameState == GAMESTATE_END){
      clearGame();
    }
	}
  else if(gameState == GAMESTATE_END)
  {
    console.log("END STATE");

    if(resetting)
    {
      resetting = false;
      resetGame();
    }
  }

  //ROUND all values (to fix stupid phaser physics stuff)
  // heroSmart.body.x = Math.round(heroSmart.body.x);
  // heroSmart.body.y = Math.round(heroSmart.body.y);
}

function enemyEnemyCollisionHandler(enemyA, enemyB) {
    // handle collision here
}

function enemyEnemyCollisionUpdate()
{
    // do overlap test for enemies1
   game.physics.collide(enemies1, enemies1, enemyEnemyCollisionHandler, null, this);
}

function enemyUpdate()
{
    enemyEnemyCollisionUpdate();
    
    function processEnemy(enemy1, top) {
        var filterFactor = 0.8;

        var elapsedTimeSinceLastDecision = (game.time.now+enemy1._lastDecisionOffset) - enemy1._lastDecisionTime ;
        if (elapsedTimeSinceLastDecision > ENEMY_DECISION_PERIOD_MS) {
            var dx = (2.0 * Math.random() - 1.0);
            var dy = (2.0 * Math.random() - 1.0);
            var magnitude = Math.sqrt(dx*dx + dy*dy);
            vx = dx/magnitude * ENEMY_SPEED;
            vy = dy/magnitude * ENEMY_SPEED;
            enemy1._lastDecisionTime = game.time.now+enemy1._lastDecisionOffset;
        } else {
            vx = enemy1.body.velocity.x;
            vy = enemy1.body.velocity.y;
        }

        // resolve world boundary collision
        if (top) {
            if(enemy1.body.y+enemy1.body.height > game.height/2.0){
                vy = -ENEMY_SPEED;
            }
        } else {
            if(enemy1.body.y+enemy1.body.height > game.height){
                vy = -ENEMY_SPEED;
            }
        }
        if(enemy1.body.x+enemy1.body.width > game.width){
          vx = -ENEMY_SPEED;
        }
        if (top) {
            if(enemy1.body.y < enemy1.body.height){
                vy = ENEMY_SPEED;
            }
        } else {
            if(enemy1.body.y < (enemy1.body.height + game.height/2.0)){
                vy = ENEMY_SPEED;
            }
        }
        if(enemy1.body.x < enemy1.body.width){
          vx = ENEMY_SPEED;
        }
        
        enemy1.body.velocity.x = (filterFactor * vx) + (1.0 - filterFactor) * enemy1.body.velocity.x;
        enemy1.body.velocity.y = (filterFactor * vy) + (1.0 - filterFactor) * enemy1.body.velocity.y;
        
        var angleFilterFactor = 1.0;
        
        if(vx != 0 || vy != 0){
          var ang = Phaser.Math.radToDeg(Math.atan2(enemy1.body.velocity.y, enemy1.body.velocity.x));
          enemy1.angle = angleFilterFactor * ang + (1.0 - angleFilterFactor) * enemy1.angle;
          enemy1.animations.play('walk', CHAR_WALK_ANIMATION_FPS, true);
        } else {
            enemy1.animations.play('stand');
        }
    }
    
    enemies1.forEach(function(enemy1) {
        processEnemy(enemy1, true);
    });
    
    if (cloneEnemies1ToEnemies2) {
        var i = 0;
        // copy enemy states from enemy1 to enemy2
        enemies1.forEach(function(enemy1) {
            var enemy2 = enemies2.getAt(i);
            // clone velocity from enemy1 to enemy2
            enemy2.body.velocity = enemy1.body.velocity;
            enemy2.angle = enemy1.angle;
        
            if(enemy2.body.velocity.x != 0 || enemy2.body.velocity.y != 0){
              enemy2.animations.play('walk', CHAR_WALK_ANIMATION_FPS, true);
            } else {
                enemy2.animations.play('stand');
            }
            i += 1;
        });
    } else {
        enemies2.forEach(function(enemy2) {
            processEnemy(enemy2, false);
        });
    }    
}

//Change Logic
function updateGame(modifier)
{
  playerUpdate();

  healthUpdate()
  
  enemyUpdate();

  var secondsElapsed = levelTimer.seconds()
  if(secondsElapsed > LEVEL_TIME)
  {
    resetLevel();
  }
  else
  {
    levelText.content = Math.floor(secondsElapsed);
  }

  if(resetting)
  {
    resetting = false;
    resetLevel();
  }
}

function playerUpdate()
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

  //Normalize movement vector
  if (vx != 0 && vy != 0) {
    vx = vx / 1.4; //approx sqrt of 2
    vy = vy / 1.4; //approx sqrt of 2
    console.log('angle');
  }


  //If moving, change ROTATION and ANIMATION based on velocity
  if(vx != 0 || vy != 0){
    var ang = Phaser.Math.radToDeg(Math.atan2(vy,vx));
    player1.angle = ang;
    player2.angle = ang;

    player1.animations.play('walk', PLAYER_WALK_ANIMATION_FPS, true);
    player2.animations.play('walk', PLAYER_WALK_ANIMATION_FPS, true);
  } else {
    player1.animations.play('stand');
    player2.animations.play('stand');
  }

    //Move the player
  player1.body.velocity.x = vx;
  player1.body.velocity.y = vy;

  player2.body.velocity.x = vx;
  player2.body.velocity.y = vy;
}

function healthUpdate(){
  //Adjust health based on collision
  if(game.physics.overlap(player1,enemies1)){
    health1 -= STRONG_EFFECT;
    health2 += STRONG_EFFECT;
  }else{
    health1 += WEAK_EFFECT;
    health2 -= WEAK_EFFECT;
  }

  //DEBUG: Manually change the health 
  if(debugging){
    if(raiseButton.isDown){
      health1 += 2*STRONG_EFFECT;
      health2 -= 2*STRONG_EFFECT;
    }else if(lowerButton.isDown){
      health1 -= 2*STRONG_EFFECT;
      health2 += 2*STRONG_EFFECT;
    }
  }

  //check end state
  if(health1 >= 100) endGame("extrovert");
  if(health1 <= 0) endGame("introvert");

  //clamp health
  // if(health1 > 100){
  //   health1 = 100;
  // }
  // else if(health1 < 0){
  //   health1 = 0;
  // }
  // if(health2 > 100){
  //   health2 = 100;
  // }
  // else if(health2 < 0){
  //   health2 = 0;
  // }
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
    
    // game.debug.renderQuadTree(game.physics.quadTree);
    
    game.debug.renderText("FPS: " + game.time.fps,5,20,"#FFFFFF","20px Courier");



    //temporary health bars
    var upperY = 20;
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

//fires when "L" button is pressed
function reset()
{
  resetting = true;
}


  // - - - - - - - - - - - - - - - //
 //- - - - LEVEL FUNCTIONS - - - -//
// - - - - - - - - - - - - - - - //

//unloads the current level + loads the next level in the array
function nextLevel()
{
  clearLevel();
  currentLevel++;
  numEnemiesPerGroup += 2;
  loadLevel();
}

function resetLevel()
{
  console.log("resetting level");
  clearLevel();
  loadLevel();
}

function loadLevel()
{
  createEnemies();
  // console.log("Level does not exist");

  levelTimer.start();
}

function clearLevel()
{
  //reset values
  health1 = 50;
  health2 = 50;

  enemies1.removeAll();
  enemies2.removeAll();

  //Reset players
  player1.x = PLAYER_START_X;
  player1.y = PLAYER1_START_Y;
  player2.x = PLAYER_START_X;
  player2.y = PLAYER2_START_Y;

  player1.body.velocity = new Phaser.Point(0,0);
  player1.angle = 0;
  player2.body.velocity = new Phaser.Point(0,0);
  player2.angle = 0;

  levelTimer.stop();
}

function endGame(endType)
{
  gameState = GAMESTATE_END;

  if(endType == "extrovert"){
    console.log("extrovert");
  }
  else if(endType == "introvert"){
    console.log("introvert");
  }
}

function resetGame()
{
  gameState = GAMESTATE_GAMEPLAY;

  console.log("resetting game");

  player1.revive();
  player2.revive();

  resetLevel();
}

function clearGame()
{
  enemies1.removeAll();
  enemies2.removeAll();

  player1.kill();
  player2.kill();
}


})(document);