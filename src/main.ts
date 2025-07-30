import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export const DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down'
} as const; 

type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];

export const DIMENSIONS = { 
  WIDTH: 800,
  HEIGHT: 600
};

export const FRAME_LENGTH = 150;

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement | null;

if (!canvasElement) {
  throw new Error('Canvas element not found');
}

canvasElement.setAttribute('width', DIMENSIONS.WIDTH.toString());
canvasElement.setAttribute('height', DIMENSIONS.HEIGHT.toString());

const canvasContext = canvasElement.getContext('2d');
if (!canvasContext) {
  throw new Error('Canvas context not available');
}

type SnakeCell = { x: number; y: number };
const snake: SnakeCell[] = [];
let food: SnakeCell = { x: 0, y: 0 };
let points = 0;

let currentDirection: Direction = DIRECTIONS.RIGHT;

function initializeGame() {
  document.addEventListener('keydown', checkKey);

  createSnake();
  generateFood();
  gameLoop();
}

function gameLoop() {
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);
  canvasContext.strokeStyle = 'black';
  canvasContext.strokeRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);

  const next = getNextSnakePosition();

  // Get last element from snake and set it as first position
  const newPos = snake.pop();
  if (newPos) {
    newPos.x = next.X;
    newPos.y = next.Y;
    snake.unshift(newPos);
  }
  drawSnake();

  paintCell(food.x, food.y);
  checkCollision();
  setTimeout(gameLoop, FRAME_LENGTH);
}

function createSnake() {
  const length = 15;
  for (let i = length; i > 10; i--) {
    snake.push({ x: i, y: 5 });
  }
}

function getNextSnakePosition() {
  switch (currentDirection) {
    case DIRECTIONS.RIGHT:
      return { X: snake[0].x + 1, Y: snake[0].y };
    case DIRECTIONS.LEFT:
      return { X: snake[0].x - 1, Y: snake[0].y };
    case DIRECTIONS.UP:
      return { X: snake[0].x, Y: snake[0].y - 1 };
    case DIRECTIONS.DOWN:
      return { X: snake[0].x, Y: snake[0].y + 1 };
    default:
      return { X: snake[0].x, Y: snake[0].y };
  }
}

function checkKey(event: KeyboardEvent) {
  if (event.key === 'ArrowUp' && currentDirection !== DIRECTIONS.DOWN) {
    currentDirection = DIRECTIONS.UP;
  } else if (event.key === 'ArrowDown' && currentDirection !== DIRECTIONS.UP) {
    currentDirection = DIRECTIONS.DOWN;
  } else if (event.key === 'ArrowLeft' && currentDirection !== DIRECTIONS.RIGHT) {
    currentDirection = DIRECTIONS.LEFT;
  } else if (event.key === 'ArrowRight' && currentDirection !== DIRECTIONS.LEFT) {
    currentDirection = DIRECTIONS.RIGHT;
  }
}

function drawSnake() {
  snake.forEach(({ x, y }) => {
    paintCell(x, y);
  });
}

function generateFood() {
  food = {
    x: Math.round((Math.random() * (DIMENSIONS.WIDTH - 20)) / 20),
    y: Math.round((Math.random() * (DIMENSIONS.HEIGHT - 20)) / 20)
  };
  if (!checkIfFoodXYCorrect()) {
    generateFood();
  }
}

function clearFood() {
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(food.x * 20, food.y * 20, 20, 20);
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(food.x * 20, food.y * 20, 20, 20);
}

function checkIfFoodXYCorrect() {
  for (var i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      return false;
    }
  }
  return true;
}

function checkCollision() {
  const { x: snakeX, y: snakeY } = snake[0];

  const isOutOfBounds =
    snakeX < 0 ||
    snakeX > DIMENSIONS.WIDTH / 20 ||
    snakeY < 0 ||
    snakeY > DIMENSIONS.HEIGHT / 20;

  const hasCollisionWithItself = snake.some(
    ({ x, y }, idx) => idx !== 0 && snakeX === x && snakeY === y
  );

  if (isOutOfBounds || hasCollisionWithItself) {
    console.log('game over!');
  }

  if (snakeX === food.x && snakeY === food.y) {
    snake.push({ x: food.x, y: food.y });
    clearFood();
    generateFood();
  }
}

function paintCell(x, y) {
  canvasContext.fillStyle = 'blue';
  canvasContext.fillRect(x * 20, y * 20, 20, 20);
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(x * 20, y * 20, 20, 20);
}

initializeGame();
