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
let grid;
const rowInput = document.getElementById("rows");
rowInput === null || rowInput === void 0 ? void 0 : rowInput.addEventListener("change", (e) => {
    try {
        rows = parseInt(e.target.value);
        columns = rows;
        if (rows > 50) {
            alert("Generating this big of a grid will probably lead to memory crash");
        }
    }
    catch (error) {
        return;
    }
});
const newMaze = document.getElementById("maze-button");
newMaze === null || newMaze === void 0 ? void 0 : newMaze.addEventListener("click", (e) => {
    maze = new Maze(rows, columns, startCell, endCell);
    maze.generateMaze();
});
const newGrid = document.getElementById("grid-button");
newGrid === null || newGrid === void 0 ? void 0 : newGrid.addEventListener("click", (e) => {
    grid = new Grid(20, 20, startCell, endCell);
});
const solve = document.getElementById("start-button");
solve === null || solve === void 0 ? void 0 : solve.addEventListener("click", (e) => maze.aStar());
const visualization = document.getElementById("algo-visualization");
visualization === null || visualization === void 0 ? void 0 : visualization.addEventListener("click", () => {
    grid.aStar();
});
