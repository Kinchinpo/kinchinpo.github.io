export const keys = { 
    right: false, left: false, up: false, down: false, 
    jump: false, dash: false, grab: false, 
    justJumped: false 
};

window.addEventListener('keydown', (e) => {
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyC','KeyX','KeyZ'].includes(e.code)) {
        e.preventDefault(); 
    }
    if(e.code === 'ArrowRight') keys.right = true;
    if(e.code === 'ArrowLeft') keys.left = true;
    if(e.code === 'ArrowUp') keys.up = true;
    if(e.code === 'ArrowDown') keys.down = true;
    
    if(e.code === 'KeyC' && !keys.jump) {
        keys.jump = true;
        keys.justJumped = true; 
    }
    if(e.code === 'KeyX') keys.dash = true;
    if(e.code === 'KeyZ') keys.grab = true; // Phím Z để bám tường
});

window.addEventListener('keyup', (e) => {
    if(e.code === 'ArrowRight') keys.right = false;
    if(e.code === 'ArrowLeft') keys.left = false;
    if(e.code === 'ArrowUp') keys.up = false;
    if(e.code === 'ArrowDown') keys.down = false;
    if(e.code === 'KeyC') keys.jump = false;
    if(e.code === 'KeyX') keys.dash = false;
    if(e.code === 'KeyZ') keys.grab = false; // Nhả phím Z
});