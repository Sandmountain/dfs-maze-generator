class Maze {
	cells: Cell[] = [];
	visitStack: Cell[] = [];

	constructor(rows: number, cols: number) {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				const newCell = new Cell(j, i);
				this.cells.push(newCell);
			}
		}
	}

	public solve(idx: number) {
		// Choose the initial cell, mark it as visited and push it to the stack
		let currElm = this.cells[idx];
		currElm.visit();
		this.visitStack.push(currElm);

		this.dfs();
	}

	private dfs() {
		type NeighbourType = {
			neighbour: Cell;
			fromDirection: string;
			toDirection: string;
		};

		// While the stack is not empty
		if (this.visitStack.length === 0) {
			console.log("Solved");
			return;
		}

		// Pop a cell from the stack and make it a current cell
		const currElm = this.visitStack.pop();

		//Finding Neighbours
		const currentNeighbours: NeighbourType[] = [];

		let topNeighbour = this.cells[this.getIndex(currElm.i, currElm.j - 1)];
		let rightNeighbour = this.cells[
			this.getIndex(currElm.i + 1, currElm.j)
		];
		let bottomNeighbour = this.cells[
			this.getIndex(currElm.i, currElm.j + 1)
		];
		let leftNeighbour = this.cells[this.getIndex(currElm.i - 1, currElm.j)];

		topNeighbour &&
			!topNeighbour.visited &&
			currentNeighbours.push({
				neighbour: topNeighbour,
				toDirection: "top",
				fromDirection: "bottom",
			});
		rightNeighbour &&
			!rightNeighbour.visited &&
			currentNeighbours.push({
				neighbour: rightNeighbour,
				toDirection: "right",
				fromDirection: "left",
			});
		bottomNeighbour &&
			!bottomNeighbour.visited &&
			currentNeighbours.push({
				neighbour: bottomNeighbour,
				toDirection: "bottom",
				fromDirection: "top",
			});
		leftNeighbour &&
			!leftNeighbour.visited &&
			currentNeighbours.push({
				neighbour: leftNeighbour,
				toDirection: "left",
				fromDirection: "right",
			});

		// If the current cell has any neighbours which have not been visited
		if (currentNeighbours.length > 0) {
			// Push the current cell to the stack
			this.visitStack.push(currElm);

			// Choose one of the unvisited neighbours
			const randCell = Math.floor(
				Math.random() * currentNeighbours.length,
			);
			const next = currentNeighbours[randCell];

			// Remove the wall between the current cell and the chosen cell
			currElm.removeBorder(next.toDirection);
			next.neighbour.removeBorder(next.fromDirection);

			// Mark the chosen cell as visited and push it to the stack
			currElm.removeBackgroundColor();
			next.neighbour.visit();
			this.visitStack.push(next.neighbour);

			setTimeout(() => {
				//this.solve(this.getIndex(next.neighbour.i, next.neighbour.j));
				this.dfs();
			}, 1000 / FPS); // 5 fps
		} else {
			currElm.removeBackgroundColor();
			this.dfs();
		}
	}

	private getIndex(i: number, j: number) {
		if (i < 0 || j < 0 || i > rows - 1 || j > columns - 1) {
			return -1;
		}

		return i + j * columns;
	}
}

class Cell {
	i: number; //The Cell's x index
	j: number; //The Cell's j index
	visited: boolean;
	elm: HTMLDivElement;

	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
		this.draw(i, j);
	}

	public updateStyle() {
		this.elm.style.background = "green";
	}

	public removeBackgroundColor() {
		this.elm.style.background = "white";
	}

	public visit() {
		this.visited = true;
		this.updateStyle();
	}

	public removeBorder(direction: string) {
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
	}

	public draw(i: number, j: number) {
		const newElement = document.createElement("div");
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
	}

	private removeTopBorder() {
		this.elm.style.borderTop = "";
	}

	private removeRightBorder() {
		this.elm.style.borderRight = "";
	}

	private removeBottomBorder() {
		this.elm.style.borderBottom = "";
	}

	private removeLeftBorder() {
		this.elm.style.borderLeft = "";
	}
}

// Global variables
var c = document.getElementsByClassName("canvas-container")[0];
const FPS = 20;

const columns: number = 20;
const rows: number = 20;

//cell
const height: number = c.clientHeight / columns;
const width: number = c.clientWidth / rows;

// Create Grid
const grid = new Maze(columns, rows);
const nrOfCells = grid.cells.length;
const startCell = 0;

const main = () => {
	grid.solve(0);
};

main();
