(function(document) {

var game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});


  // - - - - - - - - - - - - - - - //
 // - - - - - PRELOADING - - - - -//
// - - - - - - - - - - - - - - - //

//PHASER - Preload assets
function preload() {
	//LOAD STUFF

  game.load.image('background', ART_ASSETS.BACKGROUND);
  game.load.image('backgroundAlt', ART_ASSETS.BACKGROUND_ALT);
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
  game.load.audio('mainCharVoice', SOUND_ASSETS.MAINCHAR_VOICE);
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

var mainCharVoice;

var player1;
var player2;
var enemies1;
var enemies2;
var gameBackground;
var speech1;
var speech2;

var altColumnLayout;
var numEnemies1;
var numEnemies2;
var cloneEnemies1ToEnemies2;
var numEnemySeekers;
var numEnemyAvoiders;
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
var debugButton;

//formatting
var levelText;
var screenText;
// var instructionText;

//PHASER - Initialize Game
function create() {
	//Initiate all starting values for important variables/states/etc 
  debugging = true;
  resetting = false;
  nexting = false;
  gameState = GAMESTATE_START;
  currentLevel = 1;

  altColumnLayout = true;
  
  levelTimer = new Phaser.Timer(game);

  if (altColumnLayout) {
      gameBackground = game.add.sprite(0, 0, 'backgroundAlt');
  } else {
      gameBackground = game.add.sprite(0, 0, 'background');      
  }
  gameHUD = game.add.group();
  //gameHUD.create(10, 10, 'menuTop');
  //gameHUD.create(10, 410, 'menuBottom');

  //Initialize Sound Effects
  mainCharVoice = game.add.audio('mainCharVoice');
  mainCharVoice.play('',1,true);

  //out of 100;
  health1 = 50;
  health2 = 50;
  plusEffect = .16;
  minusEffect = .09;

  enemyAttractionFactor = 0.5;
  enemyRepulsionFactor = 0.5;
  
  numEnemySeekers = 0;
  numEnemyAvoiders = 0;
   
  cloneEnemies1ToEnemies2 = false;
  numEnemies1 = 22;
  numEnemies2 = 22;
  enemies1 = game.add.group();
  enemies2 = game.add.group();

  // Player 1
  var start;
  start = getPlayerStart(0);
  player1 = game.add.sprite(start.x,start.y,'player1');
  player1.anchor = new Phaser.Point(0.5,0.5);
  player1.body.setSize(32, 32, 9, 9);
  player1.animations.add('walk-happy', [4, 5, 2, 5]);
  player1.animations.add('walk-sad', [1, 0, 3, 0]);
  player1.animations.add('stand-happy', [5]);
  player1.animations.add('stand-sad', [0]);
  player1.happy = true;
  
  // Particle Setup 1
  player1.p = game.add.emitter(game.world.centerX, player1.body.x, player1.body.y);
  player1.p.gravity = -20;
  player1.p.setRotation(0, 0);
  player1.p.makeParticles('particle', [0], 1500, 1);


  // Player 2
  start = getPlayerStart(1);
  player2 = game.add.sprite(start.x,start.y,'player2');
  player2.anchor = new Phaser.Point(0.5,0.5);
  player2.body.setSize(40, 40, 5, 5);
  player2.animations.add('walk-happy', [4, 5, 2, 5]);
  player2.animations.add('walk-sad', [1, 0, 3, 0]);
  player2.animations.add('stand-happy', [5]);
  player2.animations.add('stand-sad', [0]);
  player2.happy = true;
  // Particle Setup 2
  player2.p = game.add.emitter(game.world.centerX, player2.body.x, player2.body.y);
  player2.p.gravity = -20;
  player2.p.setRotation(0, 0);
  player2.p.makeParticles('particle', [0], 1500, 1);

  speech1 = game.add.sprite(0,0,'speechPos');
  speech1.visible = false;
  speech2 = game.add.sprite(0,0,'speechNeg');
  speech2.visible = false;

  // - - - RENDERING - - - //
  graphics = game.add.graphics(0,0);
  
  levelText = game.add.text(500,360,"0", STYLE_HUD);
  levelText.visible = false;
  screenText = game.add.text(450,360,"PRESS R TO TRY AGAIN", STYLE_HUD);
  screenText.visible = false;

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
  debugButton = game.input.keyboard.addKey(Phaser.Keyboard.I);
  debugButton.onDown.add(toggleDebug,this);
}

function getPlayerStart(num) {
    var playerStartX;
    var playerStartY;
    if (altColumnLayout) {
        playerStartX = 0.25 * game.width;
        playerStartY = 0.5 * game.height;
    } else {
        playerStartX = 0.5 * game.width;
        playerStartY = 0.25 * game.height;
    }
    if (num > 0) {
        if (altColumnLayout) {
            playerStartX += 0.5 * game.width;
        } else {
            playerStartY += 0.5 * game.height;
        }
    }
    return {x: playerStartX, y: playerStartY};    
}

function createEnemies()
{
  var size;
  if (altColumnLayout) {
      size = {width: game.width/2, height:game.height};      
  } else {
      size = {width: game.width, height:game.height / 2};
  }
  var exclusionZoneSize = {width: 10, height: 10};
  
  function buildEnemyGroup(enemies, numEnemies, first) {
      var offset = {x: 0, y: 0};
      if (!first) {
          if (altColumnLayout) {
              offset.x += game.width / 2.0;
          } else {
              offset.y += game.height / 2.0;
          }
      }
      for(var i=0;i<numEnemies;i++)
      {
        var x = game.rnd.frac()*size.width;
        var y = game.rnd.frac()*size.height;
        var spriteName;
        if (first) {
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
      var offset = {x: 0, y: 0};
      if (altColumnLayout) {
          offset.x += game.width / 2.0;
      } else {
           offset.y += game.height / 2.0;
      }
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
    // put into handler for weird intermittent end of game crash
    try{
        game.physics.collide(enemies1, enemies1, enemyEnemyCollisionHandler, null, this);
        if (!cloneEnemies1ToEnemies2) {
            game.physics.collide(enemies2, enemies2, enemyEnemyCollisionHandler, null, this);
        }
    }
    catch(e){
     //catch and just suppress error
    }
}

function enemyUpdate()
{
    enemyEnemyCollisionUpdate();
    
    function processEnemy(enemy1, first, player, enableSeeker, enableAvoider) {
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
        if (enableSeeker && enemyAttractionFactor > 0) {
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
        if (enableAvoider && enemyRepulsionFactor > 0) {
            var repulsion = computeRepulsion();
            vx = enemyRepulsionFactor * repulsion.x + (1.0 - enemyRepulsionFactor) * vx;
            vy = enemyRepulsionFactor * repulsion.y + (1.0 - enemyRepulsionFactor) * vy;
        }        
        // resolve world boundary collision
        if (altColumnLayout) {
            if (first) {
                if(enemy1.body.x+enemy1.body.width > game.width/2.0){
                    vx = -ENEMY_SPEED;
                }
            } else {
                if(enemy1.body.x+enemy1.body.width > game.width){
                    vx = -ENEMY_SPEED;
                }
            }
            if(enemy1.body.y+enemy1.body.height > game.height){
              vy = -ENEMY_SPEED;
            }
            if (first) {
                if(enemy1.body.x < enemy1.body.width){
                    vy = ENEMY_SPEED;
                }
            } else {
                if(enemy1.body.x < (enemy1.body.width + game.width/2.0)){
                    vx = ENEMY_SPEED;
                }
            }
            if(enemy1.body.y < enemy1.body.height){
              vy = ENEMY_SPEED;
            }
            
        } else {
            if (first) {
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
            if (first) {
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
    var i = 0;
    enemies1.forEach(function(enemy1) {
        var seeker = (i < numEnemySeekers);
        processEnemy(enemy1, true, player1, seeker, false);
        i += 1;
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
        var i = 0;
        enemies2.forEach(function(enemy) {
            var avoider = (i < numEnemyAvoiders);
            processEnemy(enemy, false, player2, false, avoider);
            i += 1;
        });
    }   
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
        speech2.visible = false;
    } else {
        speech2.visible = true;
        speech2.body.x = player2.body.x + offset.x;
        speech2.body.y = player2.body.y + offset.y;
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
    if (altColumnLayout) {
        if(player1.body.y+player1.body.height <= game.height){
          vy += PLAYER_SPEED;
        }
    } else {
        if(player1.body.y+player1.body.height <= game.height/2.0){
          vy += PLAYER_SPEED;
        }
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
    if (altColumnLayout) {
        if(player1.body.x+player1.body.height <= game.width/2.0){
          vx += PLAYER_SPEED;
        }
    } else {
        if(player1.body.x+player1.body.height <= game.width){
          vx += PLAYER_SPEED;
        }
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
    if (player1.happy === false) {
      player1.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      player1.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    }
    if (player2.happy === false) {
      player2.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      player2.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    }
  } else {
    if (player1.happy === false) {
      player1.animations.play('stand-sad');
    } else {
      player1.animations.play('stand-happy');
    }
    if (player2.happy === false) {
      player2.animations.play('stand-sad');
    } else {
      player2.animations.play('stand-happy');
    }
  }

    //Move the player
  player1.body.velocity.x = vx;
  player1.body.velocity.y = vy;

  player2.body.velocity.x = vx;
  player2.body.velocity.y = vy;


  //Particle Updates
  player1.p.x = player1.body.x;
  player1.p.y = player1.body.y;

  var particleKillHeight = 35;

  player1.p.forEachAlive(function(thisParticle){
    if (thisParticle.y <= particleKillHeight) {
      thisParticle.kill();
    }
  });

  player2.p.x = player2.body.x;
  player2.p.y = player2.body.y;

  if (!altColumnLayout) {
      particleKillHeight = 435; 
  }
  player2.p.forEachAlive(function(thisParticle){
    
    if (thisParticle.y <= particleKillHeight) {
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
  } else {
    health1 += plusEffect;
    player1.happy = true;
  }

  //Check collision for the EXTROVERT
  if(game.physics.overlap(player2,enemies2)){
    health2 += plusEffect;
    player2.happy = true;
  } else {
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
  if (!ENDLESS) {
    if(health1 >= WIN_VALUE && health2 >= WIN_VALUE) endLevel(true);
    if(health1 <= LOSE_VALUE || health2 <= LOSE_VALUE) endLevel(false);
  }
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


  graphics.clear();

  function renderHealthBar(health, first) {
      var upperY = 20;
      var startX;
      var healthBarLength;
      var fillColor;
      var healthBarMidLine;

      if (altColumnLayout) {
          healthBarLength = BAR_LENGTH / 2.0;
          startX = game.width/4 - healthBarLength/2.0;
          if (!first) {
              startX += game.width/2.;
          }
      } else {
          healthBarLength = BAR_LENGTH;
          startX = game.width/2 - healthBarLength/2.0;   
      }
      
      if (first) {
          fillColor = 0x808080;
          healthBarMidLine = 0;
      } else {
          fillColor = 0x808080;
          if (!altColumnLayout) {
              healthBarMidLine = MID_LINE;
          } else {
              healthBarMidLine = 0;
          }
      }
      graphics.lineStyle(10, fillColor, 1);
      graphics.beginFill(fillColor);
      graphics.moveTo(startX,upperY+healthBarMidLine);
      graphics.lineTo(startX+health/100*healthBarLength,upperY+healthBarMidLine);
      graphics.endFill();
      
  }
  renderHealthBar(health1, true);
  renderHealthBar(health2, false);

  //ADD effects for happiness
  if (DEBUG) {
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
}

function drawScreen(color)
{
  color = color || 0xDDDDDD;

  console.log("drawing a screen")
  graphics.beginFill(color);
  graphics.drawRect(0,0,game.width,game.height);
  graphics.endFill();
}

function drawLevelScreen()
{
  drawScreen(0xDDDDDD);

  screenText.visible = true;
  screenText.content = "Level " + currentLevel; //+ "\n\n plusEffect: " + plusEffect + ", minusEffect: " + minusEffect;
}

function drawTitleScreen()
{
  console.log("In title Screen");
  drawScreen();

  screenText.visible = true;
  screenText.content = "TITLE STUFF";
}

function drawInstructionScreen()
{
  console.log("In title Screen");
  drawScreen();

  screenText.visible = true;
  screenText.content = "These are instructions \n(which will actually be an image)";
}

function drawEndScreen()
{
  console.log("drawing END screen");
  drawScreen();

  screenText.visible = true;
  screenText.content = "Press R to try again";
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
  // console.log("Level does not exist");

  if(currentLevel == 1)
  {
    plusEffect = .16;
    minusEffect = .09; 

    numEnemies = 22;
    numEnemies = 22;
  }
  else if(currentLevel == 2)
  {
    plusEffect = .14;
    minusEffect = .11; 
    
    numEnemies = 27;
    numEnemies2 = 17;
  }
  else if(currentLevel == 3){
    //THROW IN THE SEEKERS
    plusEffect = .12;
    minusEffect = .12;

    numEnemies1 = 10;
    numEnemies2 = 15;

    numEnemySeekers = 5;
  }
  else if(currentLevel == 4){ 
    minusEffect = .13;

    numEnemies1 = 30;
    numEnemies2 = 12;

    numEnemySeekers = 3;
  }else{
    numEnemies1 += 1;
    numEnemies2 -= 1;
  }

  createEnemies();

  // console.log("Level: " + currentLevel);
  // console.log("plusEffect: " + plusEffect);
  // console.log("minusEffect: " + minusEffect);
  // console.log("numEnemies1: " + numEnemies1);
  // console.log("numEnemies2: " + numEnemies2);
  // console.log("numEnemySeekers: " + numEnemySeekers);


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
  var start;
  start = getPlayerStart(0);
  player1.x = start.x;
  player1.y = start.y;
  start = getPlayerStart(1);
  player2.x = start.x;
  player2.y = start.y;

  player1.body.velocity = new Phaser.Point(0,0);
  player1.angle = 0;
  player2.body.velocity = new Phaser.Point(0,0);
  player2.angle = 0;

  speech1.visible = false;
  speech2.visible = false;

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

  // - - - - - - - - - - - - - - - //
 //- - - - -HANDLE INPUT - - - - -//
// - - - - - - - - - - - - - - - //



//fires when "L" button is pressed
function reset()
{
  resetting = true;
}

function next()
{
  if(debugging) nexting = true;
}

function toggleDebug()
{
  debugging = !debugging;
}


})(document);