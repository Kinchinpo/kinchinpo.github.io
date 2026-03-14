export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

export const CANVAS_WIDTH = 1152;
export const CANVAS_HEIGHT = 624;

export const TILE_SIZE = 16;
export const TILE_SPACING = 1; 
export const COLUMNS = 20; 
export const SCALE = 3; 
export const SCALED_SIZE = TILE_SIZE * SCALE; 

export const tilemapImg = new Image();
tilemapImg.src = './Tilemap/monochrome_tilemap_transparent.png';

export function drawTile(index, destX, destY, flipX = false) {
    if (index === 0) return; 
    const srcX = (index % COLUMNS) * (TILE_SIZE + TILE_SPACING);
    const srcY = Math.floor(index / COLUMNS) * (TILE_SIZE + TILE_SPACING);

    if (flipX) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(tilemapImg, srcX, srcY, TILE_SIZE, TILE_SIZE, -destX - SCALED_SIZE, destY, SCALED_SIZE, SCALED_SIZE);
        ctx.restore();
    } else {
        ctx.drawImage(tilemapImg, srcX, srcY, TILE_SIZE, TILE_SIZE, destX, destY, SCALED_SIZE, SCALED_SIZE);
    }
}