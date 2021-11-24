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

export function depthFirstSearch(grid, startTile, finishTile, directions) {
   // Prevent terminal edge cases
   if (!startTile || !finishTile || startTile === finishTile) {
      return false;
   }
   // Potentially initialize all nodes to infinite distance
   grid[startTile.row][startTile.col].distance = 0;
   let stack = [startTile];
   let visitedTilesInOrder = [];
   let possiblePath = false;

   stackLoop:
   while (stack.length > 0) {
      let current = stack.pop();
      if (!current.isVisited)
         visitedTilesInOrder.push(current);
      current.isVisited = true;
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
            break stackLoop;
         }
         if (neighbor.isObstacle) {
            continue;
         }
         if (!neighbor.isVisited) {
            neighbor.distance = current.distance + 1;
            stack.push(neighbor);
         }
      }
   }

   //let results = returnAllDistances(grid);
   let results = []
   results.push(visitedTilesInOrder);
   
   if (possiblePath) {
      let shortestPath = collectPath(grid, finishTile, directions);
      results.push(shortestPath);
   }
   else {
      console.log("yo what the");
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

function collectPath(grid, finishTile, directions) {
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
         if (neighbor.isVisited && neighbor.distance < minNeighbor.distance) {
            minNeighbor = neighbor;
         }
      }
      pathFromStartToFinish.unshift(minNeighbor);
      current = minNeighbor;
      current.isVisited = true;
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