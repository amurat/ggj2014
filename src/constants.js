//-----------------
//GAME CONSTANTS
//-----------------
var PLAYER_SPEED = 200;

// var TILE_SIZE = 40;
// var SPEED_MAX = 18;
// var MAX_LEVEL_HEIGHT=17;
// var MAX_LEVEL_WIDTH=20;


//Game States
var GAMESTATE_PRELOAD = "preloading",
	GAMESTATE_MENU = "menu",
	GAMESTATE_GAMEPLAY = "gameplay",
  GAMESTATE_INSTRUCTIONS = "instructions",
  GAMESTATE_END = "end";

var MID_LINE = 400;
var BAR_LENGTH = 970;

var STRONG_EFFECT = .15;
var WEAK_EFFECT = .05;

var ART_ASSETS = {
	BACKGROUND: '../assets/ggj14_masterart_background.png',
	MENU_TOP: '../assets/ggj14_masterart_bar-top.png',
	MENU_BOTTOM: '../assets/ggj14_masterart_bar-bottom.png',
	PLAYER1: '../assets/ggj14_masterart_mainchar1.png',
	PLAYER2: '../assets/ggj14_masterart_mainchar2.png',
	ENEMY1: '../assets/ggj14_masterart_char1.png',
	ENEMY2: '../assets/ggj14_masterart_char2.png'
};

		


//-----------------
//MAPS
//-----------------

// //slide as a single entity
// var levelStart = {w:9,h:8};
// levelStart.map = [
//     '#','#','#','#','#','#','#','#','#',
    
//     '#','p','P','#',' ',' ',' ',' ','#',
    
//     '#',' ',' ','#',' ',' ',' ',' ','#',
    
//     '#',' ',' ',' ',' ',' ',' ',' ','#',
    
//     '#','#','#',' ',' ',' ','#','#','#',
    
//     '#','a','b',' ',' ',' ',' ',' ','#',
    
//     '#','#','#','#',' ',' ',' ',' ','#',
    
//     '#','#','#','#','#','#','#','#','#'
// ];