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
solve?.addEventListener('click', (e: Event) => grid.aStar());

const newGrid = document.getElementById('grid-button');
newGrid?.addEventListener('click', (e: Event) => location.reload());

function called(event: Event) {
  event.preventDefault();
  console.log('hello');
}
