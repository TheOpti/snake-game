import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

// Direction constants
export const DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down'
} as const;

type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS];

// Game dimensions and cell size
export const DIMENSIONS = {
  WIDTH: 800,
  HEIGHT: 600
};
const CELL_SIZE = 20; // Size of each cell in pixels
export const FRAME_LENGTH = 150; // ms between frames

// Get canvas and context
const canvasElement = document.getElementById(
  'canvas'
) as HTMLCanvasElement | null;

if (!canvasElement) {
  throw new Error('Canvas element not found');
}

canvasElement.setAttribute('width', DIMENSIONS.WIDTH.toString());
canvasElement.setAttribute('height', DIMENSIONS.HEIGHT.toString());

const canvasContext = canvasElement.getContext('2d')!;

// Snake and food types
type SnakeCell = { x: number; y: number };
const snake: SnakeCell[] = [];
let food: SnakeCell = { x: 0, y: 0 };
let points = 0;
let currentDirection: Direction = DIRECTIONS.RIGHT;

/**
 * Initializes the game: sets up event listeners, creates snake, generates food, and starts the loop.
 */
function initializeGame(): void {
  document.addEventListener('keydown', checkKey);
  createSnake();
  generateFood();
  gameLoop();
}

/**
 * Main game loop: draws the board, moves the snake, checks collisions, and schedules next frame.
 */
function gameLoop(): void {
  // Clear board
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);
  canvasContext.strokeStyle = 'black';
  canvasContext.strokeRect(0, 0, DIMENSIONS.WIDTH, DIMENSIONS.HEIGHT);

  // Move snake
  const next = getNextSnakePosition();
  const newPos = snake.pop();

  if (newPos) {
    newPos.x = next.X;
    newPos.y = next.Y;
    snake.unshift(newPos);
  }

  drawSnake();

  // Draw food and check collisions
  paintCell(food.x, food.y);
  checkCollision();
  setTimeout(gameLoop, FRAME_LENGTH);
}

/**
 * Creates the initial snake.
 */
function createSnake(): void {
  const length = 15;
  for (let i = length; i > 10; i--) {
    snake.push({ x: i, y: 5 });
  }
}

/**
 * Calculates the next position for the snake's head.
 */
function getNextSnakePosition(): { X: number; Y: number } {
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

/**
 * Handles keyboard input to change snake direction.
 */
function checkKey(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp' && currentDirection !== DIRECTIONS.DOWN) {
    currentDirection = DIRECTIONS.UP;
  } else if (event.key === 'ArrowDown' && currentDirection !== DIRECTIONS.UP) {
    currentDirection = DIRECTIONS.DOWN;
  } else if (
    event.key === 'ArrowLeft' &&
    currentDirection !== DIRECTIONS.RIGHT
  ) {
    currentDirection = DIRECTIONS.LEFT;
  } else if (
    event.key === 'ArrowRight' &&
    currentDirection !== DIRECTIONS.LEFT
  ) {
    currentDirection = DIRECTIONS.RIGHT;
  }
}

/**
 * Draws the snake on the canvas.
 */
function drawSnake(): void {
  snake.forEach(({ x, y }) => {
    paintCell(x, y);
  });
}

/**
 * Generates food at a random position not occupied by the snake.
 */
function generateFood(): void {
  do {
    food = {
      x: Math.round(
        (Math.random() * (DIMENSIONS.WIDTH - CELL_SIZE)) / CELL_SIZE
      ),
      y: Math.round(
        (Math.random() * (DIMENSIONS.HEIGHT - CELL_SIZE)) / CELL_SIZE
      )
    };
  } while (!checkIfFoodXYCorrect());
}

/**
 * Clears the food cell from the canvas.
 */
function clearFood(): void {
  canvasContext.fillStyle = 'white';
  canvasContext.fillRect(
    food.x * CELL_SIZE,
    food.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(
    food.x * CELL_SIZE,
    food.y * CELL_SIZE,
    CELL_SIZE,
    CELL_SIZE
  );
}

/**
 * Checks if the food position is not on the snake.
 */
function checkIfFoodXYCorrect(): boolean {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      return false;
    }
  }
  return true;
}

/**
 * Checks for collisions (wall, self, food).
 */
function checkCollision(): void {
  const { x: snakeX, y: snakeY } = snake[0];

  const maxX = DIMENSIONS.WIDTH / CELL_SIZE;
  const maxY = DIMENSIONS.HEIGHT / CELL_SIZE;

  const isOutOfBounds =
    snakeX < 0 || snakeX >= maxX || snakeY < 0 || snakeY >= maxY;

  const hasCollisionWithItself = snake.some(
    ({ x, y }, idx) => idx !== 0 && snakeX === x && snakeY === y
  );

  if (isOutOfBounds || hasCollisionWithItself) {
    console.log('game over!');
    // Optionally, stop the game loop or reset the game here
  }

  if (snakeX === food.x && snakeY === food.y) {
    snake.push({ x: food.x, y: food.y });
    clearFood();
    generateFood();
  }
}

/**
 * Paints a cell at (x, y) on the canvas.
 */
function paintCell(x: number, y: number): void {
  canvasContext.fillStyle = 'blue';
  canvasContext.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  canvasContext.strokeStyle = 'white';
  canvasContext.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Start the game
initializeGame();
