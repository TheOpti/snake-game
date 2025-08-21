import { DIMENSIONS } from './game';
import type { SnakeCell } from './snake';

const CELL_SIZE = 20;

export function generateFood(snake: SnakeCell[]): SnakeCell {
  let food: SnakeCell;
  do {
    food = {
      x: Math.round(
        (Math.random() * (DIMENSIONS.WIDTH - CELL_SIZE)) / CELL_SIZE
      ),
      y: Math.round(
        (Math.random() * (DIMENSIONS.HEIGHT - CELL_SIZE)) / CELL_SIZE
      )
    };
  } while (snake.some((cell) => cell.x === food.x && cell.y === food.y));
  return food;
}

export function clearFood(ctx: CanvasRenderingContext2D, food: SnakeCell) {
  ctx.fillStyle = 'white';
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
