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
var BAR_LENGTH = 485;
var BAR_HEIGHT = 20;
var BAR_START_Y = 17.5;

var ART_ASSETS = {
    BACKGROUND: 'assets/ggj14_masterart_background.png',
    BACKGROUND_ALT: 'assets/ggj14_masterart_background_alt.png',
    MENU_TOP: 'assets/ggj14_masterart_bar-top.png',
    MENU_BOTTOM: 'assets/ggj14_masterart_bar-bottom.png',
    PLAYER1: {
        SPRITESHEET: 'assets/mainchar1.png',
        JSON: 'assets/mainchar1.json'
    },
    PLAYER2: {
        SPRITESHEET: 'assets/mainchar2.png',
        JSON: 'assets/mainchar2.json'
    },
    CHAR1: {
        SPRITESHEET: 'assets/char1.png',
        JSON: 'assets/char1.json'
    },
    CHAR2: {
        SPRITESHEET: 'assets/char2.png',
        JSON: 'assets/char2.json'
    },
    SPEECH_POS: 'assets/ggj14_masterart_speech1.png',
    SPEECH_NEG: 'assets/ggj14_masterart_speech2.png',
    PARTICLE_POS: 'assets/ggj14_masterart_particle-pos.png',
    PARTICLE_NEG: 'assets/ggj14_masterart_particle-neg.png',
    PARTICLE: 'assets/ggj14_masterart_particle.png',
    SCREENS: {
        TITLE: 'assets/screens_title.png'
    }
};

var SOUND_ASSETS = {
    MAINCHAR_VOICE_MP3: 'assets/MainChar-voice.mp3',
    MAINCHAR_VOICE_OGG: 'assets/MainChar-voice.ogg'
};

//FORMATTING
var STYLE_HUD = {
    font: "bold 25px Helvetica",
    fill: "#000000",
    align: "center"
};

// Enemy Data

var ENEMY_ATTRACTION_FACTOR = 0.5;
var ENEMY_REPULSION_FACTOR = 1.0;
var ENEMY_REPULSION_CUTOFF = 210;

// Level Data

var LEVEL_DATA = [{
    TITLE: '"Cocktail Hour"',
    PLUS_EFFECT: 0.15,
    MINUS_EFFECT: 0.09,
    NUM_ENEMIES1: 22,
    NUM_ENEMIES2: 22,
    NUM_SEEKERS: 0,
    NUM_AVOIDERS: 0
}, {
    TITLE: '"The Party"',
    PLUS_EFFECT: 0.14,
    MINUS_EFFECT: 0.11,
    NUM_ENEMIES1: 27,
    NUM_ENEMIES2: 17,
    NUM_SEEKERS: 0,
    NUM_AVOIDERS: 0
}, {
    TITLE: '"The Mob"',
    PLUS_EFFECT: 0.12,
    MINUS_EFFECT: 0.13,
    NUM_ENEMIES1: 10,
    NUM_ENEMIES2: 20,
    NUM_SEEKERS: 10,
    NUM_AVOIDERS: 0
}, {
    TITLE: '"The Creep"',
    PLUS_EFFECT: 0.12,
    MINUS_EFFECT: 0.13,
    NUM_ENEMIES1: 30,
    NUM_ENEMIES2: 30,
    NUM_SEEKERS: 0,
    NUM_AVOIDERS: 30
}, {
    TITLE: '"Crowding"',
    PLUS_EFFECT: 0.12,
    MINUS_EFFECT: 0.13,
    NUM_ENEMIES1: 50,
    NUM_ENEMIES2: 25,
    NUM_SEEKERS: 0,
    NUM_AVOIDERS: 0
}, {
    TITLE: '"Attention Starved"',
    PLUS_EFFECT: 0.12,
    MINUS_EFFECT: 0.13,
    NUM_ENEMIES1: 20,
    NUM_ENEMIES2: 5,
    NUM_SEEKERS: 0,
    NUM_AVOIDERS: 0
}, {
    TITLE: '"The Concert"',
    PLUS_EFFECT: 0.12,
    MINUS_EFFECT: 0.13,
    NUM_ENEMIES1: 35,
    NUM_ENEMIES2: 12,
    NUM_SEEKERS: 2,
    NUM_AVOIDERS: 2
}];
