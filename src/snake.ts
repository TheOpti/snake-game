import { DIMENSIONS } from './game';

export type SnakeCell = { x: number; y: number };
export type Direction = 'right' | 'left' | 'up' | 'down';

export const DIRECTIONS = {
  RIGHT: 'right',
  LEFT: 'left',
  UP: 'up',
  DOWN: 'down'
} as const;

export class Snake {
  cells: SnakeCell[] = [];
  direction: Direction = DIRECTIONS.RIGHT;

  createSnake(length = 5, startX = 10, startY = 5) {
    this.cells = [];
    for (let i = length; i > 0; i--) {
      this.cells.push({ x: startX + i, y: startY });
    }
  }

  getNextPosition(): SnakeCell {
    const head = this.cells[0];
    switch (this.direction) {
      case DIRECTIONS.RIGHT:
        return { x: head.x + 1, y: head.y };
      case DIRECTIONS.LEFT:
        return { x: head.x - 1, y: head.y };
      case DIRECTIONS.UP:
        return { x: head.x, y: head.y - 1 };
      case DIRECTIONS.DOWN:
        return { x: head.x, y: head.y + 1 };
      default:
        return { x: head.x, y: head.y };
    }
  }

  move() {
    const next = this.getNextPosition();
    const tail = this.cells.pop();
    if (tail) {
      tail.x = next.x;
      tail.y = next.y;
      this.cells.unshift(tail);
    }
  }

  grow() {
    const tail = this.cells[this.cells.length - 1];
    this.cells.push({ x: tail.x, y: tail.y });
  }

  checkCollision(): boolean {
    const head = this.cells[0];
    const maxX = DIMENSIONS.WIDTH / 20;
    const maxY = DIMENSIONS.HEIGHT / 20;
    const outOfBounds =
      head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY;
    const selfCollision = this.cells.some(
      (cell, idx) => idx !== 0 && cell.x === head.x && cell.y === head.y
    );
    return outOfBounds || selfCollision;
  }
}
