/*
var stack = [];
stack.push(2);       // stack is now [2]
stack.push(5);       // stack is now [2, 5]
var i = stack.pop(); // stack is now [2]
alert(i);            // displays 5

var queue = [];
queue.push(2);         // queue is now [2]
queue.push(5);         // queue is now [2, 5]
var i = queue.shift(); // queue is now [5]
alert(i);
*/

export function breadthFirstSearch(grid, startTile, finishTile, directions) {
   // Prevent terminal edge cases
   if (!startTile || !finishTile || startTile === finishTile) {
      return false;
   }
   // Potentially initialize all nodes to infinite distance
   grid[startTile.row][startTile.col].distance = 0;
   let queue = [startTile];
   let visitedTilesInOrder = [];
   let possiblePath = false;
   queueLoop:
   while (queue.length > 0) {
      let current = queue.shift();
      current.isVisited = true;
      visitedTilesInOrder.push(current);
      for (var d in directions) {
         let newCoordinateX = current.col + directions[d][0];
         let newCoordinateY = current.row + directions[d][1];
         if (newCoordinateX >= grid[0].length || newCoordinateX < 0 || 
            newCoordinateY >= grid.length || newCoordinateY < 0) {
            continue;
         }
         let neighbor = grid[newCoordinateY][newCoordinateX];
         if (neighbor === finishTile) {
            possiblePath = true;
            break queueLoop;
         }
         if (neighbor.isObstacle) {
            continue;
         }
         if (neighbor.distance === Infinity) {
            neighbor.distance = current.distance + 1;
            queue.push(neighbor);
         }
      }
   }

   //let results = returnAllDistances(grid);
   let results = []
   results.push(visitedTilesInOrder);
   
   if (possiblePath) {
      let shortestPath = collectPath(grid, startTile, finishTile, directions);
      results.push(shortestPath);
   }
   else {
      results.push([]);
   }
   return results;
}

function giveNodesInfiniteDistance(grid) {
   for (let i = 0; i < grid.length; i++) {
      for (let j = 0; i < grid[0].length; j++) {
         grid[i][j].distance = Infinity;
      }
   }
}

function collectPath(grid, startTile, finishTile, directions) {
   let pathFromStartToFinish = [finishTile];
   let current = finishTile;
   while (current.distance > 0) {
      let minNeighbor = current;
      for (var d in directions) {
         let newCoordinateX = current.col + directions[d][0];
         let newCoordinateY = current.row + directions[d][1];
         if (newCoordinateX >= grid[0].length || newCoordinateX < 0 || 
            newCoordinateY >= grid.length || newCoordinateY < 0) {
            continue;
         }
         let neighbor = grid[newCoordinateY][newCoordinateX];
         if (neighbor.distance < minNeighbor.distance) {
            minNeighbor = neighbor;
         }
      }
      pathFromStartToFinish.unshift(minNeighbor);
      current = minNeighbor;
   }
   return pathFromStartToFinish;
}

function returnAllDistances(grid) {
   let results = [];
   for (var i = 0; i < grid.length; i++) {
      let rowResults = [];
      for (var j = 0; j < grid[0].length; j++) {
         rowResults.push(grid[i][j].distance);
      }
      results.push(rowResults);
   }
   return results;
}