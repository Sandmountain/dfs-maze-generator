const c = document.getElementById('canvas-container') as HTMLElement;

export class Maze {
  grid: Array<Array<Cell>>;
  columns: number;
  rows: number;

  //Maze Generator
  visitStack: Cell[] = [];

  //Maze Solver A*
  openSet: Array<Cell>;
  closedSet: Array<Cell>;
  startNode: Cell;
  goalNode: Cell;

  constructor(rows: number, columns: number, height: number, width: number) {
    this.columns = columns;
    this.rows = rows;
    this.openSet = [];
    this.closedSet = [];

    //Generate Grid
    this.grid = new Array(rows);
    for (let i = 0; i < columns; i++) {
      this.grid[i] = new Array(rows);
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        this.grid[i][j] = new Cell(i, j, rows, columns);
      }
    }

    //Start upper left, goal bottom right
    this.startNode = this.grid[0][0];
    this.goalNode = this.grid[columns - 1][rows - 1];
  }

  public generateMaze() {
    // Choose the initial cell, mark it as visited and push it to the stack
    let currElm = this.grid[0][0];
    currElm.visit();
    this.visitStack.push(currElm);

    this.dfs();
  }

  public async aStar() {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    this.openSet.push(this.startNode);
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
    while (this.openSet.length > 0) {
      // Retrives the lowest fscore from the open set list
      const current: Cell = this.openSet.reduce((a, b) => (a.f < b.f ? a : b));

      if (current === this.goalNode) {
        // Found end!
        console.log('Success!');
        this.drawNewState(current);
        return;
      } else {
        await this.drawNewState(current);
      }

      // removes the current from the list
      this.openSet.splice(this.openSet.indexOf(current), 1);

      // Add to closedset
      current.close();
      this.closedSet.push(current);

      // For each neighbor of current
      const currentNeigbours = this.findNeighboursForPath(current.i, current.j);

      currentNeigbours.forEach((neighbour) => {
        // d(current,neighbor) is the weight of the edge from current to neighbor
        // tentative_gScore is the distance from start to the neighbor through current

        let tentative_gScore = current.g + 1;

        if (this.openSet.indexOf(neighbour) !== -1) {
          if (tentative_gScore < neighbour.g) {
            // Add values to the temporary best node
            neighbour.g = tentative_gScore;
            neighbour.h = neighbour.heuristic(this.goalNode);
            neighbour.f = neighbour.g + neighbour.h;
            neighbour.previousNode = current;
          }
        } else {
          //
          neighbour.g = tentative_gScore;
          neighbour.previousNode = current;

          neighbour.h = neighbour.heuristic(this.goalNode);
          neighbour.f = neighbour.g + neighbour.h;
          this.openSet.push(neighbour);
        }
      });
    }
    // No solution
    console.log('failed');
    return;
  }

  private drawNewState(current: Cell) {
    for (let i = 0; i < this.openSet.length; i++) {
      this.openSet[i].open();
    }

    for (let i = 0; i < this.closedSet.length; i++) {
      this.closedSet[i].close();
    }

    current.dyePath();
    let temp = current;
    const shortestPath = [];

    temp.dyePath();

    while (temp.previousNode) {
      shortestPath.push(temp.previousNode);
      temp = temp.previousNode;
      temp.dyePath();
    }

    return new Promise((r) => setTimeout(r, 1));
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
    const currentNeighbours: {
      neighbour: Cell;
      fromDirection: string;
      toDirection: string;
    }[] = this.findNeighbourForMaze(currElm.i, currElm.j);

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

  private findNeighboursForPath(i: number, j: number) {
    //let currentNode = this.grid[i][j];
    const neighbours: Cell[] = [];

    if (this.grid[i][j].openPath.top) {
      !this.grid[i][j - 1].isVisted && neighbours.push(this.grid[i][j - 1]); //topNeighbour
    }

    if (this.grid[i][j].openPath.right) {
      !this.grid[i + 1][j].isVisted && neighbours.push(this.grid[i + 1][j]); //rightNeighbour
    }

    if (this.grid[i][j].openPath.bottom) {
      !this.grid[i][j + 1].isVisted && neighbours.push(this.grid[i][j + 1]); //bottomNeighbour
    }

    if (this.grid[i][j].openPath.left) {
      !this.grid[i - 1][j].isVisted && neighbours.push(this.grid[i - 1][j]); //leftNeighbour
    }

    return neighbours;
  }

  private findNeighbourForMaze(i: number, j: number) {
    const neighbours: { neighbour: Cell; fromDirection: string; toDirection: string }[] = [];

    this.isInsideGrid(i, j - 1) &&
      !this.grid[i][j - 1].visited &&
      neighbours.push({
        neighbour: this.grid[i][j - 1],
        toDirection: 'top',
        fromDirection: 'bottom',
      }); //topNeighbour

    this.isInsideGrid(i + 1, j) &&
      !this.grid[i + 1][j].visited &&
      neighbours.push({
        neighbour: this.grid[i + 1][j],
        toDirection: 'right',
        fromDirection: 'left',
      }); //rightNeighbour

    this.isInsideGrid(i, j + 1) &&
      !this.grid[i][j + 1].visited &&
      neighbours.push({
        neighbour: this.grid[i][j + 1],
        toDirection: 'bottom',
        fromDirection: 'top',
      }); //bottomNeighbour

    this.isInsideGrid(i - 1, j) &&
      !this.grid[i - 1][j].visited &&
      neighbours.push({
        neighbour: this.grid[i - 1][j],
        toDirection: 'left',
        fromDirection: 'right',
      }); //leftNeighbour

    return neighbours;
  }

  private isInsideGrid(i: number, j: number) {
    if (i < 0 || j < 0 || i > this.rows - 1 || j > this.columns - 1) {
      return false;
    }
    return true;
  }
}

class Cell {
  i: number; //The Cell's x index
  j: number; //The Cell's j index
  visited: boolean;
  openPath: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  columns: number;
  rows: number;

  // Use?
  isWall: boolean;

  // A* variables
  public previousNode: Cell | undefined;
  public f: number;
  public g: number;
  public h: number;
  public isVisted: boolean;

  //Styling
  height: number;
  width: number;
  elm: HTMLDivElement;

  constructor(i: number, j: number, rows: number, columns: number) {
    this.elm = document.createElement('div');
    this.i = i;
    this.j = j;

    this.columns = columns;
    this.rows = rows;

    this.height = c.clientHeight / columns;
    this.width = c.clientWidth / rows;

    this.visited = false;
    this.openPath = {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.isWall = false;
    this.isVisted = false;

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
      startElement.style.backgroundColor = 'white';

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
    this.openPath.top = true;
  }

  private removeRightBorder() {
    this.elm.style.borderRight = '';
    this.openPath.right = true;
  }

  private removeBottomBorder() {
    this.elm.style.borderBottom = '';
    this.openPath.bottom = true;
  }

  private removeLeftBorder() {
    this.elm.style.borderLeft = '';
    this.openPath.left = true;
  }

  public show() {
    const newElement = document.createElement('div');
    newElement.style.position = 'absolute';
    newElement.style.boxSizing = 'border-box';
    newElement.style.height = this.height + 'px';
    newElement.style.width = this.width + 'px';

    newElement.style.background = !this.isWall ? 'white' : 'black';

    newElement.style.left = this.i * this.width + 'px';
    newElement.style.top = this.j * this.height + 'px';
    newElement.style.border = '1px solid black';
    this.elm = newElement;
    c && c.appendChild(newElement);
  }

  public open() {
    this.elm.style.background = 'rgba(0,255,0,1)';
    if (false && this.elm.children.length === 0) {
      const textElement = document.createElement('p');
      textElement.innerHTML = '' + this.g;
      this.elm.appendChild(textElement);
    }
  }

  public close() {
    this.elm.style.background = 'rgba(70,70,70,1)';

    this.isVisted = true;
  }

  public dyePath() {
    this.elm.style.background = 'rgba(0,112,122,.6)';
  }

  public heuristic(end: Cell) {
    //Manhathan Distance
    return Math.abs(this.i - end.i) + Math.abs(this.j - end.j);
    // Euclidian distance
    //return Math.sqrt(Math.pow(end.i - this.i, 2) + Math.pow(end.j - this.j, 2));
  }
}
