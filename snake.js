// 获取页面元素
var canvas = document.getElementById('snake');
var ctx = canvas.getContext('2d');
var gameOverDiv = document.getElementById('gameOver');
var scoreSpan = document.getElementById('scoreSpan');

// 初始化游戏状态
let tileSize = 10;
let tileCount = 40;
let snakeColor = '#333333'; // 蛇的颜色
let foodColor = '#333333'; // 食物的颜色
let snake = [{x: 150, y: 150}, {x: 140, y: 150}];
let snakeHead = {x: 150, y: 150};
let food = {x: 0, y: 0};
let score = 0;
let direction = 'right';
let speed = 140;
let gameover = false;
let isPaused = false;
let foodVisible = true;
let lastUserInputTime = 0;

// 生成食物
function createFood() {
  food.x = Math.floor(Math.random() * tileCount) * tileSize;
  food.y = Math.floor(Math.random() * tileCount) * tileSize;
}

// 检查蛇头是否吃到食物
function checkFoodCollision() {
  if (snakeHead.x === food.x && snakeHead.y === food.y) {
    snake.push({ x: 0, y: 0 }); // 添加新的蛇身体段
    createFood(); // 生成新的食物
    score++;
    scoreSpan.textContent = score; // 更新HTML页面上的分数显示
  }
}

// 检查蛇身碰撞
function checkSnakeCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// 检查蛇头是否撞墙
function checkWallCollision() {
  if (
    snakeHead.x < 0 || snakeHead.x >= canvas.width ||
    snakeHead.y < 0 || snakeHead.y >= canvas.height
  ) {
    return true;
  }
  return false;
}

// 绘制矩形
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// 游戏结束
function gameOver() {
  gameover = true;
  isPaused = true;
  gameOverDiv.style.display = 'block';
}

// 重新开始游戏
function restartGame() {
  gameover = false;
  score = 0;
  snake = [{x: 150, y: 150}, {x: 140, y: 150}]; // 重置蛇的初始状态
  snakeHead = {x: 150, y: 150};
  direction = 'right';
  scoreSpan.textContent = score; // 重置分数显示
  createFood(); // 生成新的食物
  gameOverDiv.style.display = 'none';
  isPaused = false;
}

// 游戏逻辑
function update() {
  if (!isPaused) {
    // 控制蛇头方向
    if (direction === 'up') snakeHead.y -= tileSize;
    else if (direction === 'down') snakeHead.y += tileSize;
    else if (direction === 'left') snakeHead.x -= tileSize;
    else if (direction === 'right') snakeHead.x += tileSize;

    // 检查蛇头是否吃到食物
    checkFoodCollision();

    // 控制蛇身体移动
    snake.pop();
    snake.unshift({ ...snakeHead }); // 创建新对象以防止引用问题

    // 检查蛇身是否与自身碰撞或撞墙
    if (checkSnakeCollision() || checkWallCollision()) {
      gameOver();
    }
  }
}

// 绘制
function draw() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制蛇
  for (let i = 0; i < snake.length; i++) {
    let segment = snake[i];
    drawRect(segment.x, segment.y, tileSize, tileSize, snakeColor);
  }

  // 绘制食物
  if (foodVisible) {
    drawRect(food.x, food.y, tileSize, tileSize, foodColor);
  }
}

// 游戏循环
function loop(timestamp) {
  if (!gameover) {
    const timeSinceLastInput = timestamp - lastUserInputTime;
    if (timeSinceLastInput >= speed) {
      update();
      draw();
      foodVisible = !foodVisible;
      lastUserInputTime = timestamp;
    }
  }

  // 使用 requestAnimationFrame 更新游戏循环
  requestAnimationFrame(loop);
}

// 输入处理
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  } else if (e.key === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  } else if (e.key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  } else if (e.key === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  } else if (e.key === ' ') { // 空格键暂停/恢复游戏
    isPaused = !isPaused;
  }
});

// 重新开始游戏
restart.addEventListener('click', restartGame);

// 开始游戏
createFood();
requestAnimationFrame(loop);
