import { SCALED_SIZE, drawTile, ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { player, DEBUG_HITBOX } from './player.js'; 
import { keys } from './input.js';

export const CASSETTE_ITEM = 888;
const cassetteImg = new Image();
cassetteImg.src = 'cassette-tape.svg';

export let level8Event = {
    collected: false,
    rotation: 0,
    x: 0, y: 0, 
    width: 48, height: 48,
    showPaper: false,
    asciiParticles: []
};

// --- THÊM 3 BIẾN NÀY ĐỂ QUẢN LÝ RECORD ---
export let recordedPaths = { 1: [], 6: [], 7: [] };
export let recordState = { hasTouchedGround: false };
export let playbackState = { active: false, phase: 0, timer: 0, index: 0, progress: 0, levels: [1, 6, 7] };
// -----------------------------------------

const T_TOP = 116;  
const T_MID = 136;  
const T_BOT = 156;  
const BLANK = 131;
const SIGN = 77;   
const ARROW_R = 73; 
const ARROW_U = 74; 

const GROUND_UP_LEFT = 270;
const GROUND_UP_MIDDLE = 271;
const GROUND_UP_RIGHT = 272;
const GROUND_UP = 273;
const GROUND_MIDDLE = 293;
const GROUND_BOT = 313;
const GROUND_MID_LEFT = 290;
const GROUND_MID_MIDDLE = 291;
const GROUND_MID_RIGHT = 292;
const GROUND_BOT_LEFT = 310;
const GROUND_BOT_MIDDLE = 311;
const GROUND_BOT_RIGHT = 312;

const SKY_LAND = 173;
const BRICK_BLOCK = 338;

const BLOCK_MID_L = 295;
const BLOCK_MID_M = 296;
const BLOCK_MID_R = 297;
const BLOCK_L = 315;
const BLOCK_M = 316;
const BLOCK_R = 317;

export const CRYSTAL = 62; 
export const CRYSTAL_EMPTY = 20;
export const SPRING_IDLE = 163;
export const SPIKE = 183; 
export const SPIKE_LEFT_WALL = 1000; 
export const SPIKE_RIGHT_WALL = 1001; 

export const CRYSTAL_KEY = 102; 
export const GATE_BLOCK = 375; 

// KHAI BÁO TƯỜNG TRƠN
export const ICE_WALL_L = 210;
export const ICE_WALL_R = 212;
export const ICE_WALL_BOT_L = 230;
export const ICE_WALL_BOT_M = 231;
export const ICE_WALL_BOT_R = 232;

const sootImg = new Image();
sootImg.src = 'soot_sprites_1.svg';

const konpeitoImg = new Image();
konpeitoImg.src = 'konpeito_1.svg';

const colorKonpeitos = {};
const konpeitoColors = ['#add8e6', '#ffb6c1', '#ffffff']; 

konpeitoImg.onload = () => {
    konpeitoColors.forEach(color => {
        let c = document.createElement('canvas');
        c.width = 40; c.height = 40;
        let cx = c.getContext('2d');
        cx.fillStyle = color;
        cx.fillRect(0, 0, 40, 40);
        cx.globalCompositeOperation = 'destination-in'; 
        cx.drawImage(konpeitoImg, 0, 0, 40, 40);
        colorKonpeitos[color] = c;
    });
};

export let level1Event = {
    triggered: false, sootActive: true, particles: [],
    sootX: 13 * SCALED_SIZE, sootY: 12 * SCALED_SIZE - 32 
};

export let level6Event = {
    keyCollected: false
};

export let currentLevel = 0;
export let levelData = [];
export let solidBlocks = [];
export let crystals = []; 
export let springs = []; 
export let spikes = []; 
export let keyCrystals = []; 

export const levels = [
    {
        // --- LEVEL 0: Title Screen ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,SIGN,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R,0], 
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT], 
            [GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT], 
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            // [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            // [GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT]
        ],
        signs: [{ col: 2, row: 5, text: "Move: [<-] [->]" }],
        texts: [
            { text: "PATH OF WHITE VALENTINES", size: "60px", yOffset: 48 + 48 }, 
            { text: "Hello, I am a nameless adventurer.\nI hope we can keep each other company and reach the end.\nOur journey will be very hazardous and horrendous, so we may fail quite a few times.\nBut feel free to try again and again.\nI am always here for you. Now, let's go!", size: "20px", yOffset: 372 } 
        ],
        spawnX: 48, spawnY: 216 + 48
    },
    {
        // --- LEVEL 1: Bậc thang đi xuống ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_UP_LEFT, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_MID_LEFT, T_MID, GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_MID_LEFT, 0, T_MID, T_MID, GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_MID_LEFT, 0, 0, 0, T_MID,T_MID, GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_MID_LEFT, 0, 0, 0, 0, 0, T_MID,T_MID, GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [GROUND_MID_LEFT, 0, 0, 0, 0, 0, 0, 0, T_MID,T_MID,GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,ARROW_R,0], 
            [GROUND_MID_LEFT, 0, 0, 0, 0, 0, 0, 0, 0, 0, T_MID,T_MID, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_RIGHT], 
            // [GROUND_MID_LEFT, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, GROUND_MID_LEFT, T_MID, T_MID, T_MID, T_MID, T_MID, T_MID, T_MID, T_MID, T_MID, T_MID, GROUND_MID_RIGHT], 
            // [GROUND_MID_LEFT, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, GROUND_MID_LEFT, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, GROUND_MID_RIGHT] 
        ],
        signs: [],
        spawnX: 48, spawnY: 216 + 48
    },
    {
        // --- LEVEL 2: Jump ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_MID_L,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,BLOCK_L,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M],
            // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R,0], 
            [0,0,0,0,0,0,0,0,0, 0,0,0, GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT], 
            [0,0,SIGN,0,0,GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,0, GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT],
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,0,0,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT]
        ],
        signs: [{ col: 2, row: 11, text: "Jump: [C]" }],
        spawnX: 48, spawnY: 504 + 48
    },
    {
        // --- LEVEL 3: Dash ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M],
            [0,0,SIGN,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R,0], 
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,0,0, GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT], 
            [GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT, 0,0,0,0, GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,GROUND_MID_RIGHT, 0,0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT]
        ],
        signs: [{ col: 2, row: 12, text: "Dash: [X]" }],
        spawnX: 48, spawnY: 408 + 48
    },
    {
        // --- LEVEL 4: Tutorial Combo ---
        map: [
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R,0], 
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT],
            [0,0,0,0,BLOCK_MID_R,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT],
            [BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_M,BLOCK_R,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [0,0,0,SIGN,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT], 
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT], 
            [GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,T_MID,GROUND_MID_RIGHT, 0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT],
            [GROUND_MID_LEFT,0,0,0,0,0,0,0,GROUND_MID_RIGHT, 0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT]
        ],
        signs: [{ col: 3, row: 13, text: "You're doing great!\nYou can combine movements\nto clear the level:\nUse [↑][->] + Jump[C] + Dash[X]"}],
        spawnX: 48, spawnY: 408 + 48
    },
    {
        // --- LEVEL 5: Dash Refill Crystal & Wall Climb ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_UP_LEFT],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT],
            [0,0,0,0,0,0,0,0,0,0,0,CRYSTAL,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT], 
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT],
            [0,0,SIGN,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SIGN,0,0,0,GROUND_MID_LEFT], 
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_MID_LEFT], 
            [GROUND_MID_LEFT,T_MID,T_MID,T_MID,GROUND_MID_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT,T_MID,T_MID,T_MID,T_MID,GROUND_MID_LEFT],
            [GROUND_MID_LEFT,0,0,0,GROUND_MID_RIGHT, 0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_MID_LEFT,0,0,0,0,GROUND_MID_LEFT]
        ],
        signs: [
            { col: 19, row: 9, text: "Wall Climb:\nHold [Z] to grab\nUse [↑] / [↓] to climb\nJump [C] to leap off!" },
            { col: 3, row: 9, text: "Dash Crystal!\nDash[X] into it to refill\nyour dash mid-air." }
        ],
        spawnX: 48, spawnY: 408 + 48
    },
    {
        // --- LEVEL 6 MỚI: Puzzle Cửa, Bậc thang & Ống Tường Trơn ---
        // map: [
        //     [ICE_WALL_BOT_L,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_R, SPIKE_LEFT_WALL,0,SPIKE_RIGHT_WALL, ICE_WALL_L, 0],
        //     [0,0,0,0,0,0,GATE_BLOCK,0,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, 0,0,SPIKE_RIGHT_WALL, ICE_WALL_L, ARROW_U],
        //     [0,0,0,0,0,0,GATE_BLOCK,0,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, SPIKE_LEFT_WALL,0,SPIKE_RIGHT_WALL, ICE_WALL_L, GROUND_UP],
        //     [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,SPIKE_RIGHT_WALL, GROUND_UP_LEFT,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, SPIKE_LEFT_WALL,0,0, ICE_WALL_L, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,T_MID,GROUND_MID_RIGHT, SPIKE_LEFT_WALL,0,0, GROUND_MID_LEFT,T_MID,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,ICE_WALL_R, SPIKE_LEFT_WALL,0,SPIKE_RIGHT_WALL, ICE_WALL_L, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,ICE_WALL_R, 0,0,SPIKE_RIGHT_WALL, ICE_WALL_L, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,SPIKE_RIGHT_WALL, GROUND_MID_LEFT,0,0,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, SPIKE_LEFT_WALL,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,SPIKE_RIGHT_WALL, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, SPIKE_LEFT_WALL,CRYSTAL_KEY,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0,0, 0, 0, 0, GROUND_MIDDLE],
        //     [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,SPRING_IDLE,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0,0, SPRING_IDLE, 0,0, GROUND_MIDDLE],
        //     [GROUND_BOT_LEFT,GROUND_BOT_MIDDLE,GROUND_BOT_RIGHT, GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_BOT_LEFT,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_RIGHT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_BOT]
        // ],
        map: [
            [ICE_WALL_BOT_L,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_M,ICE_WALL_BOT_R, 0,0,0, ICE_WALL_L, 0],
            [0,0,0,0,0,0,GATE_BLOCK,0,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, 0,0,0, ICE_WALL_L, ARROW_U],
            [0,0,0,0,0,0,GATE_BLOCK,0,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, 0,0,0, ICE_WALL_L, GROUND_UP],
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_RIGHT, 0,0,0, GROUND_UP_LEFT,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,0,0,ICE_WALL_R, 0,0,0, ICE_WALL_L, GROUND_MIDDLE],
            [GROUND_MID_LEFT,T_MID,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,T_MID,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,ICE_WALL_R, 0,0,SPIKE_RIGHT_WALL, ICE_WALL_L, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,ICE_WALL_R, 0,0,SPIKE_RIGHT_WALL, ICE_WALL_L, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,0,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0, 0,0,0, 0, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,CRYSTAL_KEY,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0,0, 0, 0, 0, GROUND_MIDDLE],
            [GROUND_MID_LEFT,0,GROUND_MID_RIGHT, 0,SPRING_IDLE,0, GROUND_MID_LEFT,0,0,0,0,0,0,0,0,GROUND_MID_RIGHT,0,0,0,0, SPRING_IDLE, 0,0, GROUND_MIDDLE],
            [GROUND_BOT_LEFT,GROUND_BOT_MIDDLE,GROUND_BOT_RIGHT, GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_BOT_LEFT,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_MIDDLE,GROUND_BOT_RIGHT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE, GROUND_UP_MIDDLE,GROUND_UP_MIDDLE, GROUND_BOT]
        ],
        spawnX: 48, spawnY: 72 + 48
    },
    {
        // --- LEVEL 7: Màn mới trơn ngang ---
        // map: [
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_UP],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,CRYSTAL,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SKY_LAND,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,CRYSTAL,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
        //     [BRICK_BLOCK,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,0,0,0,GROUND_BOT]
        // ],
        map: [
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,ARROW_R],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,GROUND_UP],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SKY_LAND,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,CRYSTAL,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BLOCK_MID_R,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,SPIKE_RIGHT_WALL,GROUND_MIDDLE],
            [BRICK_BLOCK,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT,0,0,0,0,0,0,0,0,0,0,0,GROUND_BOT]
        ],
        spawnX: 48, spawnY: 480 + 48
    },
    {
        // --- LEVEL 8: Băng Cassette & Kết thúc ---
        map: [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,CASSETTE_ITEM,0,0,0,0,0,0,0,0,0,0,0,0], // Băng cassette ở giữa
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [GROUND_UP_LEFT,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_MIDDLE,GROUND_UP_RIGHT],
            [GROUND_MID_LEFT,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_MIDDLE,GROUND_MID_RIGHT]
        ],
        spawnX: 48, spawnY: 480 + 48
    }
];

const solidTiles = [
    GROUND_UP_LEFT, GROUND_UP_MIDDLE, GROUND_UP_RIGHT, 
    GROUND_MID_LEFT, GROUND_MID_MIDDLE, GROUND_MID_RIGHT,
    GROUND_BOT_LEFT, GROUND_BOT_MIDDLE, GROUND_BOT_RIGHT,                
    T_TOP, T_MID, T_BOT, 
    BLOCK_L, BLOCK_M, BLOCK_R, 
    BLOCK_MID_L, BLOCK_MID_M, BLOCK_MID_R,
    ICE_WALL_L, ICE_WALL_R, // Khai báo tường trơn là khối cứng
    GROUND_UP, GROUND_MIDDLE, GROUND_BOT,
    ICE_WALL_BOT_L, ICE_WALL_BOT_M, ICE_WALL_BOT_R,
    SKY_LAND, BRICK_BLOCK,
]; 

export function loadLevel(index) {
    if (index >= levels.length) currentLevel = 0; 
    else currentLevel = index;
    
    if (currentLevel === 1) {
        level1Event.triggered = false;
        level1Event.sootActive = true;
        level1Event.particles = [];
    }
    
    if (currentLevel === 6) {
        level6Event.keyCollected = false;
    }

    if (currentLevel === 8) {
        level8Event.collected = false;
        level8Event.showPaper = false;
        level8Event.rotation = 0;
        playbackState.active = false;
        playbackState.phase = 0;
    }

    recordState.hasTouchedGround = false;
    
    levelData = levels[currentLevel].map;
    initMap();
}

export function initMap() {
    solidBlocks = [];
    crystals = [];
    springs = []; 
    spikes = []; 
    keyCrystals = []; 

    for (let row = 0; row < levelData.length; row++) {
        for (let col = 0; col < levelData[row].length; col++) {
            let tile = levelData[row][col];
            
            // XỬ LÝ KHỐI CỨNG VÀ CỜ ĐẶC BIỆT
            if (solidTiles.includes(tile) || tile === GATE_BLOCK) {
                let isGate = (tile === GATE_BLOCK);
                let isIce = (tile === ICE_WALL_L || tile === ICE_WALL_R);
                let isBrick = (tile === BLOCK_L || tile === BLOCK_M || tile === BLOCK_R || tile === BLOCK_MID_L || tile === BLOCK_MID_M || tile === BLOCK_MID_R || tile === BRICK_BLOCK)
                
                solidBlocks.push({ 
                    x: col * SCALED_SIZE, 
                    y: row * SCALED_SIZE, 
                    width: SCALED_SIZE, 
                    height: SCALED_SIZE,
                    isGate: isGate,
                    isIce: isIce,
                    isBrick: isBrick 
                });
            }
            
            if (tile === CRYSTAL) {
                crystals.push({ x: col * SCALED_SIZE, y: row * SCALED_SIZE, width: SCALED_SIZE, height: SCALED_SIZE, active: true, timer: 0 });
            }
            if (tile === SPRING_IDLE) {
                springs.push({ x: col * SCALED_SIZE, y: row * SCALED_SIZE, width: SCALED_SIZE, height: SCALED_SIZE, state: 'idle', timer: 0 });
            }
            if (tile === CRYSTAL_KEY) {
                keyCrystals.push({ x: col * SCALED_SIZE, y: row * SCALED_SIZE, width: SCALED_SIZE, height: SCALED_SIZE });
            }
            
            if (tile === SPIKE) {
                spikes.push({ 
                    x: col * SCALED_SIZE + 10,  
                    y: row * SCALED_SIZE + 24,  
                    width: SCALED_SIZE - 20, 
                    height: SCALED_SIZE - 24 
                });
            } else if (tile === SPIKE_LEFT_WALL) {
                spikes.push({ 
                    x: col * SCALED_SIZE,       
                    y: row * SCALED_SIZE + 10,  
                    width: SCALED_SIZE - 24,    
                    height: SCALED_SIZE - 20 
                });
            } else if (tile === SPIKE_RIGHT_WALL) {
                spikes.push({ 
                    x: col * SCALED_SIZE + 24,  
                    y: row * SCALED_SIZE + 10,  
                    width: SCALED_SIZE - 24,    
                    height: SCALED_SIZE - 20 
                });
            }

            if (tile === CASSETTE_ITEM) {
                level8Event.x = col * SCALED_SIZE;
                level8Event.y = row * SCALED_SIZE;
            }
        }
    }
}

export function updateLevelLogic(player) {
    if ([1, 6, 7].includes(currentLevel)) {
        // Chỉ bắt đầu quay khi chạm đất lần đầu
        if (player.grounded && !recordState.hasTouchedGround) {
            recordState.hasTouchedGround = true;
            recordedPaths[currentLevel] = []; // Reset cuộn băng thành mảng rỗng
        }
        // Liên tục ghi toạ độ
        if (recordState.hasTouchedGround && !player.frozen) {
            recordedPaths[currentLevel].push({ x: player.x, y: player.y });
        }
    }

    // if (currentLevel !== 6) return;

    // if (!level6Event.keyCollected) {
    //     keyCrystals.forEach(k => {
    //         if (player.x < k.x + k.width && player.x + player.width > k.x &&
    //             player.y < k.y + k.height && player.y + player.height > k.y) {
    //             level6Event.keyCollected = true;
    //             solidBlocks = solidBlocks.filter(block => !block.isGate);
    //         }
    //     });
    // }
    if (currentLevel === 6) {
        if (!level6Event.keyCollected) {
            keyCrystals.forEach(k => {
                if (player.x < k.x + k.width && player.x + player.width > k.x &&
                    player.y < k.y + k.height && player.y + player.height > k.y) {
                    level6Event.keyCollected = true;
                    solidBlocks = solidBlocks.filter(block => !block.isGate);
                }
            });
        }
    }

    if (currentLevel === 8) {
        if (!level8Event.collected) {
            level8Event.rotation += 0.015; // Tăng góc quay liên tục

            // Quét hitbox: Xung quanh toạ độ x, y của Cassette
            let cx = level8Event.x - 12;
            let cy = level8Event.y - 12;
            let cw = level8Event.width + 24;
            let ch = level8Event.height + 24;

            if (player.x < cx + cw && player.x + player.width > cx &&
                player.y < cy + ch && player.y + player.height > cy) {
                
                level8Event.collected = true;
                level8Event.showPaper = true;
                
                // Đóng băng player và xoá lực rơi
                player.frozen = true;
                player.vx = 0;
                player.vy = 0;
            }
        }
        else if (level8Event.showPaper) {
            if (keys.justJumped) { // Bấm C để tắt
                level8Event.showPaper = false;
                keys.justJumped = false; // Tiêu thụ lượt bấm phím
                // player.frozen = false; // Rã đông nhân vật
                playbackState.active = true;
                playbackState.phase = 1;
                playbackState.index = 0;
                playbackState.progress = 0;
                playbackState.timer = 0;

                player.animations = { idle: [0], run: [0], jump: [0] }; 
                // 2. Thu nhỏ hitbox về 0 để lỡ có bật DEBUG_HITBOX cũng không thấy viền xanh lá
                player.width = 0;
                player.height = 0;
                // 3. Đặt nhân vật đứng yên giữa màn hình (an toàn, không kích hoạt chuyển map)
                player.x = CANVAS_WIDTH / 2 - 10;
                player.y = CANVAS_HEIGHT / 2;
            }
        }

        else if (playbackState.active) {
            // GIAI ĐOẠN 1: Vẽ lần lượt 3 record
            if (playbackState.phase === 1) {
                if (playbackState.index < playbackState.levels.length) {
                    let lvl = playbackState.levels[playbackState.index];
                    let path = recordedPaths[lvl];
                    
                    if (path && path.length > 0) {
                        playbackState.progress += 1.3; 
                        if (playbackState.progress >= path.length) {
                            playbackState.progress = path.length;
                            playbackState.index++; 
                            playbackState.progress = 0; 
                        }
                    } else {
                        playbackState.index++; 
                    }
                } else {
                    playbackState.phase = 2; // Chuyển sang Giai đoạn 2
                    playbackState.timer = 0;
                }
            } 
            // GIAI ĐOẠN 2: Thu nhỏ, xoay và nhập lại (Khoảng 2 giây)
            else if (playbackState.phase === 2) {
                playbackState.timer += 0.008; 
                if (playbackState.timer >= 1) {
                    playbackState.timer = 1;
                    playbackState.phase = 3; // Chuyển sang Giai đoạn 3
                    playbackState.timer = 0;
                }
            }
            // GIAI ĐOẠN 3: Fade in Trái tim (Khoảng 1.5 giây)
            else if (playbackState.phase === 3) {
                playbackState.timer += 0.01; 
                if (playbackState.timer >= 1) {
                    playbackState.timer = 1;
                    playbackState.phase = 4; // Hoàn thành
                }
            }

            // --- LOGIC ASCII BAY (Hoạt động từ Giai đoạn 2 trở đi) ---
            if (playbackState.phase >= 2) {
                const symbols = ['🌸🌸', '❀', '❀❁✿', '✾⋆.˚', '୨ৎ୨ৎ', '❤︎❤︎'];
                if (Math.random() < 0.1 && level8Event.asciiParticles.length < 50) {
                    level8Event.asciiParticles.push({
                        x: Math.random() * CANVAS_WIDTH,
                        y: CANVAS_HEIGHT + 20,
                        speedY: 0.5 + Math.random() * 1.5,
                        size: 12 + Math.random() * 20,
                        symbol: symbols[Math.floor(Math.random() * symbols.length)],
                        opacity: 1
                    });
                }
                for (let i = level8Event.asciiParticles.length - 1; i >= 0; i--) {
                    let p = level8Event.asciiParticles[i];
                    p.y -= p.speedY; 
                    p.opacity -= 0.0015; 
                    if (p.y < -50 || p.opacity <= 0) {
                        level8Event.asciiParticles.splice(i, 1);
                    }
                }
            }
        }
    }
}

export function drawMap(index, offsetX = 0, offsetY = 0) {
    const mapToDraw = levels[index].map;
    for (let row = 0; row < mapToDraw.length; row++) {
        for (let col = 0; col < mapToDraw[row].length; col++) {
            let tile = mapToDraw[row][col];
            
            if (tile === 0) continue;

            if (tile === CASSETTE_ITEM) continue;

            if (tile === CRYSTAL && index === currentLevel) {
                let c = crystals.find(c => c.x === col * SCALED_SIZE && c.y === row * SCALED_SIZE);
                if (c && !c.active) tile = CRYSTAL_EMPTY; 
            }

            if (tile === SPRING_IDLE && index === currentLevel) {
                let s = springs.find(s => s.x === col * SCALED_SIZE && s.y === row * SCALED_SIZE);
                if (s && s.state === 'extended') {
                    tile = s.timer > 10 ? 165 : 164; 
                }
            }

            if (index === 6) {
                if (tile === CRYSTAL_KEY && level6Event.keyCollected) continue; 
                if (tile === GATE_BLOCK && level6Event.keyCollected) continue; 
            }
            
            if (tile === SPIKE_LEFT_WALL) {
                ctx.save();
                ctx.translate(col * SCALED_SIZE + offsetX + SCALED_SIZE / 2, row * SCALED_SIZE + offsetY + SCALED_SIZE / 2);
                ctx.rotate(90 * Math.PI / 180); 
                drawTile(SPIKE, -SCALED_SIZE / 2, -SCALED_SIZE / 2);
                ctx.restore();
            } 
            else if (tile === SPIKE_RIGHT_WALL) {
                ctx.save();
                ctx.translate(col * SCALED_SIZE + offsetX + SCALED_SIZE / 2, row * SCALED_SIZE + offsetY + SCALED_SIZE / 2);
                ctx.rotate(-90 * Math.PI / 180); 
                drawTile(SPIKE, -SCALED_SIZE / 2, -SCALED_SIZE / 2);
                ctx.restore();
            } 
            else {
                drawTile(tile, col * SCALED_SIZE + offsetX, row * SCALED_SIZE + offsetY);
            }
        }
    }

    if (DEBUG_HITBOX) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        spikes.forEach(s => ctx.strokeRect(s.x + offsetX, s.y + offsetY, s.width, s.height));
        
        ctx.strokeStyle = "blue";
        // Đổi màu hitbox tường trơn để dễ nhìn
        solidBlocks.forEach(b => {
            ctx.strokeStyle = b.isIce ? "cyan" : "blue";
            ctx.strokeRect(b.x + offsetX, b.y + offsetY, b.width, b.height);
        });
        
        ctx.strokeStyle = "yellow";
        springs.forEach(s => ctx.strokeRect(s.x + offsetX, s.y + offsetY, s.width, s.height));

        if (currentLevel === 6 && !level6Event.keyCollected) {
            ctx.strokeStyle = "purple";
            keyCrystals.forEach(k => ctx.strokeRect(k.x + offsetX, k.y + offsetY, k.width, k.height));
        }
        
        ctx.lineWidth = 1; 
    }
}

export function drawUI(index, offsetX = 0, offsetY = 0) {
    if (index > 0) { // Không hiển thị chữ "LEVEL 0" ở màn hình bắt đầu
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = "bold 24px 'Courier New', Courier, monospace";
        ctx.textAlign = "left";
        // Toạ độ x: 20, y: 40 cộng thêm offset để trượt mượt mà khi chuyển cảnh
        ctx.fillText(`LEVEL ${index}`, 60 + offsetX, 40 + offsetY);
        ctx.restore();
    }

    const currentTexts = levels[index].texts;
    if (currentTexts) {
        currentTexts.forEach(t => {
            const textX = (CANVAS_WIDTH / 2) + offsetX;
            ctx.fillStyle = "white"; 
            ctx.font = `bold ${t.size} 'Courier New', Courier, monospace`;
            ctx.textAlign = "center";
            const lines = t.text.split('\n');
            const fontSize = parseInt(t.size); 
            const lineHeight = fontSize * 1.5;
            // ctx.fillText(t.text, textX, t.yOffset + offsetY);
            lines.forEach((line, i) => {
                // Mỗi dòng sẽ được cộng thêm khoảng cách i * lineHeight
                ctx.fillText(line, textX, t.yOffset + offsetY + (i * lineHeight));
            });
        });
    }

    if (!player.frozen) {
        const currentSigns = levels[index].signs;
        if (currentSigns) {
            currentSigns.forEach(sign => {
                const signX = sign.col * SCALED_SIZE + SCALED_SIZE / 2 + offsetX;
                const signY = sign.row * SCALED_SIZE + offsetY;
                const actualSignX = sign.col * SCALED_SIZE + SCALED_SIZE / 2;
                const dist = Math.abs((player.x + player.width / 2) - actualSignX);
                
                if (dist < 80) {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 16px 'Courier New', Courier, monospace";
                    ctx.textAlign = "center";
                    
                    const lines = sign.text.split('\n');
                    lines.forEach((line, i) => {
                        const yOffset = (lines.length - 1 - i) * 20;
                        ctx.fillText(line, signX, signY - 15 - yOffset); 
                    });
                }
            });
        }
    }

    if (index === 1 && sootImg.complete) {
        if (level1Event.sootActive) {
            const sx = level1Event.sootX + offsetX;
            const sy = level1Event.sootY + offsetY;
            ctx.save();
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 15; 
            ctx.drawImage(sootImg, sx, sy, 32, 32);
            ctx.restore();

            if (!player.frozen && Math.abs((player.x + player.width/2) - (level1Event.sootX + 16)) < 40 &&
                Math.abs((player.y + player.height/2) - (level1Event.sootY + 16)) < 40) {
                level1Event.sootActive = false;
                level1Event.triggered = true;
                konpeitoColors.forEach((c, i) => {
                    level1Event.particles.push({
                        x: level1Event.sootX - 4, y: level1Event.sootY - 4,
                        color: c, angle: (Math.PI * 2 / 3) * i - Math.PI/2, phase: 'burst', timer: 0
                    });
                });
            }
        }
        level1Event.particles.forEach(p => {
            if (!player.frozen) p.timer++;
            if (p.phase === 'burst') {
                if (!player.frozen) {
                    p.x += Math.cos(p.angle) * 1.5; p.y += Math.sin(p.angle) * 1.5 - 0.2; 
                    if (p.timer > 45) p.phase = 'circle';
                }
            } else if (p.phase === 'circle') {
                if (!player.frozen) {
                    p.angle += 0.03; 
                    let targetX = player.x + player.width/2 - 20 + Math.cos(p.angle) * 45;
                    let targetY = player.y + player.height/2 - 20 + Math.sin(p.angle) * 45;
                    p.x += (targetX - p.x) * 0.03; p.y += (targetY - p.y) * 0.03;
                    if (p.timer > 160) p.phase = 'absorb'; 
                }
            } else if (p.phase === 'absorb') {
                if (!player.frozen) {
                    let targetX = player.x + player.width/2 - 20;
                    let targetY = player.y + player.height/2 - 20;
                    p.x += (targetX - p.x) * 0.04; p.y += (targetY - p.y) * 0.04;
                    if (Math.abs(p.x - targetX) < 5 && Math.abs(p.y - targetY) < 5) p.dead = true;
                }
            }
            if (!p.dead && colorKonpeitos[p.color]) {
                ctx.save(); ctx.shadowColor = p.color; ctx.shadowBlur = 20; 
                ctx.drawImage(colorKonpeitos[p.color], p.x + offsetX, p.y + offsetY, 40, 40); 
                ctx.restore();
            }
        });
        level1Event.particles = level1Event.particles.filter(p => !p.dead);
    }

    if (index === 8) {
        if (!level8Event.collected && cassetteImg.complete) {
            ctx.save();
            
            // Tạo thêm hiệu ứng bồng bềnh (lên xuống) nhẹ nhàng
            const floatY = Math.sin(level8Event.rotation * 2) * 8;
            const centerX = level8Event.x + level8Event.width / 2 + offsetX;
            const centerY = level8Event.y + level8Event.height / 2 + offsetY + floatY;
            
            // Glowing effect (Phát sáng viền)
            ctx.shadowColor = '#ffffff'; // Màu trắng
            ctx.shadowBlur = 25;
            
            ctx.translate(centerX, centerY);
            let flipScale = Math.cos(level8Event.rotation);
            ctx.scale(flipScale, 1);
            
            // Vẽ quanh tâm
            ctx.drawImage(cassetteImg, -level8Event.width / 2, -level8Event.height / 2, level8Event.width, level8Event.height);
            ctx.restore();
        }

        if (level8Event.showPaper) {
            // Hiển thị tờ giấy căn giữa Canvas
            const paperWidth = 650; // Nới rộng giấy ra một chút cho vừa text
            const paperHeight = 280;
            const paperX = (CANVAS_WIDTH - paperWidth) / 2 + offsetX;
            const paperY = (CANVAS_HEIGHT - paperHeight) / 2 + offsetY;

            // Nền giấy vàng nhạt & Viền
            ctx.fillStyle = '#fdf6e3'; 
            ctx.fillRect(paperX, paperY, paperWidth, paperHeight);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.strokeRect(paperX, paperY, paperWidth, paperHeight);

            // --- VẼ TEXT NỘI DUNG (CĂN TRÁI) ---
            ctx.fillStyle = '#222';
            ctx.font = "bold 18px 'Courier New', Courier, monospace";
            ctx.textAlign = "left"; // Căn lề trái

            const message = "I'm really glad we are here!\nIt's been a tough journey, but we made it.\nThank you for walking this path with me to the very end.\nHowever, there is something special\nabout the journey we've been through.\nHave you realized it yet?";
            
            const lines = message.split('\n');
            const paddingLeft = paperX + 30; // Cách lề trái 30px
            let currentY = paperY + 60; // Cách lề trên 60px

            lines.forEach(line => {
                ctx.fillText(line, paddingLeft, currentY);
                currentY += 30; // Mỗi dòng cách nhau 30px
            });

            // --- VẼ HƯỚNG DẪN TẮT (CĂN GIỮA DƯỚI ĐÁY) ---
            ctx.textAlign = "center";
            ctx.font = "italic 16px 'Courier New', Courier, monospace";
            ctx.fillStyle = '#777';
            ctx.fillText("[Press C to close]", paperX + paperWidth / 2, paperY + paperHeight - 25);   
            
            ctx.save();
            // Căn vị trí ở góc dưới phải (cách mép 35px)
            ctx.translate(paperX + paperWidth - 55, paperY + paperHeight - 75);
            // Xoay trái tim nghiêng một chút (khoảng 20 độ)
            ctx.rotate(Math.PI / 9); 
            ctx.fillStyle = "#ff3366"; // Màu hồng/đỏ
            
            ctx.beginPath();
            let hw = 50; // Chiều rộng trái tim nhỏ
            let hh = 50; // Chiều cao trái tim nhỏ
            ctx.moveTo(0, hh / 4);
            ctx.quadraticCurveTo(0, 0, -hw / 4, 0);
            ctx.quadraticCurveTo(-hw / 2, 0, -hw / 2, hh / 4);
            ctx.quadraticCurveTo(-hw / 2, hh / 2, 0, hh);
            ctx.quadraticCurveTo(hw / 2, hh / 2, hw / 2, hh / 4);
            ctx.quadraticCurveTo(hw / 2, 0, hw / 4, 0);
            ctx.quadraticCurveTo(0, 0, 0, hh / 4);
            ctx.fill();
            ctx.restore();
        }

        // --- PHẦN VẼ RECORD VÀ KẾT THÚC ---
        if (index === 8 && playbackState.active) {
            ctx.save();
            ctx.fillStyle = "#3b232a";
            ctx.fillRect(offsetX, offsetY, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.restore();

            // Hàm tính toán Toán học
            const lerp = (a, b, t) => a + (b - a) * t;
            const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            // --- KHAI BÁO CÁC TOẠ ĐỘ CHUẨN ---
            let startScale = 0.25;
            let itemWidth = CANVAS_WIDTH * startScale; // 288
            let gap = 72;
            let startY_center = CANVAS_HEIGHT / 2;
            let startX_center = [ gap + itemWidth/2, gap*2 + itemWidth*1.5, gap*3 + itemWidth*2.5 ]; // Slot 0, 1, 2

            let cx = CANVAS_WIDTH / 2;
            let heartW = 660, heartH = 560;
            let heartY = (CANVAS_HEIGHT - heartH) / 2 + 20;
            let lobeOffset = heartW / 3.6;
            let lobeY = heartY + heartH * 0.22;
            let leftX = cx - lobeOffset;
            let rightX = cx + lobeOffset;
            let targetScale = 160 / CANVAS_WIDTH;

            // --- HÀM VẼ Ô VUÔNG ĐA NĂNG (DÙNG CHO MỌI GIAI ĐOẠN) ---
            const drawAnimSquare = (x, y, scale, rotation, paths, letter, letterAlpha = 1, bgAlpha = 0.95, borderAlpha = 0.4) => {
                ctx.save();
                ctx.translate(x + offsetX, y + offsetY);
                ctx.rotate(rotation);
                
                let size = CANVAS_WIDTH * scale; 
                
                ctx.fillStyle = `rgba(20, 20, 20, ${bgAlpha})`;
                ctx.fillRect(-size/2, -size/2, size, size);
                ctx.strokeStyle = `rgba(255, 255, 255, ${borderAlpha})`;
                ctx.lineWidth = 3;
                ctx.strokeRect(-size/2, -size/2, size, size);

                paths.forEach(item => {
                    if (!item.path || item.path.length === 0) return;
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(-size/2, -size/2, size, size);
                    ctx.clip();

                    ctx.scale(scale, scale);
                    ctx.translate(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2);

                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.shadowColor = "red";
                    ctx.shadowBlur = 10;
                    ctx.strokeStyle = "#ff3333";
                    ctx.lineWidth = 14;

                    ctx.beginPath();
                    ctx.moveTo(item.path[0].x + 12, item.path[0].y + 12);
                    for (let i = 1; i < item.path.length; i++) {
                        ctx.lineTo(item.path[i].x + 12, item.path[i].y + 12);
                    }
                    ctx.stroke();
                    ctx.restore();
                });

                if (letter) {
                    ctx.rotate(-rotation); // Giữ chữ luôn thẳng đứng
                    ctx.globalAlpha = letterAlpha;
                    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
                    ctx.font = "bold 80px 'Courier Mill', Courier, monospace";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = "#ffffff";
                    ctx.shadowBlur = 15;
                    ctx.fillText(letter, 0, 0);
                }
                ctx.restore();
            };

            // ==========================================
            // GIAI ĐOẠN 1: VẼ ĐƯỜNG ĐI LẦN LƯỢT
            // ==========================================
            if (playbackState.phase === 1) {
                // 1. Vẽ các record ĐÃ vẽ xong (Nằm yên ở vị trí cũ)
                for (let i = 0; i < playbackState.index; i++) {
                    let lvl = playbackState.levels[i];
                    drawAnimSquare(startX_center[i], startY_center, startScale, 0, [{path: recordedPaths[lvl]}], null);
                }

                // 2. Vẽ record ĐANG chạy (Full màn hình)
                if (playbackState.index < playbackState.levels.length) {
                    let lvl = playbackState.levels[playbackState.index];
                    let path = recordedPaths[lvl];
                    
                    ctx.save();
                    ctx.globalAlpha = 0.5; 
                    drawMap(lvl, offsetX, offsetY);
                    ctx.restore();

                    ctx.save();
                    ctx.fillStyle = "white";
                    ctx.font = "bold 24px 'Courier New', Courier, monospace";
                    ctx.textAlign = "left";
                    // Dùng biến 'lvl' thay vì 'index' để lấy đúng số map đang chiếu
                    ctx.fillText(`LEVEL ${lvl}`, 60 + offsetX, 40 + offsetY);
                    ctx.restore();

                    if (path && path.length > 0) {
                        ctx.save();
                        ctx.translate(offsetX, offsetY);
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.shadowColor = "red";
                        ctx.shadowBlur = 15;
                        ctx.strokeStyle = "#ff3333";
                        ctx.lineWidth = 4;

                        ctx.beginPath();
                        ctx.moveTo(path[0].x + 12, path[0].y + 12);
                        for (let i = 1; i < playbackState.progress && i < path.length; i++) {
                            ctx.lineTo(path[i].x + 12, path[i].y + 12);
                        }
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            } 
            // ==========================================
            // GIAI ĐOẠN 2, 3, 4: HIỆU ỨNG KẾT THÚC
            // ==========================================
            else if (playbackState.phase >= 2) {
                
                // --- VẼ ASCII BAY ---
                ctx.save();
                ctx.textAlign = "center";
                ctx.fillStyle = "#ffd1dc"; 
                ctx.shadowColor = "#ffb6c1";
                ctx.shadowBlur = 10;
                level8Event.asciiParticles.forEach(p => {
                    ctx.globalAlpha = p.opacity;
                    ctx.font = `${p.size}px monospace`;
                    ctx.fillText(p.symbol, p.x + offsetX, p.y + offsetY);
                });
                ctx.restore();

                // --- TÍNH TOÁN HIỆU ỨNG GIAI ĐOẠN 2 ---
                let easeT = easeInOut(playbackState.phase === 2 ? playbackState.timer : 1);
                
                let curX0 = lerp(startX_center[0], leftX, easeT);
                let curY0 = lerp(startY_center, lobeY, easeT);
                let curS0 = lerp(startScale, targetScale, easeT);
                let curR0 = lerp(0, Math.PI/2, easeT);

                let curX1 = lerp(startX_center[1], rightX, easeT);
                let curY1 = lerp(startY_center, lobeY, easeT);
                let curS1 = lerp(startScale, targetScale, easeT);

                let curX2 = lerp(startX_center[2], leftX, easeT);
                let curY2 = lerp(startY_center, lobeY, easeT);
                let curS2 = lerp(startScale, targetScale, easeT);
                let curR2 = lerp(0, Math.PI/2, easeT);

                // Hình vuông 3 (Level 7) sẽ mờ dần viền và nền để hòa nhập vào hình vuông 1
                let fadeBg = lerp(0.95, 0, easeT);
                let fadeBorder = lerp(0.4, 0, easeT);

                // --- VẼ KHUNG HÌNH CHUYỂN ĐỘNG ---
                drawAnimSquare(curX0, curY0, curS0, curR0, [{path: recordedPaths[1]}], null, easeT);
                drawAnimSquare(curX1, curY1, curS1, 0, [{path: recordedPaths[6]}], null, easeT);
                drawAnimSquare(curX2, curY2, curS2, curR2, [{path: recordedPaths[7]}], null, 0, fadeBg, fadeBorder);

                // --- VẼ TRÁI TIM (Giai đoạn 3 và 4) ---
                if (playbackState.phase >= 3) {
                    let heartAlpha = playbackState.phase === 3 ? playbackState.timer : 1;
                    
                    ctx.save();
                    ctx.translate(cx + offsetX, heartY + offsetY);
                    ctx.globalAlpha = heartAlpha; // Trái tim từ từ xuất hiện
                    
                    ctx.fillStyle = "rgba(255, 51, 102, 0.08)"; 
                    ctx.shadowColor = "#ff3366";
                    ctx.shadowBlur = 40;
                    ctx.strokeStyle = "#ff3366";
                    ctx.lineWidth = 8;
                    
                    ctx.beginPath();
                    ctx.moveTo(0, heartH / 4);
                    ctx.quadraticCurveTo(0, 0, -heartW / 4, 0);
                    ctx.quadraticCurveTo(-heartW / 2, 0, -heartW / 2, heartH / 4);
                    ctx.quadraticCurveTo(-heartW / 2, heartH / 2, 0, heartH);
                    ctx.quadraticCurveTo(heartW / 2, heartH / 2, heartW / 2, heartH / 4);
                    ctx.quadraticCurveTo(heartW / 2, 0, heartW / 4, 0);
                    ctx.quadraticCurveTo(0, 0, 0, heartH / 4);
                    ctx.fill();
                    ctx.stroke();

                    // Text nằm trong lòng trái tim
                    ctx.translate(0, heartH * 0.55); 
                    ctx.fillStyle = "#ffffff";
                    ctx.shadowColor = "#ff3366";
                    ctx.shadowBlur = 20;
                    ctx.font = "bold 40px 'Courier New', Courier, monospace";
                    ctx.textAlign = "center";
                    
                    const lines = ["Happy", "White", "Valentine"];
                    lines.forEach((line, i) => {
                        ctx.fillText(line, 0, i * 45); 
                    });
                    
                    ctx.restore();
                }
            }
        }
    }
}
loadLevel(0);