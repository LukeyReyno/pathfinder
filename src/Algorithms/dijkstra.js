// Shortest Path First Algorithm
function dijkstra(grid, startTile, finishTile, direction) {
   // Prevent terminal edge cases
   if (!startTile || !finishTile || startTile === finishTile) {
      return false;
   }
   
   grid[startTile.row][startTile.col].distance = 0;
   
}
