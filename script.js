const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

let box = 20;
let snake, food, score, direction, gameInterval;
let playerName = "Player";
let snakeColor = "#4CAF50";

function resize() {
    let size = Math.min(window.innerWidth * 0.95, 400);
    canvas.width = Math.floor(size / box) * box;
    canvas.height = Math.floor(size / box) * box;
}
window.addEventListener('resize', resize);
resize();

function toggleMenu(id) {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    if(id) document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    playerName = document.getElementById("playerName").value || "Player";
    snakeColor = document.getElementById("snakeColor").value;
    toggleMenu('');
    if(window.innerWidth < 768) document.getElementById('controls').classList.remove('hidden');
    
    score = 0;
    direction = "right";
    snake = [{x: 10 * box, y: 10 * box}];
    spawnFood();
    
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 170);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width/box)) * box,
        y: Math.floor(Math.random() * (canvas.height/box)) * box
    };
}

document.addEventListener("keydown", e => {
    if(e.keyCode == 37 && direction != "right") direction = "left";
    else if(e.keyCode == 38 && direction != "down") direction = "up";
    else if(e.keyCode == 39 && direction != "left") direction = "right";
    else if(e.keyCode == 40 && direction != "up") direction = "down";
});

function changeDir(d) {
    if(d == 'left' && direction != "right") direction = "left";
    if(d == 'up' && direction != "down") direction = "up";
    if(d == 'right' && direction != "left") direction = "right";
    if(d == 'down' && direction != "up") direction = "down";
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? snakeColor : "#ddd";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "#ff4444";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction == "left") snakeX -= box;
    if(direction == "up") snakeY -= box;
    if(direction == "right") snakeX += box;
    if(direction == "down") snakeY += box;

    if(snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(snakeX, snakeY, snake)) {
        clearInterval(gameInterval);
        gameOver();
        return;
    }

    if(snakeX == food.x && snakeY == food.y) {
        score++;
        spawnFood();
    } else {
        snake.pop();
    }
    snake.unshift({x: snakeX, y: snakeY});
}

function collision(x, y, array) {
    for(let i = 0; i < array.length; i++) {
        if(x == array[i].x && y == array[i].y) return true;
    }
    return false;
}

function gameOver() {
    document.getElementById("final-score").innerText = "Điểm của bạn: " + score;
    toggleMenu('death-menu');
}

function downloadAchievement() {
    const tempCanvas = document.createElement("canvas");
    const tCtx = tempCanvas.getContext("2d");
    tempCanvas.width = 600;
    tempCanvas.height = 400;

    tCtx.fillStyle = "#1a1a1a";
    tCtx.fillRect(0, 0, 600, 400);
    tCtx.strokeStyle = snakeColor;
    tCtx.lineWidth = 10;
    tCtx.strokeRect(20, 20, 560, 360);
    
    tCtx.fillStyle = "white";
    tCtx.textAlign = "center";
    tCtx.font = "bold 40px Arial";
    tCtx.fillText("KỶ LỤC MỚI!", 300, 100);
    
    tCtx.font = "100px Arial";
    tCtx.fillStyle = snakeColor;
    tCtx.fillText(score, 300, 220);

    if(document.getElementById("includeName").checked) {
        tCtx.font = "20px Arial";
        tCtx.fillText("Người chơi: " + playerName, 300, 320);
    }

    const link = document.createElement('a');
    link.download = 'SnakeAchievement.png';
    link.href = tempCanvas.toDataURL();
    link.click();
}
