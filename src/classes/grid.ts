const c = document.getElementById("canvas-container") as HTMLElement;

export class Grid {
  rows: number;
  cols: number;
  grid: Array<Array<Node>>;

  openSet: Array<Node>;
  closedSet: Array<Node>;
  startNode: Node;
  goalNode: Node;

  constructor(rows: number, cols: number, start: number, goal: number) {
    this.rows = rows;
    this.cols = cols;
    this.openSet = [];
    this.closedSet = [];

    //Generate Grid
    this.grid = new Array(cols);
    for (let i = 0; i < cols; i++) {
      this.grid[i] = new Array(rows);
    }

    //Add nodes to every slot in the grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.grid[i][j] = new Node(i, j, rows, cols);
        this.grid[i][j].show();
      }
    }

    //Start upper left, goal bottom right
    this.startNode = this.grid[0][0];
    this.goalNode = this.grid[cols - 1][rows - 1];

    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    this.openSet.push(this.startNode);
    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  }

  async aStar() {
    while (this.openSet.length > 0) {
      // Retrives the lowest fscore from the open set list
      const current: Node = this.openSet.reduce((a, b) => (a.f < b.f ? a : b));

      if (current === this.goalNode) {
        // Found end!
        console.log("Success!");
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
      const currentNeigbours = this.findNeighbours(current.i, current.j);

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
    console.log("failed");
    return;
  }

  drawNewState(current: Node) {
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

  findNeighbours(i: number, j: number) {
    //let currentNode = this.grid[i][j];
    const neighbours: Node[] = [];

    this.isInsideGrid(i, j - 1) &&
      !this.grid[i][j - 1].isVisted &&
      !this.grid[i][j - 1].isWall &&
      neighbours.push(this.grid[i][j - 1]); //topNeighbour
    this.isInsideGrid(i + 1, j) &&
      !this.grid[i + 1][j].isVisted &&
      !this.grid[i + 1][j].isWall &&
      neighbours.push(this.grid[i + 1][j]); //rightNeighbour
    this.isInsideGrid(i, j + 1) &&
      !this.grid[i][j + 1].isVisted &&
      !this.grid[i][j + 1].isWall &&
      neighbours.push(this.grid[i][j + 1]); //bottomNeighbour
    this.isInsideGrid(i - 1, j) &&
      !this.grid[i - 1][j].isVisted &&
      !this.grid[i - 1][j].isWall &&
      neighbours.push(this.grid[i - 1][j]); //leftNeighbour

    return neighbours;
  }

  private isInsideGrid(i: number, j: number) {
    if (i < 0 || j < 0 || i > this.rows - 1 || j > this.cols - 1) {
      return false;
    }
    return true;
  }
}

// Same as the cell
class Node {
  i: number;
  j: number;

  isWall: boolean;
  elm: HTMLDivElement;

  previousNode: Node | undefined;
  height: number;
  width: number;

  public f: number;
  public g: number;
  public h: number;
  public isVisted: boolean;

  constructor(i: number, j: number, rows: number, cols: number) {
    this.elm = document.createElement("div");
    this.i = i;
    this.j = j;
    this.isVisted = false;

    this.height = c.clientHeight / cols;
    this.width = c.clientWidth / rows;

    if (Math.random() <= 0.3 && i !== cols - 1 && j !== rows - 1) {
      this.isWall = true;
    } else {
      this.isWall = false;
    }

    this.f = 0;
    this.g = 0;
    this.h = 0;
  }

  public show() {
    const newElement = document.createElement("div");
    newElement.style.position = "absolute";
    newElement.style.boxSizing = "border-box";
    newElement.style.height = this.height + "px";
    newElement.style.width = this.width + "px";

    newElement.style.background = !this.isWall ? "white" : "black";

    newElement.style.left = this.i * this.width + "px";
    newElement.style.top = this.j * this.height + "px";
    newElement.style.border = "1px solid black";
    this.elm = newElement;
    c && c.appendChild(newElement);
  }

  public open() {
    this.elm.style.background = "rgba(191,181,64,1)";
    if (this.elm.children.length === 0) {
      const textElement = document.createElement("p");
      textElement.innerHTML = "" + this.g;
      this.elm.appendChild(textElement);
    }
  }

  public close() {
    this.elm.style.background = "rgba(70,70,70,1)";

    this.isVisted = true;
  }

  public dyePath() {
    this.elm.style.background = "rgba(0,112,122,1)";
  }

  public heuristic(end: Node) {
    //Manhathan Distance
    return Math.abs(this.i - end.i) + Math.abs(this.j - end.j);
    // Euclidian distance
    //return Math.sqrt(Math.pow(end.i - this.i, 2) + Math.pow(end.j - this.j, 2));
  }
}
