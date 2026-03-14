import { canvas, ctx, tilemapImg, CANVAS_WIDTH, CANVAS_HEIGHT } from './config.js';
import { drawMap, drawUI, levels, currentLevel, loadLevel } from './level.js';
import { updatePlayer, drawPlayer, player } from './player.js';

let isTransitioning = false;
let transitionProgress = 0;
const transitionSpeed = 24; 
let oldLevelIndex = 0;
let transitionDir = 1; 
let transitionAxis = 'x'; // THÊM MỚI: Theo dõi đang cuộn ngang hay dọc

function gameLoop() {
    ctx.imageSmoothingEnabled = false; 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // KIỂM TRA: Đi qua mép phải (Tiến lên)
    if (player.x > CANVAS_WIDTH && !isTransitioning) {
        isTransitioning = true;
        transitionProgress = 0;
        transitionDir = 1;
        transitionAxis = 'x'; // Cuộn ngang
        oldLevelIndex = currentLevel;
        player.frozen = true; 

        let nextLevel = currentLevel + 1;
        if (nextLevel >= levels.length) nextLevel = 0; 
        loadLevel(nextLevel); 
        player.x = 0; 
    }
    // KIỂM TRA: Đi qua mép trái (Lùi lại)
    else if (player.x + player.width < 0 && !isTransitioning && currentLevel > 0) {
        isTransitioning = true;
        transitionProgress = 0;
        transitionDir = -1;
        transitionAxis = 'x'; // Cuộn ngang
        oldLevelIndex = currentLevel;
        player.frozen = true;

        let prevLevel = currentLevel - 1;
        loadLevel(prevLevel);
        player.x = CANVAS_WIDTH - player.width; 
    }
    // KIỂM TRA MỚI: Bay qua mép trên (Lên trên màn 7)
    else if (player.y + player.height < 0 && !isTransitioning && currentLevel === 6) {
        isTransitioning = true;
        transitionProgress = 0;
        transitionDir = 1; 
        transitionAxis = 'y'; // Cuộn dọc
        oldLevelIndex = currentLevel;
        player.frozen = true;

        let nextLevel = 7;
        loadLevel(nextLevel);
        
        // Đặt nhân vật ở mép dưới của màn mới
        player.y = CANVAS_HEIGHT - player.height; 

        player.startX = player.x;
        player.targetX = levels[nextLevel].spawnX;
    }

    // --- ANIMATION CHUYỂN CẢNH ---
    if (isTransitioning) {
        transitionProgress += transitionSpeed;

        if (transitionAxis === 'x') {
            if (transitionDir === 1) player.x += player.speed * 0.5; 
            else player.x -= player.speed * 0.5;

            if (transitionDir === 1) {
                drawMap(oldLevelIndex, -transitionProgress, 0);
                drawMap(currentLevel, CANVAS_WIDTH - transitionProgress, 0);
                drawPlayer(CANVAS_WIDTH - transitionProgress, 0);
            } else {
                drawMap(oldLevelIndex, transitionProgress, 0);
                drawMap(currentLevel, -CANVAS_WIDTH + transitionProgress, 0);
                drawPlayer(-CANVAS_WIDTH + transitionProgress, 0);
            }

            if (transitionProgress >= CANVAS_WIDTH) endTransition();
            
        } else if (transitionAxis === 'y') {
            // Tự động đẩy nhân vật lên mượt mà
            player.y -= player.speed * 0.5; 

            let t = transitionProgress / CANVAS_HEIGHT;
            player.x = player.startX + (player.targetX - player.startX) * t;

            // Vẽ màn cũ kéo xuống, màn mới từ trên rớt xuống
            drawMap(oldLevelIndex, 0, transitionProgress);
            drawMap(currentLevel, 0, -CANVAS_HEIGHT + transitionProgress);
            drawPlayer(0, -CANVAS_HEIGHT + transitionProgress);

            if (transitionProgress >= CANVAS_HEIGHT) {
                player.x = player.targetX;
                endTransition();
            }
        }

    } else {
        updatePlayer();
        // Cập nhật tham số truyền vào hàm vẽ
        drawMap(currentLevel, 0, 0);
        drawUI(currentLevel, 0, 0);
        drawPlayer(0, 0);
    }

    requestAnimationFrame(gameLoop);
}

// Hàm phụ để code gọn hơn
function endTransition() {
    isTransitioning = false;
    player.frozen = false; 
    player.canDash = true; 
    player.dashLocked = false;
    player.vy = 0;
}

tilemapImg.onload = () => {
    player.x = levels[0].spawnX;
    player.y = levels[0].spawnY;
    gameLoop();
};