(function(document) {

// States

// Loading Screen
var loadingScreen = {
  preload: function() {
    // Set Auto Resize
    game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    game.stage.scale.pageAlignHorizontally = true;
    game.stage.scale.pageAlignVertically = true;
    game.stage.scale.setShowAll();
    game.stage.scale.refresh();

    // Preload Assets
    game.load.image('titleScreen', ART_ASSETS.SCREENS.TITLE);
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
    
    game.load.audio('mainCharVoice', [SOUND_ASSETS.MAINCHAR_VOICE_MP3, SOUND_ASSETS.MAINCHAR_VOICE_OGG]);

    //Create 'data' object in game object to store misc data
    game.data = {
      currentLevel: 0
    };

  },
  create: function() {
    //game.state.start('level2');
    game.state.start('titleScreen');
  }
}

// Basic Screens
var MenuScreen = function(nextScreen, background, textCenter, textBottom) {
  this.nextScreen = nextScreen;
  this.background = background;
  this.textCenter = textCenter;
  this.textBottom = textBottom;
}

MenuScreen.prototype.create = function() {
  if (this.background) {
    this.screenBackground = game.add.sprite(0, 0, this.background);
  } else {
    this.screenBackground = game.add.graphics(0,0);
    this.screenBackground.lineStyle(0);
    this.screenBackground.beginFill(0xDDDDDD);
    this.screenBackground.drawRect(0,0,game.width,game.height);
    this.screenBackground.endFill();
  }

  if (this.textCenter) {
    instructionText = game.add.text(game.world.centerX, 360, this.textCenter, STYLE_HUD);
    instructionText.anchor.setTo(0.5,0.5);
  }

  if (this.textBottom) {
    spaceText = game.add.text(game.world.centerX, 700, this.textBottom, STYLE_HUD);
    spaceText.anchor.setTo(0.5,0.5);
  }

  game.input.keyboard.addCallbacks(this, undefined, function(key){
    if (key.keyCode !== Phaser.Keyboard.LEFT &&
        key.keyCode !== Phaser.Keyboard.UP && 
        key.keyCode !== Phaser.Keyboard.RIGHT && 
        key.keyCode !== Phaser.Keyboard.DOWN &&
        key.keyCode !== Phaser.Keyboard.I) {
      game.state.start(this.nextScreen);
      game.input.keyboard.onDownCallback = null;
    }
  });
}

//"A Game by Rohit Crasta, Altay Murat, and David Wallin\n\n\nUse ARROWS to move.\n\nFill up the happiness meters.\n\nDon't let the meters run out!"
//"  Press Any Key to Continue."

// Start Game

var titleScreen = new MenuScreen('instructionScreen', 'titleScreen');
var instructionScreen = new MenuScreen(
  'levelMenu0', 
  false, 
  "A Game by Rohit Crasta, Altay Murat, and David Wallin\n\n\nUse ARROWS to move.\n\nFill up the happiness meters.\n\nDon't let the meters run out!",
  'Press Any Key to Continue.'
  );





/////////////////////////// New Level Code ///////////////////////////////

var GameLevel = function(LEVEL_DATA) {

  this.plusEffect = LEVEL_DATA.PLUS_EFFECT;
  this.minusEffect = LEVEL_DATA.MINUS_EFFECT;
  this.numEnemies1 = LEVEL_DATA.NUM_ENEMIES1;
  this.numEnemies2 = LEVEL_DATA.NUM_ENEMIES2;
  this.numEnemySeekers = LEVEL_DATA.NUM_SEEKERS;
  this.numEnemyAvoiders = LEVEL_DATA.NUM_AVOIDERS;

  this.health1;
  this.health2;

  this.graphics;

  this.advancing; //NOT set by input!!

  this.mainCharVoice;

  this.player1;
  this.player2;
  this.enemies1;
  this.enemies2;
  this.gameBackground;
  this.speech1;
  this.speech2;
  this.startScreen;

  //input
  this.cursors;
  this.raiseButton;
  this.lowerButton;
  this.resetButton;
  this.debugButton;
}

GameLevel.prototype.create = function() {

  this.health1 = 50;
  this.health2 = 50;

  this.gameBackground = game.add.sprite(0, 0, 'backgroundAlt');
  this.mainCharVoice = game.add.audio('mainCharVoice');
  this.mainCharVoice.loop = true;
  this.enemies1 = game.add.group();
  this.enemies2 = game.add.group();

  //Player1
  this.player1 = game.add.sprite(0.25 * game.width, 0.5 * game.width, 'player1');
  this.player1.anchor = new Phaser.Point(0.5,0.5);
  this.player1.body.setSize(32, 32, 9, 2);
  this.player1.animations.add('walk-happy', [4, 5, 2, 5]);
  this.player1.animations.add('walk-sad', [1, 0, 3, 0]);
  this.player1.animations.add('stand-happy', [5]);
  this.player1.animations.add('stand-sad', [0]);
  this.player1.happy = true;
  // Particle Setup 1
  this.player1.p = game.add.emitter(game.world.centerX, this.player1.body.x, this.player1.body.y);
  this.player1.p.gravity = -20;
  this.player1.p.setRotation(0, 0);
  this.player1.p.makeParticles('particle', [0], 1500, 1);  
  this.player1.p.start(false, 2000, 50, 200000000);
  this.player1.p.on = false;

  // Player 2
  this.player2 = game.add.sprite(0.75 * game.width, 0.5 * game.width, 'player2');
  this.player2.anchor = new Phaser.Point(0.5,0.5);
  this.player2.body.setSize(40, 40, 9, 3);
  this.player2.animations.add('walk-happy', [4, 5, 2, 5]);
  this.player2.animations.add('walk-sad', [1, 0, 3, 0]);
  this.player2.animations.add('stand-happy', [5]);
  this.player2.animations.add('stand-sad', [0]);
  this.player2.happy = true;
  // Particle Setup 2
  this.player2.p = game.add.emitter(game.world.centerX, this.player2.body.x, this.player2.body.y);
  this.player2.p.gravity = -20;
  this.player2.p.setRotation(0, 0);
  this.player2.p.makeParticles('particle', [0], 1500, 1);
  this.player2.p.start(false, 2000, 50, 200000000);
  this.player2.p.on = false;

    // Speech 
  this.speech1 = game.add.sprite(0,0,'speechPos');
  this.speech1.visible = false;
  this.speech2 = game.add.sprite(0,0,'speechNeg');
  this.speech2.visible = false;

  // - - - RENDERING - - - //
  this.graphics = game.add.graphics(0,0);

  this.cursors = game.input.keyboard.createCursorKeys();
  this.raiseButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.lowerButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.resetButton = game.input.keyboard.addKey(Phaser.Keyboard.R);
  this.resetButton.onDown.add(reset,this);

  // Create Enemies

  var exclusionZoneSize = {width: 10, height: 10};
  
  this.buildEnemyGroup(this.enemies1, this.numEnemies1, true);
  this.buildEnemyGroup(this.enemies2, this.numEnemies2, false);

};

GameLevel.prototype.update = function() {
 
  this.playerUpdate();
  this.healthUpdate();
  this.enemyUpdate();
  this.speechUpdate();
  this.renderGraphics();
}

GameLevel.prototype.buildEnemyGroup = function(enemies, numEnemies, first) {
  var offset = {x: 0, y: 0};
  if (!first) {
    offset.x += game.width / 2.0;
  }
  for (var i=0;i<numEnemies;i++) {
    var x = game.rnd.frac()*game.width/2;
    var y = game.rnd.frac()*game.height;
    var spriteName;
    if (first) {
        spriteName = 'char1'
    } else {
        spriteName = 'char2'
    }
    var enemy = enemies.create(x, y, spriteName);
    x = Math.max(2.0 * enemy.body.width, Math.min(x, game.width/2 - 2.0 * enemy.body.width));
    y = Math.max(2.0 * enemy.body.width, Math.min(y, game.height - 2.0 * enemy.body.height));
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
};

GameLevel.prototype.playerUpdate = function() {
  var vx = 0;
  var vy = 0;

  if(this.cursors.up.isDown) //UP or W
  {
    if(this.player1.body.y >= (BAR_HEIGHT+BAR_START_Y)){
      vy -= PLAYER_SPEED;
    }
  }
  if(this.cursors.down.isDown) //DOWN or S
  {
    if(this.player1.body.y+this.player1.body.height <= game.height){
      vy += PLAYER_SPEED;
    }
  }
  if(this.cursors.left.isDown) //LEFT or A
  {
    if(this.player1.body.x >= 0){
      vx -= PLAYER_SPEED;
    }
  }
  if(this.cursors.right.isDown) //RIGHT or D
  {
    if(this.player1.body.x+this.player1.body.height <= game.width/2.0){
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
    this.player1.angle = ang;
    this.player2.angle = ang;
    if (this.player1.happy === false) {
      this.player1.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      this.player1.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    }
    if (this.player2.happy === false) {
      this.player2.animations.play('walk-sad', PLAYER_WALK_ANIMATION_FPS, true);
    } else {
      this.player2.animations.play('walk-happy', PLAYER_WALK_ANIMATION_FPS, true);
    }
  } else {
    if (this.player1.happy === false) {
      this.player1.animations.play('stand-sad');
    } else {
      this.player1.animations.play('stand-happy');
    }
    if (this.player2.happy === false) {
      this.player2.animations.play('stand-sad');
    } else {
      this.player2.animations.play('stand-happy');
    }
  }

    //Move the player
  this.player1.body.velocity.x = vx;
  this.player1.body.velocity.y = vy;

  this.player2.body.velocity.x = vx;
  this.player2.body.velocity.y = vy;


  //Particle Updates
  this.player1.p.x = this.player1.body.x;
  this.player1.p.y = this.player1.body.y;

  var particleKillHeight = 35;

  this.player1.p.forEachAlive(function(thisParticle){
    if (thisParticle.y <= particleKillHeight) {
      thisParticle.kill();
    }
  });

  this.player2.p.x = this.player2.body.x;
  this.player2.p.y = this.player2.body.y;

  this.player2.p.forEachAlive(function(thisParticle){
    
    if (thisParticle.y <= particleKillHeight) {
      thisParticle.kill();
    }
  });
  
  // audio voice
  if (!this.player1.happy || this.player2.happy) {
      if (!this.mainCharVoice.isPlaying) {
          if (this.mainCharVoice.pausedPosition == 0) {
              this.mainCharVoice.play();
          } else {
              //looping is broken somehow, otherwise resume would work
              //mainCharVoice.resume();
              // pull random position from first 3/4s of duration
              var position = 0.75 * Math.random() * this.mainCharVoice.duration;
              this.mainCharVoice.play('', position);
          }
      }
  } else {
      this.mainCharVoice.pause();
  }  
};

GameLevel.prototype.healthUpdate = function() {
  //Adjust health based on collision

  //Check collision for the INTROVERT
  if(game.physics.overlap(this.player1,this.enemies1)){
    this.health1 -= this.minusEffect;
    this.player1.happy = false;
    //console.log('introvert not happy');
    this.player1.p.on = false;
    
  } else {
    this.health1 += this.plusEffect;
    this.player1.happy = true;
    this.player1.p.on = true;
  }
  this.player1.p.on = this.player1.happy;

  //Check collision for the EXTROVERT
  if(game.physics.overlap(this.player2,this.enemies2)){
    this.health2 += this.plusEffect;
    this.player2.happy = true;
  } else {
    this.health2 -= this.minusEffect;
    this.player2.happy = false;
  }
  this.player2.p.on = this.player2.happy;

  //DEBUG: Manually change the health 
  if(DEBUG){
    if(this.raiseButton.isDown){
      this.health1 += 4 * this.plusEffect;
      this.health2 += 4 * this.plusEffect;
    }else if(this.lowerButton.isDown){
      this.health1 -= 4 * this.plusEffect;
      this.health2 -= 4 * this.plusEffect;
    }
  }

  // clamp health
  if(this.health1 > 100){
    this.health1 = 100;
  }
  else if(this.health1 < 0){
    this.health1 = 0;
  }
  if(this.health2 > 100){
    this.health2 = 100;
  }
  else if(this.health2 < 0){
    this.health2 = 0;
  }

  //check end state
  if (!ENDLESS) {
    if (this.health1 >= WIN_VALUE && this.health2 >= WIN_VALUE) {
      this.mainCharVoice.stop();
      game.data.currentLevel += 1;
      game.state.start('levelMenu' + game.data.currentLevel);
    }
    if (this.health1 <= LOSE_VALUE || this.health2 <= LOSE_VALUE) {
      this.mainCharVoice.stop();
      game.state.start('levelMenu' + game.data.currentLevel);
    }
  }
};

GameLevel.prototype.enemyUpdate = function() {   
    this.enemyEnemyCollisionUpdate();
    var that = this;
    var i = 0;
    this.enemies1.forEach(function(enemy) {
        var seeker = (i < that.numEnemySeekers);
        that.processEnemy(enemy, true, that.player1, seeker, false);
        i += 1;
    });
    
    var i = 0;
    this.enemies2.forEach(function(enemy) {
        var avoider = (i < that.numEnemyAvoiders);
        that.processEnemy(enemy, false, that.player2, false, avoider);
        i += 1;
    });  
};

GameLevel.prototype.enemyEnemyCollisionUpdate = function() {
    // do overlap test for enemies1
    // put into handler for weird intermittent end of game crash
    try{
        game.physics.collide(this.enemies1, this.enemies1, function(){}, null, this);
        game.physics.collide(this.enemies2, this.enemies2, function(){}, null, this);
    }
    catch(e){
     //catch and just suppress error
    }
}

GameLevel.prototype.processEnemy = function(enemy, first, player, enableSeeker, enableAvoider) {

  var filterFactor = 0.8;
  var vx = 0;
  var vy = 0;

  var elapsedTimeSinceLastDecision = (game.time.now+enemy._lastDecisionOffset) - enemy._lastDecisionTime ;
  if (elapsedTimeSinceLastDecision > ENEMY_DECISION_PERIOD_MS) {
      var dx = (2.0 * game.rnd.frac() - 1.0);
      var dy = (2.0 * game.rnd.frac() - 1.0);
      var magnitude = Math.sqrt(dx * dx + dy * dy);
      vx = dx/magnitude * ENEMY_SPEED;
      vy = dy/magnitude * ENEMY_SPEED;
      enemy._lastDecisionTime = game.time.now + enemy._lastDecisionOffset;
  } else {
      vx = enemy.body.velocity.x;
      vy = enemy.body.velocity.y;
  }

  // handle player attraction
  
  if (enableSeeker && (ENEMY_ATTRACTION_FACTOR > 0)) {
      var attraction = this.computeAttraction(player, enemy);
      vx = ENEMY_ATTRACTION_FACTOR * attraction.x + (1.0 - ENEMY_ATTRACTION_FACTOR) * vx;
      vy = ENEMY_ATTRACTION_FACTOR * attraction.y + (1.0 - ENEMY_ATTRACTION_FACTOR) * vy;
  }        
  // handle player repulsion
  
  if (enableAvoider && (ENEMY_REPULSION_FACTOR > 0)) {
      var repulsion = this.computeRepulsion(player, enemy);
      if (null != repulsion) {
          vx = ENEMY_REPULSION_FACTOR * repulsion.x + (1.0 - ENEMY_REPULSION_FACTOR) * vx;
          vy = ENEMY_REPULSION_FACTOR * repulsion.y + (1.0 - ENEMY_REPULSION_FACTOR) * vy;
      }
  }        

  // resolve world boundary collision
  if (first) {
      if(enemy.body.x+enemy.body.width > game.width/2.0){
          vx = -ENEMY_SPEED;
      }
  } else {
      if(enemy.body.x+enemy.body.width > game.width){
          vx = -ENEMY_SPEED;
      }
  }

  if(enemy.body.y+enemy.body.height > game.height){
    vy = -ENEMY_SPEED;
  }

  if (first) {
      if(enemy.body.x < 0){
          vx = ENEMY_SPEED;
      }
  } else {
      if(enemy.body.x < (game.width/2.0)){
          vx = ENEMY_SPEED;
      }
  }

  if(enemy.body.y < BAR_HEIGHT){
    vy = ENEMY_SPEED;
  }
     
  enemy.body.velocity.x = (filterFactor * vx) + (1.0 - filterFactor) * enemy.body.velocity.x;
  enemy.body.velocity.y = (filterFactor * vy) + (1.0 - filterFactor) * enemy.body.velocity.y;
  
  var angleFilterFactor = 0.1;
  
  if(vx != 0 || vy != 0){
    var ang = Phaser.Math.radToDeg(Math.atan2(enemy.body.velocity.y, enemy.body.velocity.x));
    enemy.angle = angleFilterFactor * ang + (1.0 - angleFilterFactor) * enemy.angle;
    enemy.animations.play('walk', CHAR_WALK_ANIMATION_FPS, true);
  } else {
      enemy.animations.play('stand');
  }
};

GameLevel.prototype.computeAttraction = function(player, enemy) {
  var attractionRadius = 0.5;
  var vx = 0;
  var vy = 0;
  var enemyAttractionPower = ENEMY_ATTRACTION_FACTOR * ENEMY_SPEED;
  var dx = player.body.x - enemy.body.x;
  var dy = player.body.y - enemy.body.y;
  var squaredMagnitude = dx*dx + dy*dy;
  var magnitude = Math.sqrt(squaredMagnitude);
  if (magnitude > attractionRadius) {
      vx += dx * (enemyAttractionPower / magnitude);
      vy += dy * (enemyAttractionPower / magnitude);
  }
  return {x : vx, y: vy};
}

GameLevel.prototype.computeRepulsion = function(player, enemy) {
  var repulsionRadius = ENEMY_REPULSION_CUTOFF;
  var vx = 0;
  var vy = 0;
  var enemyRepulsionPower = ENEMY_REPULSION_FACTOR * ENEMY_SPEED;
  var dx = player.body.x - enemy.body.x;
  var dy = player.body.y - enemy.body.y;
  var squaredMagnitude = dx*dx + dy*dy;
  var magnitude = Math.sqrt(squaredMagnitude);
  if (magnitude < ENEMY_REPULSION_CUTOFF) {
      vx -= dx * (enemyRepulsionPower / magnitude);
      vy -= dy * (enemyRepulsionPower / magnitude);
      return {x : vx, y: vy};
  }
  return null;
}

GameLevel.prototype.speechUpdate = function()
{
    var offset = {x: this.player1.body.width - this.speech1.body.width/2.0 + 10, y: -this.player1.body.height/2.0 - 10};
    if(!this.player1.happy) {
        this.speech1.visible = true;
        this.speech1.body.x = this.player1.body.x + offset.x;
        this.speech1.body.y = this.player1.body.y + offset.y;
    } else {
        this.speech1.visible = false;        
    }

    if(!this.player2.happy) {
        this.speech2.visible = false;
    } else {
        this.speech2.visible = true;
        this.speech2.body.x = this.player2.body.x + offset.x;
        this.speech2.body.y = this.player2.body.y + offset.y;
    }
    
};

GameLevel.prototype.renderGraphics = function() {
  this.graphics.clear();
  this.renderHealthBar(this.health1, true);
  this.renderHealthBar(this.health2, false);
};

GameLevel.prototype.renderHealthBar = function(health, first) {
  var upperY = BAR_START_Y;
  var startX;
  var fillColor = 0x808080;

  startX = game.width/4 - BAR_LENGTH/2;
  if (!first) {
    startX += game.width/2;
  }

  this.graphics.lineStyle(BAR_HEIGHT, fillColor, 1);
  this.graphics.beginFill(fillColor);
  this.graphics.moveTo(startX, upperY);
  this.graphics.lineTo(startX + health / 100 * BAR_LENGTH, upperY);
  this.graphics.endFill();
};


//////////////////////////////////////////////////////////////////////////







var level0 = new GameLevel(LEVEL_DATA[0]);


var game = new Phaser.Game(1000, 800, Phaser.AUTO, '');

game.state.add('loadingScreen', loadingScreen, false);
game.state.add('titleScreen', titleScreen, false);
game.state.add('instructionScreen', instructionScreen, false);

LEVEL_DATA.forEach(function(ELEMENT, index, array){
  game.state.add('levelMenu'+index, new MenuScreen('level'+index, false, ELEMENT.TITLE, 'Press Any Key to Continue.'))
  game.state.add('level'+index, new GameLevel(LEVEL_DATA[index]), false)

});

game.state.start('loadingScreen');

//   else{
//     numEnemies1 += 1;
//     numEnemies2 -= 1;
//     if(numEnemies2 < 5) numEnemies2 = 5;
//   }


  // - - - - - - - - - - - - - - - //
 //- - - - -HANDLE INPUT - - - - -//
// - - - - - - - - - - - - - - - //



//fires when "L" button is pressed
function reset()
{
  resetting = true;
}


})(document);