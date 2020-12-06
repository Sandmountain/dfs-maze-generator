const c = document.getElementById('canvas-container') as HTMLElement;

export function generateMaze(columns: number, rows: number, startCell: number, endCell: number): void {
  const height: number = c.clientHeight / columns;
  const width: number = c.clientWidth / rows;

  const grid = new Maze(columns, rows, height, width);
  const nrOfCells = grid.cells.length;
  grid.generateMaze(startCell);
}

export class Maze {
  cells: Cell[] = [];
  visitStack: Cell[] = [];
  columns: number;
  rows: number;

  constructor(rows: number, columns: number, height: number, width: number) {
    this.columns = columns;
    this.rows = rows;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const newCell = new Cell(j, i, rows, columns, height, width);
        this.cells.push(newCell);
      }
    }
  }

  public generateMaze(idx: number) {
    // Choose the initial cell, mark it as visited and push it to the stack
    let currElm = this.cells[idx];
    currElm.visit();
    this.visitStack.push(currElm);

    this.dfs();
  }

  private dfs() {
    // While the stack is not empty
    if (this.visitStack.length === 0) {
      console.log('Solved');
      return;
    }

    // Pop a cell from the stack and make it a current cell
    const currElm = this.visitStack.pop() as Cell;

    //Finding Neighbours
    const currentNeighbours: { neighbour: Cell; fromDirection: string; toDirection: string }[] = [];

    let topNeighbour = this.cells[this.getIndex(currElm.i, currElm.j - 1)];
    let rightNeighbour = this.cells[this.getIndex(currElm.i + 1, currElm.j)];
    let bottomNeighbour = this.cells[this.getIndex(currElm.i, currElm.j + 1)];
    let leftNeighbour = this.cells[this.getIndex(currElm.i - 1, currElm.j)];

    topNeighbour &&
      !topNeighbour.visited &&
      currentNeighbours.push({
        neighbour: topNeighbour,
        toDirection: 'top',
        fromDirection: 'bottom',
      });
    rightNeighbour &&
      !rightNeighbour.visited &&
      currentNeighbours.push({
        neighbour: rightNeighbour,
        toDirection: 'right',
        fromDirection: 'left',
      });
    bottomNeighbour &&
      !bottomNeighbour.visited &&
      currentNeighbours.push({
        neighbour: bottomNeighbour,
        toDirection: 'bottom',
        fromDirection: 'top',
      });
    leftNeighbour &&
      !leftNeighbour.visited &&
      currentNeighbours.push({
        neighbour: leftNeighbour,
        toDirection: 'left',
        fromDirection: 'right',
      });

    // If the current cell has any neighbours which have not been visited
    if (currentNeighbours.length > 0) {
      // Push the current cell to the stack
      this.visitStack.push(currElm);

      // Choose one of the unvisited neighbours
      const randCell = Math.floor(Math.random() * currentNeighbours.length);
      const next = currentNeighbours[randCell];

      // Remove the wall between the current cell and the chosen cell
      currElm.removeBorder(next.toDirection);
      next.neighbour.removeBorder(next.fromDirection);

      // Mark the chosen cell as visited and push it to the stack
      currElm.removeBackgroundColor();
      next.neighbour.visit();
      this.visitStack.push(next.neighbour);

      this.dfs();
    } else {
      currElm.removeBackgroundColor();
      this.dfs();
    }
  }

  // Function to get the index for neighbouring cells in a
  // 1-dim array
  private getIndex(i: number, j: number) {
    if (i < 0 || j < 0 || i > this.rows - 1 || j > this.columns - 1) {
      return -1;
    }

    return i + j * this.columns;
  }
}

class Cell {
  i: number; //The Cell's x index
  j: number; //The Cell's j index
  visited: boolean;
  open: { top: boolean; right: boolean; bottom: boolean; left: boolean };

  columns: number;
  rows: number;

  //Styling
  height: number;
  width: number;
  elm: HTMLDivElement;

  constructor(i: number, j: number, rows: number, columns: number, height: number, width: number) {
    this.elm = document.createElement('div');
    this.i = i;
    this.j = j;

    this.columns = columns;
    this.rows = rows;
    this.height = height;
    this.width = width;

    this.visited = false;
    this.open = {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };

    this.draw(i, j);
  }

  public updateStyle() {
    this.elm.style.background = 'green';
  }

  public removeBackgroundColor() {
    this.elm.style.background = 'white';
  }

  public visit() {
    this.visited = true;
    this.updateStyle();
  }

  public removeBorder(direction: string) {
    switch (direction) {
      case 'top':
        this.removeTopBorder();
        break;
      case 'right':
        this.removeRightBorder();
        break;
      case 'bottom':
        this.removeBottomBorder();
        break;
      case 'left':
        this.removeLeftBorder();
        break;
      default:
        break;
    }
  }

  public draw(i: number, j: number) {
    const newElement = document.createElement('div');
    newElement.style.position = 'absolute';
    newElement.style.boxSizing = 'border-box';
    newElement.style.height = this.height + 'px';
    newElement.style.width = this.width + 'px';
    newElement.style.background = 'gray';
    newElement.style.left = i * this.width + 'px';
    newElement.style.top = j * this.height + 'px';
    newElement.style.borderTop = ' 1px solid black';
    newElement.style.borderBottom = ' 1px solid black';
    newElement.style.borderRight = ' 1px solid black';
    newElement.style.borderLeft = ' 1px solid black';

    // To add start and goal
    if (i === 0 && j === 0) {
      const startElement = document.createElement('div');
      startElement.style.width = this.height / 2 + 'px';
      startElement.style.height = this.height / 2 + 'px';
      startElement.style.borderRadius = 50 + '%';
      startElement.style.backgroundColor = 'Green';

      newElement.style.display = 'flex';
      newElement.style.alignItems = 'center';
      newElement.style.justifyContent = 'center';
      newElement.appendChild(startElement);
    } else if (i === this.columns - 1 && j === this.rows - 1) {
      const startElement = document.createElement('div');
      startElement.className = 'endNode';
      document.styleSheets[0].addRule('.endNode::after', 'content: "🏁";');

      startElement.style.width = this.height / 2 + 'px';
      startElement.style.height = this.height / 2 + 'px';
      startElement.style.fontSize = 1 + 'em';
      startElement.style.display = 'flex';
      startElement.style.alignItems = 'center';
      startElement.style.justifyContent = 'center';

      newElement.style.display = 'flex';
      newElement.style.alignItems = 'center';
      newElement.style.justifyContent = 'center';
      newElement.appendChild(startElement);
    }

    this.elm = newElement;
    c && c.appendChild(newElement);
  }

  private removeTopBorder() {
    this.elm.style.borderTop = '';
    this.open.top = true;
  }

  private removeRightBorder() {
    this.elm.style.borderRight = '';
    this.open.right = true;
  }

  private removeBottomBorder() {
    this.elm.style.borderBottom = '';
    this.open.bottom = true;
  }

  private removeLeftBorder() {
    this.elm.style.borderLeft = '';
    this.open.left = true;
  }
}
