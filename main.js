var Maze = /** @class */ (function () {
    function Maze(rows, cols) {
        this.cells = [];
        this.visitStack = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var newCell = new Cell(j, i);
                this.cells.push(newCell);
            }
        }
    }
    Maze.prototype.solve = function (idx) {
        // Choose the initial cell, mark it as visited and push it to the stack
        var currElm = this.cells[idx];
        currElm.visit();
        this.visitStack.push(currElm);
        this.dfs();
    };
    Maze.prototype.dfs = function () {
        var _this = this;
        // While the stack is not empty
        if (this.visitStack.length === 0) {
            console.log("Solved");
            return;
        }
        // Pop a cell from the stack and make it a current cell
        var currElm = this.visitStack.pop();
        //Finding Neighbours
        var currentNeighbours = [];
        var topNeighbour = this.cells[this.getIndex(currElm.i, currElm.j - 1)];
        var rightNeighbour = this.cells[this.getIndex(currElm.i + 1, currElm.j)];
        var bottomNeighbour = this.cells[this.getIndex(currElm.i, currElm.j + 1)];
        var leftNeighbour = this.cells[this.getIndex(currElm.i - 1, currElm.j)];
        topNeighbour &&
            !topNeighbour.visited &&
            currentNeighbours.push({
                neighbour: topNeighbour,
                toDirection: "top",
                fromDirection: "bottom"
            });
        rightNeighbour &&
            !rightNeighbour.visited &&
            currentNeighbours.push({
                neighbour: rightNeighbour,
                toDirection: "right",
                fromDirection: "left"
            });
        bottomNeighbour &&
            !bottomNeighbour.visited &&
            currentNeighbours.push({
                neighbour: bottomNeighbour,
                toDirection: "bottom",
                fromDirection: "top"
            });
        leftNeighbour &&
            !leftNeighbour.visited &&
            currentNeighbours.push({
                neighbour: leftNeighbour,
                toDirection: "left",
                fromDirection: "right"
            });
        // If the current cell has any neighbours which have not been visited
        if (currentNeighbours.length > 0) {
            // Push the current cell to the stack
            this.visitStack.push(currElm);
            // Choose one of the unvisited neighbours
            var randCell = Math.floor(Math.random() * currentNeighbours.length);
            var next = currentNeighbours[randCell];
            // Remove the wall between the current cell and the chosen cell
            currElm.removeBorder(next.toDirection);
            next.neighbour.removeBorder(next.fromDirection);
            // Mark the chosen cell as visited and push it to the stack
            currElm.removeBackgroundColor();
            next.neighbour.visit();
            this.visitStack.push(next.neighbour);
            setTimeout(function () {
                //this.solve(this.getIndex(next.neighbour.i, next.neighbour.j));
                _this.dfs();
            }, 1000 / FPS); // 5 fps
        }
        else {
            currElm.removeBackgroundColor();
            this.dfs();
        }
    };
    Maze.prototype.getIndex = function (i, j) {
        if (i < 0 || j < 0 || i > rows - 1 || j > columns - 1) {
            return -1;
        }
        return i + j * columns;
    };
    return Maze;
}());
var Cell = /** @class */ (function () {
    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.draw(i, j);
    }
    Cell.prototype.updateStyle = function () {
        this.elm.style.background = "green";
    };
    Cell.prototype.removeBackgroundColor = function () {
        this.elm.style.background = "white";
    };
    Cell.prototype.visit = function () {
        this.visited = true;
        this.updateStyle();
    };
    Cell.prototype.removeBorder = function (direction) {
        switch (direction) {
            case "top":
                this.removeTopBorder();
                break;
            case "right":
                this.removeRightBorder();
                break;
            case "bottom":
                this.removeBottomBorder();
                break;
            case "left":
                this.removeLeftBorder();
                break;
            default:
                break;
        }
    };
    Cell.prototype.draw = function (i, j) {
        var newElement = document.createElement("div");
        newElement.style.position = "absolute";
        newElement.style.height = height + "px";
        newElement.style.width = width + "px";
        newElement.style.background = "gray";
        newElement.style.left = i * width + "px";
        newElement.style.top = j * height + "px";
        newElement.style.boxSizing = "border-box";
        newElement.style.borderTop = " 1px solid black";
        newElement.style.borderBottom = " 1px solid black";
        newElement.style.borderRight = " 1px solid black";
        newElement.style.borderLeft = " 1px solid black";
        // To add start and goal
        // if (i === 0 && j === 0) {
        // 	newElement.style.borderTop = "";
        // } else if (i === columns - 1 && j === rows - 1) {
        // 	newElement.style.borderBottom = "";
        // }
        this.elm = newElement;
        c.appendChild(newElement);
    };
    Cell.prototype.removeTopBorder = function () {
        this.elm.style.borderTop = "";
    };
    Cell.prototype.removeRightBorder = function () {
        this.elm.style.borderRight = "";
    };
    Cell.prototype.removeBottomBorder = function () {
        this.elm.style.borderBottom = "";
    };
    Cell.prototype.removeLeftBorder = function () {
        this.elm.style.borderLeft = "";
    };
    return Cell;
}());
// Global variables
var c = document.getElementsByClassName("canvas-container")[0];
var FPS = 20;
var columns = 20;
var rows = 20;
//cell
var height = c.clientHeight / columns;
var width = c.clientWidth / rows;
// Create Grid
var grid = new Maze(columns, rows);
var nrOfCells = grid.cells.length;
var startCell = 0;
var main = function () {
    grid.solve(0);
};
main();
