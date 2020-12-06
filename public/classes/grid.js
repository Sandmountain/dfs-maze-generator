const c = document.getElementById('canvas-container');
export class Grid {
    constructor(rows, cols, start, goal) {
        this.rows = rows;
        this.cols = cols;
        this.openSet = [];
        this.closedSet = [];
        this.cameFrom = [];
        //Generate Grid
        this.grid = new Array(cols);
        for (let i = 0; i < cols; i++) {
            this.grid[i] = new Array(rows);
        }
        //Add nodes to every slot in the grid
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.grid[i][j] = new Node(i, j, rows, cols);
            }
        }
        //Start upper left, goal bottom right
        this.startNode = this.grid[0][0];
        this.goalNode = this.grid[cols - 1][rows - 1];
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        this.openSet.push(this.startNode);
        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
        this.aStar();
    }
    aStar() {
        if (this.openSet.length > 0) {
            // Retrives the lowest fscore from the open set list
            const current = this.openSet.reduce((a, b) => (a.f < b.f ? a : b));
            if (current === this.goalNode) {
                // Found end!
                console.log('Success!');
                current.dyePath();
                return;
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
                        neighbour.g = tentative_gScore;
                    }
                }
                else {
                    neighbour.g = tentative_gScore;
                    this.openSet.push(neighbour);
                }
                neighbour.h = neighbour.heuristic(this.goalNode);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.previousNode = current;
            });
            setTimeout(() => {
                this.aStar();
                let temp = current;
                const shortestPath = [];
                temp.dyePath();
                while (temp.previousNode) {
                    shortestPath.push(temp.previousNode);
                    temp.dyePath();
                    temp = temp.previousNode;
                }
                temp.dyePath();
            }, 5);
        }
        else {
            // No solution
            console.log('failed');
            return;
        }
        // Show the grid
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].show();
            }
        }
        for (let i = 0; i < this.openSet.length; i++) {
            this.openSet[i].open();
        }
        for (let i = 0; i < this.closedSet.length; i++) {
            this.closedSet[i].close();
        }
    }
    findNeighbours(i, j) {
        //let currentNode = this.grid[i][j];
        const neighbours = [];
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
    isInsideGrid(i, j) {
        if (i < 0 || j < 0 || i > this.rows - 1 || j > this.cols - 1) {
            return false;
        }
        return true;
    }
}
// Same as the cell
class Node {
    constructor(i, j, rows, cols) {
        this.elm = document.createElement('div');
        this.i = i;
        this.j = j;
        this.isVisted = false;
        this.height = c.clientHeight / cols;
        this.width = c.clientWidth / rows;
        // Ram runt hela griden atm
        //  && i !== 0 && j !== 0 && i !== cols - 1 && j !== rows - 1
        if (Math.random() <= 0.3 && i !== cols - 1 && j !== rows - 1) {
            this.isWall = true;
        }
        else {
            this.isWall = false;
        }
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
    show() {
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
    open() {
        this.elm.style.background = 'green';
    }
    close() {
        this.elm.style.background = 'red';
        this.isVisted = true;
    }
    dyePath() {
        this.elm.style.background = 'blue';
    }
    heuristic(end) {
        //Manhathan Distance
        return Math.abs(this.i - end.i) + Math.abs(this.j - end.j);
        // Euclidian distance
        //return Math.sqrt(Math.pow(end.i - this.i, 2) + Math.pow(end.j - this.j, 2));
    }
}
//OpenSet
// -> Nodes that needs to be processed.
//ClosetSet
// -> Stores all done things
