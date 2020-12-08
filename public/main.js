import { Maze } from './classes/maze.js';
// Global variables
const FPS = 20;
const columns = 40;
const rows = columns;
const startCell = 1;
const endCell = 1 * rows;
// Create Grid
let grid = new Maze(rows, columns, startCell, endCell);
grid.generateMaze();
const solve = document.getElementById('start-button');
solve === null || solve === void 0 ? void 0 : solve.addEventListener('click', (e) => grid.aStar());
const newGrid = document.getElementById('grid-button');
newGrid === null || newGrid === void 0 ? void 0 : newGrid.addEventListener('click', (e) => location.reload());
