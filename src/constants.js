//-----------------
//GAME CONSTANTS
//-----------------
var DEBUG = false;
var ENDLESS = false;
var PLAYER_SPEED = 200;

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
var GAMESTATE_INSTRUCTIONS = "instructions";
var GAMESTATE_SCREEN = "screen";
var GAMESTATE_END = "end";

var MID_LINE = 400;
var BAR_LENGTH = 970;
var BAR_HEIGHT = 20;
var BAR_START_Y = 17.5;

var ART_ASSETS = {
	BACKGROUND: '../assets/ggj14_masterart_background.png',
    BACKGROUND_ALT: '../assets/ggj14_masterart_background_alt.png',
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
	SPEECH_POS: '../assets/ggj14_masterart_speech1.png',
	SPEECH_NEG: '../assets/ggj14_masterart_speech2.png',
	PARTICLE_POS: '../assets/ggj14_masterart_particle-pos.png',
	PARTICLE_NEG: '../assets/ggj14_masterart_particle-neg.png',
	PARTICLE: '../assets/ggj14_masterart_particle.png',
	SCREENS: {
		TITLE: '../assets/screens_title.png'
	}
};

var SOUND_ASSETS = {
	MAINCHAR_VOICE_MP3: '../assets/MainChar-voice.mp3',
	MAINCHAR_VOICE_OGG: '../assets/MainChar-voice.ogg'
};

//FORMATTING
var STYLE_HUD = { font: "bold 25px Helvetica", fill: "#000000", align: "center" };
