import type { SnakeCell } from './snake';

const CELL_SIZE = 20;

export function paintCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string = 'blue',
  isHead: boolean = false
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = 'white';
  ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

  if (isHead) {
    const eyeRadius = CELL_SIZE / 5;
    const eyeOffsetX = CELL_SIZE / 2;
    const eyeOffsetY = CELL_SIZE / 2;
    ctx.beginPath();
    ctx.arc(
      x * CELL_SIZE + eyeOffsetX,
      y * CELL_SIZE + eyeOffsetY,
      eyeRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
  }
}

export function drawSnake(ctx: CanvasRenderingContext2D, snake: SnakeCell[]) {
  snake.forEach(({ x, y }, idx) => {
    paintCell(ctx, x, y, 'blue', idx === 0);
  });
}
