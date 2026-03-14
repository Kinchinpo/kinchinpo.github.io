export const keys = { 
    right: false, left: false, up: false, down: false, 
    jump: false, dash: false, grab: false, 
    justJumped: false 
};

window.addEventListener('keydown', (e) => {
    // Thêm các phím I, K, J, L vào danh sách chặn cuộn trang trình duyệt
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyC','KeyX','KeyZ','KeyI','KeyK','KeyJ','KeyL'].includes(e.code)) {
        e.preventDefault(); 
    }
    
    // Áp dụng nhận diện song song: Mũi tên HOẶC phím chữ
    if(e.code === 'ArrowRight' || e.code === 'KeyL') keys.right = true;
    if(e.code === 'ArrowLeft'  || e.code === 'KeyJ') keys.left = true;
    if(e.code === 'ArrowUp'    || e.code === 'KeyI') keys.up = true;
    if(e.code === 'ArrowDown'  || e.code === 'KeyK') keys.down = true;
    
    if(e.code === 'KeyC' && !keys.jump) {
        keys.jump = true;
        keys.justJumped = true; 
    }
    if(e.code === 'KeyX') keys.dash = true;
    if(e.code === 'KeyZ') keys.grab = true; // Phím Z để bám tường
});

window.addEventListener('keyup', (e) => {
    // Tương tự khi nhả phím
    if(e.code === 'ArrowRight' || e.code === 'KeyL') keys.right = false;
    if(e.code === 'ArrowLeft'  || e.code === 'KeyJ') keys.left = false;
    if(e.code === 'ArrowUp'    || e.code === 'KeyI') keys.up = false;
    if(e.code === 'ArrowDown'  || e.code === 'KeyK') keys.down = false;
    
    if(e.code === 'KeyC') keys.jump = false;
    if(e.code === 'KeyX') keys.dash = false;
    if(e.code === 'KeyZ') keys.grab = false; // Nhả phím Z
});