import { canvas, ctx, drawTile, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { keys } from './input.js';
import { solidBlocks, levels, currentLevel, crystals, springs, spikes, loadLevel } from './level.js';
import { updateLevelLogic } from './level.js';

// THÊM BIẾN BẬT TẮT HITBOX Ở ĐÂY (True = Bật, False = Tắt)
// export const DEBUG_HITBOX = true; 
export const DEBUG_HITBOX = false; 

export const player = {
    x: 48, y: 408, width: 24, height: 24, 
    vx: 0, vy: 0,
    speed: 2.5,       
    airSpeed: 3.5,    
    jumpPower: -10, gravity: 0.5, grounded: false,
    
    coyoteTimer: 0, coyoteTimeMax: 6, 
    jumpBufferTimer: 0, jumpBufferMax: 6, 
    
    facingX: 1, isDashing: false, canDash: true, dashTimer: 0, dashDuration: 15, dashSpeed: 12,
    dashLocked: false, frozen: false, 
    
    wallJumpTimer: 0, isClinging: false, 

    animations: { idle: [240], run: [240, 241, 242, 243, 244], jump: [245] },
    currentAnim: 'idle', frameTimer: 0, frameInterval: 8, animIndex: 0, tileIndex: 220
};

function initiateDash() {
    if (player.canDash && !player.isDashing && keys.dash && !player.dashLocked) {
        player.isDashing = true; player.canDash = false; player.dashLocked = true;
        player.dashTimer = player.dashDuration;

        let dx = 0; let dy = 0;
        if (keys.right) dx = 1; if (keys.left) dx = -1;
        if (keys.up) dy = -1; if (keys.down) dy = 1;

        if (dx === 0 && dy === 0) dx = player.facingX;
        if (dx !== 0 && dy !== 0) { dx *= 0.8; dy *= 0.8; }

        player.vx = dx * player.dashSpeed; player.vy = dy * player.dashSpeed;
    }
    if (!keys.dash) player.dashLocked = false;
}

export function updatePlayer() {
    updateLevelLogic(player);
    
    if (player.frozen) return; 

    if (keys.right) player.facingX = 1;
    if (keys.left) player.facingX = -1;

    let isDead = false;
    spikes.forEach(s => {
        if (player.x < s.x + s.width && player.x + player.width > s.x &&
            player.y < s.y + s.height && player.y + player.height > s.y) {
            isDead = true;
        }
    });

    if (isDead || player.y > CANVAS_HEIGHT) {
        player.x = levels[currentLevel].spawnX; 
        player.y = levels[currentLevel].spawnY; 
        player.vy = 0; player.vx = 0;
        player.canDash = true; player.isDashing = false; player.isClinging = false;
        loadLevel(currentLevel);
        return; 
    }

    crystals.forEach(c => {
        if (!c.active) {
            c.timer--;
            if (c.timer <= 0) c.active = true; 
        } else {
            if (player.x < c.x + c.width - 8 && player.x + player.width > c.x + 8 &&
                player.y < c.y + c.height - 8 && player.y + player.height > c.y + 8) {
                c.active = false;
                c.timer = 150; 
                player.canDash = true; 
            }
        }
    });

    springs.forEach(s => {
        if (s.state === 'extended') {
            s.timer--;
            if (s.timer <= 0) s.state = 'idle';
        }
        
        if (player.vy >= 0 && 
            player.x < s.x + s.width && 
            player.x + player.width > s.x &&
            player.y + player.height >= s.y && 
            player.y + player.height <= s.y + s.height + player.vy) {
            
            player.vy = -15; 
            player.grounded = false;
            player.canDash = true; 
            player.dashLocked = false;
            
            s.state = 'extended';
            s.timer = 15; 
        }
    });

    initiateDash();

    if (player.isDashing) {
        player.dashTimer--;
        if (player.dashTimer <= 0) {
            player.isDashing = false;
            player.vx *= 0.3;
            player.vy = player.vy < 0 ? player.vy * 0.3 : 0; 
        }
    } else {
        let currentSpeed = player.grounded ? player.speed : player.airSpeed;

        if (player.wallJumpTimer > 0) {
            player.wallJumpTimer--;
        } else {
            if (keys.right) player.vx = currentSpeed;
            else if (keys.left) player.vx = -currentSpeed;
            else player.vx = 0; 
        }

        let isTouchingWall = 0; 
        solidBlocks.forEach(block => {
            if (!block.isGate && !block.isBrick && player.y < block.y + block.height - 2 && player.y + player.height > block.y + 2) {
                if (player.x + player.width <= block.x && player.x + player.width + 4 >= block.x) isTouchingWall = 1; 
                if (player.x >= block.x + block.width && player.x - 4 <= block.x + block.width) isTouchingWall = -1;
            }
        });

        if (keys.grab && isTouchingWall !== 0) {
            player.isClinging = true;
            player.facingX = -isTouchingWall; 
        } else {
            player.isClinging = false;
        }

        if (player.isClinging) {
            player.vy = 0; 
            if (keys.up) player.vy = -2.5; 
            else if (keys.down) player.vy = 2.5; 

            if (keys.justJumped) {
                player.vy = player.jumpPower;
                player.vx = isTouchingWall === 1 ? -player.airSpeed * 2.5 : player.airSpeed * 2.5; 
                keys.justJumped = false;
                player.isClinging = false;
                player.wallJumpTimer = 12; 
            }
        } else {
            if (keys.justJumped) {
                player.jumpBufferTimer = player.jumpBufferMax;
                keys.justJumped = false; 
            } else if (player.jumpBufferTimer > 0) player.jumpBufferTimer--;

            if (player.grounded) player.coyoteTimer = player.coyoteTimeMax;
            else player.coyoteTimer--;

            if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
                player.vy = player.jumpPower;
                player.jumpBufferTimer = 0; player.coyoteTimer = 0;     
                player.grounded = false;
            }
            player.vy += player.gravity; 
        }
    }

    if (player.isClinging) player.currentAnim = 'idle'; 
    else if (player.isDashing || !player.grounded) player.currentAnim = 'jump';
    else if (Math.abs(player.vx) > 0) player.currentAnim = 'run';
    else player.currentAnim = 'idle';

    player.frameTimer++;
    if (player.frameTimer >= player.frameInterval) {
        player.frameTimer = 0; player.animIndex++;
        if (player.animIndex >= player.animations[player.currentAnim].length) player.animIndex = 0;
    }
    player.tileIndex = player.animations[player.currentAnim][player.animIndex] || player.animations.idle[0];

    player.x += player.vx; 
    if (player.x < 0 && currentLevel === 0) { 
        player.x = 0; player.vx = 0; 
    }
    
    checkCollisions('x');
    player.y += player.vy; player.grounded = false; checkCollisions('y');

    if (player.grounded) player.canDash = true;
}

function checkCollisions(axis) {
    solidBlocks.forEach(block => {
        if (player.x < block.x + block.width && player.x + player.width > block.x &&
            player.y < block.y + block.height && player.y + player.height > block.y) {
            if (axis === 'y') {
                if (player.vy > 0) { 
                    player.grounded = true; player.vy = 0; player.y = block.y - player.height;
                } else if (player.vy < 0) { 
                    player.vy = 0; player.y = block.y + block.height;
                }
            } else if (axis === 'x') {
                if (player.vx > 0) { player.vx = 0; player.x = block.x - player.width; } 
                else if (player.vx < 0) { player.vx = 0; player.x = block.x + block.width; }
            }
        }
    });
}

export function drawPlayer(offsetX = 0, offsetY = 0) {
    if (!player.canDash) ctx.filter = 'brightness(50%)';

    if (player.isDashing) {
        ctx.globalAlpha = 0.5;
        drawTile(player.tileIndex, player.x - 12 + offsetX - player.vx*0.5, player.y - 24 + offsetY - player.vy*0.5, player.facingX === -1); 
        ctx.globalAlpha = 1.0;
    }
    
    drawTile(player.tileIndex, player.x - 12 + offsetX, player.y - 24, player.facingX === -1); 

    ctx.filter = 'none'; 

    // --- HIỂN THỊ HITBOX NHÂN VẬT ---
    if (DEBUG_HITBOX) {
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x + offsetX, player.y + offsetY, player.width, player.height);
        ctx.lineWidth = 1; // Reset
    }
}