const c = document.getElementById('canvas-container');
export function generateMaze(columns, rows, startCell, endCell) {
    const height = c.clientHeight / columns;
    const width = c.clientWidth / rows;
    const grid = new Maze(columns, rows, height, width);
    const nrOfCells = grid.cells.length;
    grid.solve(startCell);
}
export class Maze {
    constructor(rows, columns, height, width) {
        this.cells = [];
        this.visitStack = [];
        this.columns = columns;
        this.rows = rows;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const newCell = new Cell(j, i, rows, columns, height, width);
                this.cells.push(newCell);
            }
        }
    }
    solve(idx) {
        // Choose the initial cell, mark it as visited and push it to the stack
        let currElm = this.cells[idx];
        currElm.visit();
        this.visitStack.push(currElm);
        this.dfs();
    }
    aStar() {
        /*
        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        openSet := {start}
    
        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
        // to n currently known.
        cameFrom := an empty map
    
        // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
        gScore := map with default value of Infinity
        gScore[start] := 0
    
        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how short a path from start to finish can be if it goes through n.
        fScore := map with default value of Infinity
        fScore[start] := h(start)
    
        while openSet is not empty
            // This operation can occur in O(1) time if openSet is a min-heap or a priority queue
            current := the node in openSet having the lowest fScore[] value
            if current = goal
                return reconstruct_path(cameFrom, current)
    
            openSet.Remove(current)
            for each neighbor of current
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current
                tentative_gScore := gScore[current] + d(current, neighbor)
                if tentative_gScore < gScore[neighbor]
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom[neighbor] := current
                    gScore[neighbor] := tentative_gScore
                    fScore[neighbor] := gScore[neighbor] + h(neighbor)
                    if neighbor not in openSet
                        openSet.add(neighbor)
    
        // Open set is empty but goal was never reached
        return failure
        */
    }
    dfs() {
        // While the stack is not empty
        if (this.visitStack.length === 0) {
            console.log('Solved');
            return;
        }
        // Pop a cell from the stack and make it a current cell
        const currElm = this.visitStack.pop();
        //Finding Neighbours
        const currentNeighbours = [];
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
        }
        else {
            currElm.removeBackgroundColor();
            this.dfs();
        }
    }
    // Function to get the index for neighbouring cells in a
    // 1-dim array
    getIndex(i, j) {
        if (i < 0 || j < 0 || i > this.rows - 1 || j > this.columns - 1) {
            return -1;
        }
        return i + j * this.columns;
    }
}
class Cell {
    constructor(i, j, rows, columns, height, width) {
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
    updateStyle() {
        this.elm.style.background = 'green';
    }
    removeBackgroundColor() {
        this.elm.style.background = 'white';
    }
    visit() {
        this.visited = true;
        this.updateStyle();
    }
    removeBorder(direction) {
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
    draw(i, j) {
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
        }
        else if (i === this.columns - 1 && j === this.rows - 1) {
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
    removeTopBorder() {
        this.elm.style.borderTop = '';
        this.open.top = true;
    }
    removeRightBorder() {
        this.elm.style.borderRight = '';
        this.open.right = true;
    }
    removeBottomBorder() {
        this.elm.style.borderBottom = '';
        this.open.bottom = true;
    }
    removeLeftBorder() {
        this.elm.style.borderLeft = '';
        this.open.left = true;
    }
}
