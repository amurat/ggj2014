//-----------------
//GAME CONSTANTS
//-----------------
var PLAYER_SPEED = 200;
var PLAYER_START_X = 500;
var PLAYER1_START_Y = 200;
var PLAYER2_START_Y = 600;

var ENEMY_SPEED = 100;

var ENEMY_DECISION_PERIOD_MS = 1000;

var PLAYER_WALK_ANIMATION_FPS = 15;
var CHAR_WALK_ANIMATION_FPS = 12;

var LEVEL_TIME = 15;
var WIN_VALUE = 100;
var LOSE_VALUE = 0;

//Game States
var GAMESTATE_START = "start";
var GAMESTATE_GAMEPLAY = "gameplay";
var GAMESTATE_SCREEN = "screen";
var GAMESTATE_END = "end";

var MID_LINE = 400;
var BAR_LENGTH = 970;

var ART_ASSETS = {
	BACKGROUND: '../assets/ggj14_masterart_background.png',
	MENU_TOP: '../assets/ggj14_masterart_bar-top.png',
	MENU_BOTTOM: '../assets/ggj14_masterart_bar-bottom.png',
	PLAYER1: {
		SPRITESHEET: '../assets/mainchar1.png',
		JSON: '../assets/mainchar1.json'
	},
	PLAYER2: {
		SPRITESHEET: '../assets/mainchar2.png',
		JSON: '../assets/mainchar2.json'
	},
	CHAR1: {
		SPRITESHEET: '../assets/char1.png',
		JSON: '../assets/char1.json'
	},
	CHAR2: {
		SPRITESHEET: '../assets/char2.png',
		JSON: '../assets/char2.json'
	},
	ENEMY1: '../assets/ggj14_masterart_char1.png',
	ENEMY2: '../assets/ggj14_masterart_char2.png'
};

//FORMATTING
var STYLE_HUD = { font: "bold 25px Arial", fill: "#000000", align: "left" };
