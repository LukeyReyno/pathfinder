import React, {Component} from "react";
import Tile from './Tile/Tile'
import {breadthFirstSearch} from '../Algorithms/BFS'

import './Pathfinding.css';

const ROW_LENGTH = 15;
const COL_LENGTH = 50;

const START_POS = [10, 5];
const FINISH_POS = [6, 45];

// Typically the same as the tile
const ROW_HEIGHT = "25px";

const VISIT_TIME_DELAY = 25; // in ms

export default class Pathfinding extends Component {
   constructor(props) {
      super(props);
      this.state = {
         grid: [],
         mouseIsPressed: false,
      };
   }

   componentDidMount() {
      const grid = initializeGrid();
      this.setState({grid});
   }

   handleMouseDown(row, col) {
      const newGrid = this.state.grid;
      newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
      this.setState({grid: newGrid, mouseIsPressed: true});
   }

   handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed) return;
      const newGrid = this.state.grid;
      newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
      this.setState({grid: newGrid, mouseIsPressed: true});
   }
   
   handleMouseUp() {
      this.setState({mouseIsPressed: false});
   }

   animateTraversal(vistedTilesInOrder) {
      const {grid} = this.state;
      let newGrid = grid;
      for (let i = 1; i < vistedTilesInOrder.length; i++) {
         setTimeout(() => {
            const current = vistedTilesInOrder[i];
            document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile visited-tile';
         }, VISIT_TIME_DELAY * i);
      }
      console.log(grid);
      console.log(newGrid);
   }

   animateShortestPath(shortestPath) {
      for (let i = 1; i < shortestPath.length - 1; i++) {
         const current = shortestPath[i];
         document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile shortestpath-tile';
      }
   }

   visualize() {
      const {grid} = this.state;
      const startTile = grid[START_POS[0]][START_POS[1]];
      const finishTile = grid[FINISH_POS[0]][FINISH_POS[1]];
      const cardinalDirections=[[1, 0], [0, 1], [-1, 0], [0, -1]];
      const paths = breadthFirstSearch(grid, startTile, finishTile, cardinalDirections);
      this.animateTraversal(paths[0]);
      setTimeout(() => {
         this.animateShortestPath(paths[1]);
      }, VISIT_TIME_DELAY * paths[0].length);
      console.log(paths);
   }

   render() {
      const {grid} = this.state;

      return (
         <div>
            <h1>SUS</h1>
            <button onClick={() => this.visualize()}>
               Visualize Algorithm
            </button>
            <div className="grid">
               {grid.map((row, rowIndex) => {
                  return (
                  <div key={rowIndex} style={{height: `${ROW_HEIGHT}`}}>
                     {row.map((tile, tileIndex) => {
                        const {isStart, isFinish, isObstacle} = tile;
                        return (
                           <Tile
                              key={tileIndex}
                              onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                              onMouseUp={(row, col) => this.handleMouseUp()}
                              onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                              row={rowIndex}
                              col={tileIndex}
                              isStart={isStart}
                              isFinish={isFinish}
                              isObstacle={isObstacle}
                              ></Tile>
                        );
                     })}
                  </div>
                  );
               })}
            </div>
         </div>
      )
   }
}

const initializeGrid = () => {
   const grid = [];
   for (let row = 0; row < ROW_LENGTH; row++) {
      const currentRow = [];
      for (let col = 0; col < COL_LENGTH; col++) {
         const currentTile = {
            row,
            col,
            distance: Infinity,
            isVisited: false,
            isStart: row === START_POS[0] && col === START_POS[1],
            isFinish: row === FINISH_POS[0] && col === FINISH_POS[1],
         };
         currentRow.push(currentTile);
      }
      grid.push(currentRow);
   }
   return grid;
}
