import { generateMaze } from './classes/maze.js';
import { Grid } from './classes/grid.js';

// Global variables
const FPS = 20;

const columns: number = 20;
const rows: number = 20;

const startCell = 0;
const endCell = 1 * rows;

// Create Grid
const grid = new Grid(rows, columns, startCell, endCell);

const main = () => {
  //generateMaze(columns, rows, startCell, endCell);
};

main();
