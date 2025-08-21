import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { clearFood, generateFood } from './food';
import { DIMENSIONS, FRAME_LENGTH } from './game';
import { DIRECTIONS, Snake } from './snake';
import { drawSnake, paintCell } from './ui';

// DOM elements
const mainMenu = document.getElementById('main-menu') as HTMLElement | null;
const gameArea = document.getElementById('game-area') as HTMLElement | null;
const startBtn = document.getElementById(
  'start-btn'
) as HTMLButtonElement | null;
const scoreElement = document.getElementById('score') as HTMLElement | null;
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('final-score');
let gameOverModalInstance: Modal | null = null;

if (gameOverModal) {
  gameOverModal.addEventListener('hidden.bs.modal', () => {
    resetGame();
    if (mainMenu) mainMenu.style.display = '';
    if (gameArea) gameArea.style.display = 'none';
  });
}

let isGameOver = false;
let keyListenerAdded = false;

const canvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement | null;

if (!canvasElement) {
  throw new Error('Canvas element not found');
}

canvasElement.setAttribute('width', DIMENSIONS.WIDTH.toString());
canvasElement.setAttribute('height', DIMENSIONS.HEIGHT.toString());
const canvasContext = canvasElement.getContext('2d')!;

// Game state
const snake = new Snake();
let food = generateFood(snake.cells);
let points = 0;

function initializeGame(): void {
  if (!keyListenerAdded) {
    document.addEventListener('keydown', checkKey);
    keyListenerAdded = true;
  }
  snake.createSnake();
  food = generateFood(snake.cells);
  gameLoop();
}

function gameLoop(): void {
  if (isGameOver) return;

  // Clear board
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);
  canvasContext.strokeStyle = 'black';
  canvasContext.strokeRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);

  // Move snake
  snake.move();
  drawSnake(canvasContext, snake.cells);

  // Draw food
  paintCell(canvasContext, food.x, food.y);
  checkCollision();

  if (!isGameOver) {
    setTimeout(gameLoop, FRAME_LENGTH);
  }
}

function checkKey(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' && snake.direction !== DIRECTIONS.DOWN) {
    snake.direction = DIRECTIONS.UP;
  } else if (event.key === 'ArrowDown' && snake.direction !== DIRECTIONS.UP) {
    snake.direction = DIRECTIONS.DOWN;
  } else if (
    event.key === 'ArrowLeft' &&
    snake.direction !== DIRECTIONS.RIGHT
  ) {
    snake.direction = DIRECTIONS.LEFT;
  } else if (
    event.key === 'ArrowRight' &&
    snake.direction !== DIRECTIONS.LEFT
  ) {
    snake.direction = DIRECTIONS.RIGHT;
  }
}

function checkCollision(): void {
  const head = snake.cells[0];
  const maxX = DIMENSIONS.WIDTH / 20;
  const maxY = DIMENSIONS.HEIGHT / 20;

  const isOutOfBounds =
    head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY;
  const hasCollisionWithItself = snake.cells.some(
    ({ x, y }, idx) => idx !== 0 && head.x === x && head.y === y
  );

  if (isOutOfBounds || hasCollisionWithItself) {
    isGameOver = true;
    document.removeEventListener('keydown', checkKey);
    keyListenerAdded = false;
    showGameOverModal(points);
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    snake.grow();
    points += 1;
    updateScore();
    clearFood(canvasContext, food);
    food = generateFood(snake.cells);
  }
}

function updateScore(): void {
  if (scoreElement) scoreElement.textContent = `Score: ${points}`;
}

function showGameOverModal(score: number): void {
  if (finalScoreElement) finalScoreElement.textContent = `Your score: ${score}`;
  if (gameOverModal) {
    if (!gameOverModalInstance)
      gameOverModalInstance = new Modal(gameOverModal);
    gameOverModalInstance.show();
  }
}

function resetGame(): void {
  snake.cells.length = 0;
  points = 0;
  isGameOver = false;
  snake.direction = DIRECTIONS.RIGHT;
  updateScore();

  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);
  canvasContext.strokeStyle = 'black';
  canvasContext.strokeRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);

  if (keyListenerAdded) {
    document.removeEventListener('keydown', checkKey);
    keyListenerAdded = false;
  }
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (mainMenu) mainMenu.style.display = 'none';
    if (gameArea) gameArea.style.display = '';
    initializeGame();
  });
}
