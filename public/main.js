import { generateMaze } from './classes/maze.js';
// Global variables
const FPS = 20;
const columns = 40;
const rows = 40;
const startCell = 1;
const endCell = 1 * rows;
// Create Grid
//const grid = new Grid(rows, columns, startCell, endCell);
const grid = generateMaze(columns, rows, startCell, endCell);
const main = () => {
    //generateMaze(columns, rows, startCell, endCell);
};
main();
