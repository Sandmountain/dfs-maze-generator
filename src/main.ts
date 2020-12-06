import { generateMaze } from './classes/maze.js';
import { Grid } from './classes/grid.js';

// Global variables
const FPS = 20;

const columns: number = 40;
const rows: number = 40;

const startCell = 1;
const endCell = 1 * rows;

// Create Grid
//const grid = new Grid(rows, columns, startCell, endCell);
const grid = generateMaze(columns, rows, startCell, endCell);
const main = () => {
  //generateMaze(columns, rows, startCell, endCell);
};

main();
