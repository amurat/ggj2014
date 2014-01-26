(function(document) {

var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});


  // - - - - - - - - - - - - - - - //
 // - - - - - PRELOADING - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Preload assets
function preload() {
	//LOAD STUFF
  game.load.image('background', ART_ASSETS.BACKGROUND);
  game.load.image('menuTop', ART_ASSETS.MENU_TOP);
  game.load.image('menuBottom', ART_ASSETS.MENU_BOTTOM);
  game.load.image('particleNeg', ART_ASSETS.PARTICLE_NEG);
  game.load.image('particlePos', ART_ASSETS.PARTICLE_POS);
  game.load.image('particle', ART_ASSETS.PARTICLE);
  game.load.image('speechNeg', ART_ASSETS.SPEECH_NEG);
  game.load.image('speechPos', ART_ASSETS.SPEECH_POS);

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
var nexting;

var player1;
var player2;
var enemies1;
var enemies2;
var gameBackground;

var numEnemies1;
var numEnemies2;
var cloneEnemies1ToEnemies2;
var enemyAttractionFactor;
var enemyRepulsionFactor;

//health
var health1;
var health2;
var plusEffect;
var minusEffect;

//input
var cursors;
var raiseButton;
var lowerButton;
var resetButton;
var nextButton;

//formatting
var levelText;
var screenText;
// var instructionText;
var speech1;
var speech2;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = true;
  resetting = false;
  nexting = false;
  gameState = GAMESTATE_START;
  currentLevel = 1;

  levelTimer = new Phaser.Timer(game);

  gameBackground = game.add.sprite(0, 0, 'background');
  gameHUD = game.add.group();
  gameHUD.create(10, 10, 'menuTop');
  gameHUD.create(10, 410, 'menuBottom');

  //out of 100;
  health1 = 50;
  health2 = 50;
  plusEffect = .16;
  minusEffect = .09;

  enemyAttractionFactor = 0.0;
  enemyRepulsionFactor = 0.0;
  
  cloneEnemies1ToEnemies2 = false;
  numEnemies1 = 22;
  numEnemies2 = 22;
  enemies1 = game.add.group();
  enemies2 = game.add.group();

  // Player 1
  player1 = game.add.sprite(PLAYER_START_X,PLAYER1_START_Y,'player1');
  player1.anchor = new Phaser.Point(0.5,0.5);
  player1.body.setSize(32, 32, 9, 9);
  player1.animations.add('walk-happy', [4, 5, 2, 5]);
  player1.animations.add('walk-sad', [1, 0, 3, 0]);
  player1.animations.add('stand', [5]);
  player1.happy = true;
  
  // Particle Setup 1
  player1.p = game.add.emitter(game.world.centerX, player1.body.x, player1.body.y);
  player1.p.gravity = -20;
  player1.p.setRotation(0, 0);
  player1.p.makeParticles('particle', [0], 1500, 1);

  // Player 2
  player2 = game.add.sprite(PLAYER_START_X,PLAYER2_START_Y,'player2');
  player2.anchor = new Phaser.Point(0.5,0.5);
  player2.body.setSize(40, 40, 5, 5);
  player2.animations.add('walk-happy', [4, 5, 2, 5]);
  player2.animations.add('walk-sad', [1, 0, 3, 0]);
  player2.animations.add('stand', [0]);
  player2.happy = true;
  // Particle Setup 2
  player2.p = game.add.emitter(game.world.centerX, player2.body.x, player2.body.y);
  player2.p.gravity = -20;
  player2.p.setRotation(0, 0);
  player2.p.makeParticles('particle', [0], 1500, 1);


  // - - - RENDERING - - - //
  graphics = game.add.graphics(0,0);
  
  levelText = game.add.text(500,360,"0", STYLE_HUD);
  levelText.visible = false;
  screenText = game.add.text(500,360,"PRESS R TO TRY AGAIN", STYLE_HUD);
  screenText.visible = false;
  // instructionText = game.add.text(500,360,"THESE ARE INSTRUCTIONS", STYLE_HUD);
  // instructionText.visible = false;

  speech1 = game.add.sprite(0,0,'speechPos');
  speech1.visible = false;
  speech2 = game.add.sprite(0,0,'speechNeg');
  speech2.visible = false;

  drawTitleScreen();

  // - - - - INPUT - - - - //
  cursors = game.input.keyboard.createCursorKeys();
  raiseButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
  lowerButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
  resetButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
  resetButton.onDown.add(reset,this);
  nextButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  nextButton.onDown.add(next,this);
}

function createEnemies()
{
  //Make some enemies (temporary)
  var size= {width: game.width, height:game.height / 2}
  var exclusionZoneSize = {width: 10, height: 10};
  
  function buildEnemyGroup(enemies, numEnemies, top) {
      var offset = {x: 0, y: 0};
      if (!top) {
          offset.y += game.height / 2;
      }
      for(var i=0;i<numEnemies;i++)
      {
        var x = game.rnd.frac()*size.width;
        var y = game.rnd.frac()*size.height;
        var spriteName;
        if (top) {
            spriteName = 'char1'
        } else {
            spriteName = 'char2'
        }
        var enemy = enemies.create(x, y, spriteName);
        x = Math.max(2.0 * enemy.body.width, Math.min(x, size.width - 2.0 * enemy.body.width));
        y = Math.max(2.0 * enemy.body.width, Math.min(y, size.height - 2.0 * enemy.body.height));
        enemy.x = x + offset.x;
        enemy.y = y + offset.y;
        var vx = (2.0 * game.rnd.frac() - 1.0)* ENEMY_SPEED;
        var vy = (2.0 * game.rnd.frac() - 1.0)* ENEMY_SPEED;
        enemy.body.velocity.x = vx;
        enemy.body.velocity.y = vy;
        enemy.anchor = new Phaser.Point(0.5,0.5);
        enemy.angle = game.rnd.frac() * 360.0;
        enemy.animations.add('walk');
        enemy.animations.add('stand', [2]);
        enemy._lastDecisionOffset = 1000 * (2.0 * game.rnd.frac() - 1.0);
        enemy._lastDecisionTime = game.time.now;
      }
  }
  
  buildEnemyGroup(enemies1, numEnemies1, true);
  
  if (cloneEnemies1ToEnemies2 && (numEnemies1 == numEnemies2)) {
      // clone initial enemies1 states to enemy2
      var offset =  {x: 0, y: game.height / 2};
      for(var i=0;i<numEnemies1;i++)
      {
        var enemyToClone = enemies1.getAt(i);
        var enemy = enemies2.create(offset.x + enemyToClone.x, offset.y + enemyToClone.y, 'char2');
        enemy.body.velocity.x = enemyToClone.body.velocity.x;
        enemy.body.velocity.y = enemyToClone.body.velocity.y;
        enemy.angle = enemyToClone.angle;
        enemy.anchor = new Phaser.Point(0.5,0.5);
        enemy.animations.add('walk');
        enemy.animations.add('stand', [2]);
        enemy._lastDecisionOffset = 1000 * (2.0 * game.rnd.frac() - 1.0);
        enemy._lastDecisionTime = game.time.now;
      }
  } else {
      buildEnemyGroup(enemies2, numEnemies2, false);
      if (cloneEnemies1ToEnemies2) {
          console.log("numEnemies1 != numEnemies2 : decoupling state");
      }
  }
}



  // - - - - - - - - - - - - - - - //
 //- - - - - GAME LOOP   - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Game Loop
function update() 
{

  //Choose correct state!
  if(gameState == GAMESTATE_START)
  {
    if(nexting){
      nexting = false;
      gameState = GAMESTATE_INSTRUCTIONS;
    }

    if(gameState == GAMESTATE_INSTRUCTIONS){
      drawInstructionScreen();
    }
  }
  else if(gameState == GAMESTATE_INSTRUCTIONS)
  {
    if(nexting){
      nexting = false;
      gameState = GAMESTATE_SCREEN;
    }

    if(gameState == GAMESTATE_SCREEN){
      drawLevelScreen();
    }
  }
	else if (gameState == GAMESTATE_GAMEPLAY)
	{
		//User Input
		updateGame();

    renderGame();

    if(gameState == GAMESTATE_SCREEN){
      drawLevelScreen();
    }
    else if(gameState == GAMESTATE_END){
      clearGame();
      drawEndScreen();
    }
	}
  else if(gameState == GAMESTATE_SCREEN)
  {
    updateScreen();

    if(gameState == GAMESTATE_GAMEPLAY){
      screenText.visible = false;
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

    if(gameState == GAMESTATE_GAMEPLAY){
      screenText.visible = false;
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
    
    function processEnemy(enemy1, top, player) {
        var filterFactor = 0.8;

        var vx = 0;
        var vy = 0;
        var elapsedTimeSinceLastDecision = (game.time.now+enemy1._lastDecisionOffset) - enemy1._lastDecisionTime ;
        if (elapsedTimeSinceLastDecision > ENEMY_DECISION_PERIOD_MS) {
            var dx = (2.0 * game.rnd.frac() - 1.0);
            var dy = (2.0 * game.rnd.frac() - 1.0);
            var magnitude = Math.sqrt(dx*dx + dy*dy);
            vx = dx/magnitude * ENEMY_SPEED;
            vy = dy/magnitude * ENEMY_SPEED;
            enemy1._lastDecisionTime = game.time.now+enemy1._lastDecisionOffset;
        } else {
            vx = enemy1.body.velocity.x;
            vy = enemy1.body.velocity.y;
        }

        // handle player attraction
        function computeAttraction() {
            var attractionRadius = 0.5;
            var vx = 0;
            var vy = 0;
            var enemyAttractionPower = enemyAttractionFactor * ENEMY_SPEED;
            var dx = player.body.x - enemy1.body.x;
            var dy = player.body.y - enemy1.body.y;
            var squaredMagnitude = dx*dx + dy*dy;
            var magnitude = Math.sqrt(squaredMagnitude);
            if (magnitude > attractionRadius) {
                vx += dx * (enemyAttractionPower / magnitude);
                vy += dy * (enemyAttractionPower / magnitude);
            }
            return {x : vx, y: vy};
        }
        if (enemyAttractionFactor > 0 || enemyRepulsionFactor > 0) {
            var attraction = computeAttraction();
            vx = enemyAttractionFactor * attraction.x + (1.0 - enemyAttractionFactor) * vx;
            vy = enemyAttractionFactor * attraction.y + (1.0 - enemyAttractionFactor) * vy;
        }        
        // handle player repulsion
        function computeRepulsion() {
            var repulsionRadius = 0.5;
            var vx = 0;
            var vy = 0;
            var enemyRepulsionPower = enemyRepulsionFactor * ENEMY_SPEED;
            var dx = player.body.x - enemy1.body.x;
            var dy = player.body.y - enemy1.body.y;
            var squaredMagnitude = dx*dx + dy*dy;
            var magnitude = Math.sqrt(squaredMagnitude);
            if (magnitude > repulsionRadius) {
                vx -= dx * (enemyRepulsionPower / magnitude);
                vy -= dy * (enemyRepulsionPower / magnitude);
            }
            return {x : vx, y: vy};
        }
        if (enemyRepulsionFactor > 0) {
            var repulsion = computeRepulsion();
            vx = enemyRepulsionFactor * repulsion.x + (1.0 - enemyRepulsionFactor) * vx;
            vy = enemyRepulsionFactor * repulsion.y + (1.0 - enemyRepulsionFactor) * vy;
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
        
        var angleFilterFactor = 0.1;
        
        if(vx != 0 || vy != 0){
          var ang = Phaser.Math.radToDeg(Math.atan2(enemy1.body.velocity.y, enemy1.body.velocity.x));
          enemy1.angle = angleFilterFactor * ang + (1.0 - angleFilterFactor) * enemy1.angle;
          enemy1.animations.play('walk', CHAR_WALK_ANIMATION_FPS, true);
        } else {
            enemy1.animations.play('stand');
        }
    }
    
    enemies1.forEach(function(enemy1) {
        processEnemy(enemy1, true, player1);
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
        enemies2.forEach(function(enemy) {
            processEnemy(enemy, false, player2);
        });
    }   
    
    /*
    // test enemy desync
    var i = 0;
    enemies1.forEach(function(enemy1) {
        var enemy2 = enemies2.getAt(i);
        if ((enemy1.body.velocity.x != enemy2.body.velocity.x) || (enemy1.body.velocity.y != enemy2.body.velocity.y)) {
            console.log("enemy desync");
        }
        i += 1;
    });
    */
}

function speechUpdate()
{
    var offset = {x: player1.body.width - speech1.body.width/2., y: -player1.body.height/2.};
    if(!player1.happy) {
        speech1.visible = true;
        speech1.body.x = player1.body.x + offset.x;
        speech1.body.y = player1.body.y + offset.y;
    } else {
        speech1.visible = false;        
    }

    if(!player2.happy) {
        speech2.visible = true;
        speech2.body.x = player2.body.x + offset.x;
        speech2.body.y = player2.body.y + offset.y;
    } else {
        speech2.visible = false;
    }
    
}

//Change Logic
function updateGame(modifier)
{
  playerUpdate();

  healthUpdate()
  
  enemyUpdate();
  
  speechUpdate();

  var secondsElapsed = levelTimer.seconds()
  if(secondsElapsed > LEVEL_TIME)
  {
    // resetLevel();
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
  else if(nexting)
  {
    nexting = false;
    nextLevel();
    gameState = GAMESTATE_SCREEN;
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
  }


  //If moving, change ROTATION and ANIMATION based on velocity
  if(vx != 0 || vy != 0){
    var ang = Phaser.Math.radToDeg(Math.atan2(vy,vx));
    player1.angle = ang;
    player2.angle = ang;
    if (game.physics.overlap(player1, enemies1)) {
      player1.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      player1.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    }
    if (game.physics.overlap(player2, enemies2)) {
      player2.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      player2.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    }
  } else {
    player1.animations.play('stand');
    player2.animations.play('stand');
  }

    //Move the player
  player1.body.velocity.x = vx;
  player1.body.velocity.y = vy;

  player2.body.velocity.x = vx;
  player2.body.velocity.y = vy;


  //Particle Updates
  player1.p.x = player1.body.x;
  player1.p.y = player1.body.y;

  player1.p.forEachAlive(function(thisParticle){
    if (thisParticle.y <= 35) {
      thisParticle.kill();
    }
  });

  player2.p.x = player2.body.x;
  player2.p.y = player2.body.y;

  player2.p.forEachAlive(function(thisParticle){
    if (thisParticle.y <= 435) {
      thisParticle.kill();
    }
  });
}

function healthUpdate(){
  //Adjust health based on collision

  //Check collision for the INTROVERT
  if(game.physics.overlap(player1,enemies1)){

    health1 -= minusEffect;
    player1.happy = false;
    player1.p.start(false, 2000, 50, 2);
  }
  else{
    health1 += plusEffect;
    player1.happy = true;
  }

  //Check collision for the EXTROVERT
  if(game.physics.overlap(player2,enemies2)){
    health2 += plusEffect;
    player2.happy = true;
  }
  else{
    health2 -= minusEffect;
    player2.happy = false;
    player2.p.start(false, 2000, 50, 2);
  }

  //DEBUG: Manually change the health 
  if(debugging){
    if(raiseButton.isDown){
      health1 += 4*plusEffect;
      health2 += 4*plusEffect;
    }else if(lowerButton.isDown){
      health1 -= 4*plusEffect;
      health2 -= 4*plusEffect;
    }
  }

  // clamp health
  if(health1 > 100){
    health1 = 100;
  }
  else if(health1 < 0){
    health1 = 0;
  }
  if(health2 > 100){
    health2 = 100;
  }
  else if(health2 < 0){
    health2 = 0;
  }

  //check end state
  if(health1 >= WIN_VALUE && health2 >= WIN_VALUE) endLevel(true);
  if(health1 <= LOSE_VALUE || health2 <= LOSE_VALUE) endLevel(false);
}

function updateScreen()
{
  console.log("updating screen");
  if(nexting){
    nexting = false;
    nextLevel();
    gameState = GAMESTATE_GAMEPLAY;
  }
}


  // - - - - - - - - - - - - - - - //
 //- - - - - -RENDERING  - - - - -//
// - - - - - - - - - - - - - - - //
function render()
{
  // game.debug.renderSpriteBody(player1);
  // game.debug.renderSpriteBody(player2);
  game.debug.renderRectangle(player1.body);
  game.debug.renderRectangle(player2.body);

  if(debugging){
    // game.debug.renderSpriteCoords(heroSmart,30,150);

    // game.debug.renderSpriteCollision(heroSmart,30,550);
    
    // game.debug.renderQuadTree(game.physics.quadTree);
    // var color = '#000000';
    // game.debug.renderText("FPS: " + game.time.fps,5,20,color,"20px Courier");
    // game.debug.renderText("plusEffect: " + plusEffect, 5,40,color,"20px Courier");
    // game.debug.renderText("minusEffect: " + minusEffect, 5,80,color,"20px Courier");
  }
}

function renderGame()
{
  //temporary health bars
  var upperY = 20;
  var startX = game.width/2 - BAR_LENGTH/2;

  graphics.clear();
  graphics.lineStyle(10, 0x808080, 1);

  graphics.beginFill(0x808080);
  graphics.moveTo(startX,upperY);
  graphics.lineTo(startX+health1/100*BAR_LENGTH,upperY);
  graphics.endFill();

  graphics.beginFill(0x808080);
  graphics.lineStyle(10, 0x808080, 1);
  graphics.moveTo(startX, upperY+MID_LINE);
  graphics.lineTo(startX+health2/100*BAR_LENGTH, upperY+MID_LINE);
  graphics.endFill();

  //ADD effects for happiness
  var color;
  graphics.lineStyle(1, 0xFFFFFF, 1);

  if(player1.happy) color = 0xFFFF00;
  else color = 0x0000FF;

  graphics.beginFill(color);
  graphics.drawCircle(player1.body.x,player1.body.y,10);
  graphics.endFill();

  if(player2.happy) color = 0xFFFF00;
  else color = 0x0000FF;

  graphics.beginFill(color);
  graphics.drawCircle(player2.body.x,player2.body.y,10);
  graphics.endFill();
}

function drawScreen(color)
{
  color = color || 0xAAAAAA;

  console.log("drawing a screen")
  graphics.beginFill(color);
  graphics.drawRect(0,0,game.width,game.height);
  graphics.endFill();
}

function drawLevelScreen()
{
  drawScreen(0xAAAAAA);

  screenText.visible = true;
  screenText.content = "Level " + currentLevel; //+ "\n\n plusEffect: " + plusEffect + ", minusEffect: " + minusEffect;
}

function drawTitleScreen()
{
  console.log("In title Screen");
  drawScreen(0x00BB00);

  screenText.visible = true;
  screenText.content = "TITLE STUFF";
}

function drawInstructionScreen()
{
  console.log("In title Screen");
  drawScreen(0x00BB00);

  screenText.visible = true;
  screenText.content = "These instructions (which will be gone because we're bold)";
}

function drawEndScreen()
{
  console.log("drawing END screen");
  drawScreen();

  screenText.visible = true;
  screenText.content = "Press R to try again";
}

//fires when "L" button is pressed
function reset()
{
  resetting = true;
}

function next()
{
  nexting = true;
}


  // - - - - - - - - - - - - - - - //
 //- - - - LEVEL FUNCTIONS - - - -//
// - - - - - - - - - - - - - - - //

//unloads the current level + loads the next level in the array
function nextLevel()
{
  if(gameState == GAMESTATE_GAMEPLAY){
    clearLevel();
    currentLevel++;
  }
  else if(gameState == GAMESTATE_SCREEN){
    gameState == GAMESTATE_GAMEPLAY;
    loadLevel();
  }
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

  if(currentLevel == 1)
  {
    plusEffect = .16;
    minusEffect = .09; 
  }
  else if(currentLevel == 2)
  {
    plusEffect = .15;
    minusEffect = .10; 
    numEnemies1 += 3;
    numEnemies2 -= 2;
  }
  else if(currentLevel == 3){
    minusEffect = .11; 
    numEnemies1 += 3;
    numEnemies2 -= 3;
  }
  else if(currentLevel == 4){ 
    numEnemies1 += 3;
    numEnemies2 -= 2;
  }else{
    plusEffect += .15;
    minusEffect += .02;
  }

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

function endLevel(levelWin)
{
  console.log("ending level: " + levelWin);

  if(levelWin){
    screenText.content = "You Win";
    nexting = true;
  }
  else{
    screenText.content = "You Lost";
    gameState = GAMESTATE_END;
  }
}

function resetGame()
{
  // levelText.visible = true;
  screenText.visible = false;
  graphics.clear();

  gameState = GAMESTATE_GAMEPLAY;

  console.log("resetting game");

  player1.revive();
  player2.revive();

  resetLevel();
}

function clearGame()
{
  // levelText.visible = false;
  // screenText.visible = true;

  enemies1.removeAll();
  enemies2.removeAll();

  player1.kill();
  player2.kill();
}


})(document);