import React, {Component} from "react";
import Tile from './Tile/Tile'
import {breadthFirstSearch} from '../Algorithms/BFS'
import {depthFirstSearch} from '../Algorithms/DFS'
import {dijkstra} from '../Algorithms/dijkstra'

import './Pathfinding.css';

const TILE_WIDTH = 25; // in pixels
const ROW_LENGTH = 15;
const COL_LENGTH = 50;

const INITIAL_START_POS = [10, 5];
const INITIAL_FINISH_POS = [6, 45];

// Typically the same as the tile
const ROW_HEIGHT = "25px";

const VISIT_TIME_DELAY = 25; // in ms

const CARDINAL = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const DIAGONAL = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const CARDINAL_DIAGONAL = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const KNIGHT_TRAVERSE = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];
const DIRECTIONS = [CARDINAL, DIAGONAL, CARDINAL_DIAGONAL, KNIGHT_TRAVERSE];

const ALGORITHMS = [breadthFirstSearch, depthFirstSearch, dijkstra];

export default class Pathfinding extends Component {
   constructor(props) {
      super(props);
      this.state = {
         grid: [],
         mouseIsPressed: false,
         directionsIndex: 0,
         algorithmIndex: 0,
         timeoutIDs: [],
         isSimulating: false,
         startPosition: INITIAL_START_POS,
         finishPosition: INITIAL_FINISH_POS,
         dragStart: false,
         dragFinish: false,
      };
   }

   initializeGrid = () => {
      const grid = [];
      for (let row = 0; row < ROW_LENGTH; row++) {
         const currentRow = [];
         for (let col = 0; col < COL_LENGTH; col++) {
            const currentTile = {
               row,
               col,
               distance: Infinity,
               isVisited: false,
               isStart: row === this.state.startPosition[0] && col === this.state.startPosition[1],
               isFinish: row === this.state.finishPosition[0] && col === this.state.finishPosition[1],
            };
            currentRow.push(currentTile);
         }
         grid.push(currentRow);
      }
      return grid;
   }

   resetGrid() {
      if (this.state.isSimulating) return;
      const newGrid = this.initializeGrid();
      this.setState({grid: newGrid});
   }

   componentDidMount() {
      const grid = this.initializeGrid();
      this.setState({grid});
      this.setUpChoice();
   }

   handleMouseDown(row, col) {
      if (this.state.isSimulating) return;
      const newGrid = this.state.grid;
      if (newGrid[row][col].isStart) {
         this.setState({dragStart: true, mouseIsPressed: true});
         console.log("down on start");
      } 
      else if (newGrid[row][col].isFinish) {
         this.setState({dragFinish: true, mouseIsPressed: true});
      }
      else {
         newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
         this.setState({grid: newGrid, mouseIsPressed: true});
      }
   }

   handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed || this.state.isSimulating) return;
      const newGrid = this.state.grid;
      if (this.state.dragStart) {
         newGrid[this.state.startPosition[0]][this.state.startPosition[1]].isStart = false;
         newGrid[this.state.startPosition[0]][this.state.startPosition[1]].distance = Infinity;
         document.getElementById(`tile-${this.state.startPosition[0]}-${this.state.startPosition[1]}`).className = 'tile ';
         this.setState({startPosition: [row, col]});
         newGrid[row][col].isStart = true;
         document.getElementById(`tile-${row}-${col}`).className = 'tile start-tile';
      } 
      else if (this.state.dragFinish) {
         newGrid[this.state.finishPosition[0]][this.state.finishPosition[1]].isFinish = false;
         document.getElementById(`tile-${this.state.finishPosition[0]}-${this.state.finishPosition[1]}`).className = 'tile ';
         this.setState({finishPosition: [row, col]});
         newGrid[row][col].isFinish = true;
         document.getElementById(`tile-${row}-${col}`).className = 'tile finish-tile';
      }
      else
      {
         newGrid[row][col].isObstacle = !newGrid[row][col].isObstacle;
      }
      this.setState({grid: newGrid, mouseIsPressed: true});
   }
   
   handleMouseUp() {
      this.setState({mouseIsPressed: false, dragStart: false, dragFinish: false});
   }

   setUpChoice() {
      let dropDownElement = document.getElementById("directionSelection");
      dropDownElement.addEventListener("change", (choice) => {
         const value = choice.target.value;
         if (value) {
            this.setState({directionsIndex: value});
         }
      })

      dropDownElement = document.getElementById("algorithmSelection");
      dropDownElement.addEventListener("change", (choice) => {
         const value = choice.target.value;
         if (value) {
            this.setState({algorithmIndex: value});
         }
      })
   }

   animateTraversal(vistedTilesInOrder) {
      for (let i = 0; i < vistedTilesInOrder.length; i++) {
         // In case specific algorithms return start or finish in their visitation order
         if (vistedTilesInOrder[i] === this.state.grid[this.state.finishPosition[0]][this.state.finishPosition[1]]) continue;
         if (vistedTilesInOrder[i] === this.state.grid[this.state.startPosition[0]][this.state.startPosition[1]]) continue;

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
      console.log(shortestPath);
      for (let i = 1; i < shortestPath.length - 1; i++) {
         const current = shortestPath[i];
         document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile shortestpath-tile';
      }
   }

   resetVisualization() {
      if (!this.state.isSimulating) return;
      for (let i = 0; i < this.state.timeoutIDs.length; i++) {
         clearTimeout(this.state.timeoutIDs[i]);
      }
      const newGrid = this.state.grid;
      for (let i = 0; i < ROW_LENGTH; i++) {
         for (let j = 0; j < COL_LENGTH; j++) {
            newGrid[i][j].distance = Infinity;
            if (newGrid[i][j].isFinish || newGrid[i][j].isStart || newGrid[i][j].isObstacle) {
               continue;
            }
            if (newGrid[i][j].isVisited) {
               newGrid[i][j].isVisited = false;
               document.getElementById(`tile-${i}-${j}`).className = 'tile ';
            }
         }
      }
      this.setState({grid: newGrid, isSimulating: false});
      console.log(newGrid);
   }

   visualize() {
      if (this.state.isSimulating) return;
      this.setState({isSimulating: true});
      const {grid, directionsIndex, algorithmIndex, startPosition, finishPosition} = this.state;
      console.log(grid);
      const startTile = grid[startPosition[0]][startPosition[1]];
      const finishTile = grid[finishPosition[0]][finishPosition[1]];
      const paths = ALGORITHMS[algorithmIndex](grid, startTile, finishTile, DIRECTIONS[directionsIndex]);
      this.animateTraversal(paths[0]);
      console.log(paths[1]);
      let tID = setTimeout(() => {
         this.animateShortestPath(paths[1]);
      }, VISIT_TIME_DELAY * paths[0].length);
      let tIDList = this.state.timeoutIDs;
      tIDList.push(tID);
      this.setState({timeoutIDs: tIDList});
      console.log(grid);
   }

   render() {
      const {grid} = this.state;

      return (
         <div>
            <div className="heading">
               <h1>General Path Finder Simulation</h1>
               <button className="btn" onClick={() => this.visualize()}>
                  Visualize Algorithm
               </button>
               <button className="btn" onClick={() => this.resetVisualization()}>
                  Stop The Simulation!
               </button>
               <button id="reset" className="btn" onClick={() => this.resetGrid()}>
                  Reset The Grid
               </button>
               <br /><br />
               <span key="selectAlgorithm" className="selection-block">
                  <label htmlFor="algorithms" className="subtitle">Choose a Algorithm to search tiles:</label>
                  <br />
                  <select name="algorithms" className="selection" id="algorithmSelection">
                     <option value="0">Breadth First Search</option>
                     <option value="1">Depth First Search</option>
                     <option value="2">Dijkstra's Algorithm</option>
                  </select>
               </span>
               <span key="selectDirection" className="selection-block">
                  <label htmlFor="directions" className="subtitle">Choose a direction to travel:</label>
                  <br />
                  <select name="directions" className="selection" id="directionSelection">
                     <option value="0">Cardinal</option>
                     <option value="1">Diagonal</option>
                     <option value="2">Cardinal + Diagonal</option>
                     <option value="3">Knight Traversal</option>
                  </select>
               </span>
            </div>
            <div className="grid" style={{width: `${COL_LENGTH*TILE_WIDTH+TILE_WIDTH/2}px`}}>
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
