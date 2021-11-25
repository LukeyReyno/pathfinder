// Shortest Path First Algorithm
export function dijkstra(grid, startTile, finishTile, directions) {
   // Prevent terminal edge cases
   if (!startTile || !finishTile || startTile === finishTile) {
      return false;
   }
   let vertexSet = new Set();
   let prev = {};
   let possiblePath = false;
   let visitedTilesInOrder = [];
   for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
         grid[i][j].distance = Infinity;
         prev[grid[i][j]] = null;
         vertexSet.add(grid[i][j]);
      }
   }
   grid[startTile.row][startTile.col].distance = 0;
   while (vertexSet.size > 0) {
      const vArray = Array.from(vertexSet);
      vArray.sort((a, b) => a.distance - b.distance);
      
      // get minimum distance vertex
      const current = vArray[0];
      visitedTilesInOrder.push(current);
      current.isVisited = true;
      vertexSet.delete(current);

      if (current === finishTile) {
         possiblePath = true;
         break;
      }

      for (var d in directions) {
         let newCoordinateX = current.col + directions[d][0];
         let newCoordinateY = current.row + directions[d][1];
         if (newCoordinateX >= grid[0].length || newCoordinateX < 0 || 
            newCoordinateY >= grid.length || newCoordinateY < 0) {
            continue;
         }
         let neighbor = grid[newCoordinateY][newCoordinateX];
         if (neighbor.isObstacle) {
            continue;
         }
         if (vertexSet.has(neighbor)) {
            const alt = current.distance + dist(current, neighbor);
            if (alt < neighbor.distance) {
               neighbor.distance = alt;
               prev[[neighbor.row, neighbor.col]] = current;
            }
         }
      }
   }

   if (possiblePath) {
      let shortestPath = [];
      let u = finishTile;
      while (u !== undefined) {
         shortestPath.unshift(u);
         u = prev[[u.row, u.col]];
      }

      console.log(shortestPath);

      return [visitedTilesInOrder, shortestPath];
   }
   else {
      return [visitedTilesInOrder, []];
   }
}

function dist(tile, otherTile) {
   //if (!(typeof(tile) === Tile) || !(typeof(otherTile) === Tile)) return;
   return Math.sqrt(Math.pow((tile.col - otherTile.col), 2) + Math.pow((tile.row - otherTile.row), 2));
}
