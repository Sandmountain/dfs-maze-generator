import { Maze } from "./classes/maze.js";
import { Grid } from "./classes/grid.js";
// Global variables

let columns = 40;
let rows = columns;
const startCell = 1;
const endCell = 1 * rows;

// Create Grid
let maze = new Maze(rows, columns, startCell, endCell);
maze.generateMaze();

let grid: Grid;

const rowInput = document.getElementById("rows");
rowInput?.addEventListener("change", (e: Event) => {
  try {
    rows = parseInt((e.target as unknown as HTMLInputElement).value);
    columns = rows;

    if (rows > 50) {
      alert("Generating this big of a grid will probably lead to memory crash");
    }
  } catch (error) {
    return;
  }
});

const newMaze = document.getElementById("maze-button");
newMaze?.addEventListener("click", (e: Event) => {
  maze = new Maze(rows, columns, startCell, endCell);
  maze.generateMaze();
});

const newGrid = document.getElementById("grid-button");
newGrid?.addEventListener("click", (e: Event) => {
  grid = new Grid(20, 20, startCell, endCell);
});

const solve = document.getElementById("start-button");
solve?.addEventListener("click", (e: Event) => maze.aStar());

const visualization = document.getElementById("algo-visualization");
visualization?.addEventListener("click", () => {
  grid.aStar();
});
