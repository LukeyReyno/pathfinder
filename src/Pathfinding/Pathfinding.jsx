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

const CARDINAL = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const DIAGONAL = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const CARDINAL_DIAGONAL = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const DIRECTIONS = [CARDINAL, DIAGONAL, CARDINAL_DIAGONAL];

export default class Pathfinding extends Component {
   constructor(props) {
      super(props);
      this.state = {
         grid: [],
         mouseIsPressed: false,
         directionsIndex: 0,
         timeoutIDs: [],
         isSimulating: false,
      };
   }

   componentDidMount() {
      const grid = initializeGrid();
      this.setState({grid});
      this.setUpDirectionChoice();
   }

   handleMouseDown(row, col) {
      if (this.state.isSimulating) return;
      const newGrid = this.state.grid;
      newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
      this.setState({grid: newGrid, mouseIsPressed: true});
   }

   handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed || this.state.isSimulating) return;
      const newGrid = this.state.grid;
      newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
      this.setState({grid: newGrid, mouseIsPressed: true});
   }
   
   handleMouseUp() {
      this.setState({mouseIsPressed: false});
   }

   setUpDirectionChoice() {
      const dropDownElement = document.getElementById("directionSelection");
      dropDownElement.addEventListener("change", (choice) => {
         const value = choice.target.value;
         if (value) {
            this.setState({directionsIndex: value});
         }
      })
   }

   animateTraversal(vistedTilesInOrder) {
      for (let i = 1; i < vistedTilesInOrder.length; i++) {
         let tID = setTimeout(() => {
            const current = vistedTilesInOrder[i];
            document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile visited-tile';
         }, VISIT_TIME_DELAY * i);
         let tIDList = this.state.timeoutIDs;
         tIDList.push(tID);
         this.setState({timeoutIDs: tIDList});
      }
   }

   animateShortestPath(shortestPath) {
      for (let i = 1; i < shortestPath.length - 1; i++) {
         const current = shortestPath[i];
         document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile shortestpath-tile';
      }
   }

   resetVisualization() {
      for (let i = 0; i < this.state.timeoutIDs.length; i++) {
         clearTimeout(this.state.timeoutIDs[i]);
      }
      const newGrid = this.state.grid;
      for (let i = 0; i < newGrid.length; i++) {
         for (let j = 0; j < newGrid[0].length; j++) {
            if (newGrid[i][j].isFinish || newGrid[i][j].isStart || newGrid[i][j].isObstacle) {
               continue;
            }
            if (newGrid[i][j].isVisited) {
               newGrid[i][j].isVisited = false;
               newGrid[i][j].distance = Infinity;
               document.getElementById(`tile-${i}-${j}`).className = 'tile ';
            }
         }
      }
      this.setState({grid: newGrid, isSimulating: false});
   }

   visualize() {
      this.setState({isSimulating: true});
      const {grid, directionsIndex} = this.state;
      const startTile = grid[START_POS[0]][START_POS[1]];
      const finishTile = grid[FINISH_POS[0]][FINISH_POS[1]];
      const paths = breadthFirstSearch(grid, startTile, finishTile, DIRECTIONS[directionsIndex]);
      this.animateTraversal(paths[0]);
      console.log(paths[1]);
      let tID = setTimeout(() => {
         this.animateShortestPath(paths[1]);
      }, VISIT_TIME_DELAY * paths[0].length);
      let tIDList = this.state.timeoutIDs;
      tIDList.push(tID);
      this.setState({timeoutIDs: tIDList});
   }

   render() {
      const {grid} = this.state;

      return (
         <div>
            <h1>General Path Finder Simulation</h1>
            <button class="btn" onClick={() => this.visualize()}>
               Visualize Algorithm
            </button>
            <button class="btn" onClick={() => this.resetVisualization()}>
               Stop The Simulation!
            </button>
            <br /><br />
            <label for="directions">Choose a direction to travel:</label>
            <br />
            <select name="directions" id="directionSelection">
               <option value="0">Cardinal</option>
               <option value="1">Diagonal</option>
               <option value="2">Cardinal + Diagonal</option>
            </select>
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
