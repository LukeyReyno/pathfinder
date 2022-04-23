import React, {Component} from "react";
import axios from 'axios';
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

var visit_time = 25; // in ms

// Neighboring nodes -- TilePosition + (a, b)
const CARDINAL = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const DIAGONAL = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const CARDINAL_DIAGONAL = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const KNIGHT_TRAVERSE = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];
const DIRECTIONS = [CARDINAL, DIAGONAL, CARDINAL_DIAGONAL, KNIGHT_TRAVERSE];

const ALGORITHMS = [breadthFirstSearch, depthFirstSearch, dijkstra];

// General Pathfinding Main Object
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
         adviceObject: {} 
      };
   }

   // Create a matrix of row length and col length
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
   // wipes the obstacles on the grid, if not simulating
      if (this.state.isSimulating) return;
      const newGrid = this.initializeGrid();
      this.setState({grid: newGrid});
   }

   componentDidMount() {
      const grid = this.initializeGrid();
      this.setState({grid});
      this.setUpChoice();
      this.getAdvice();
   }

   getAdvice() {
        try {
            axios.get('http://45.77.6.116:3032/advice').then(response => {
                // response data is an array with 1 object
                const adviceObject = response.data[0];
                console.log(response.status); 
                console.log(adviceObject.advice);
                this.setState({adviceObject}); //should be json object with adivce and source
            });
        }
        catch (error){
            //We're not handling errors. Just logging into the console.
            console.log(error);
            return false;
        }
    }

   // Following mouse functions handles dragging of obstacle tiles
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

   handleTimeScaleChange() {
   // change time scale value with the scroll and text
      visit_time = document.getElementById('time slider').value;
      document.getElementById('time value').textContent = visit_time;
   }

   // drop down menu selector
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

   // handles changes in tile color 
   animateTraversal(vistedTilesInOrder) {
      for (let i = 0; i < vistedTilesInOrder.length; i++) {
         // In case specific algorithms return start or finish in their visitation order
         if (vistedTilesInOrder[i] === this.state.grid[this.state.finishPosition[0]][this.state.finishPosition[1]]) continue;
         if (vistedTilesInOrder[i] === this.state.grid[this.state.startPosition[0]][this.state.startPosition[1]]) continue;

         let tID = setTimeout(() => {
            const current = vistedTilesInOrder[i];
            document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile visited-tile';
         }, visit_time * i);
         let tIDList = this.state.timeoutIDs;
         tIDList.push(tID);
         this.setState({timeoutIDs: tIDList});
      }
   }

   animateShortestPath(shortestPath) {
      // Case where the path from start to finish is impossible
      if (shortestPath.length === 0) {
         document.getElementById('mainGrid').style.backgroundColor = 'red';
      }
      else {
         for (let i = 1; i < shortestPath.length - 1; i++) {
            const current = shortestPath[i];
            document.getElementById(`tile-${current.row}-${current.col}`).className = 'tile shortestpath-tile';
         }
      }
   }

   // Deletes visitations and shortest path tiles
   resetVisualization() {
      if (!this.state.isSimulating) return;
      document.getElementById('mainGrid').style.backgroundColor = '';
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
   // Only runs when grid is not already being simulated
   // computes a path and dedicates time values to visited tiles
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
      }, visit_time * paths[0].length);
      let tIDList = this.state.timeoutIDs;
      tIDList.push(tID);
      this.setState({timeoutIDs: tIDList});
      console.log(grid);
   }

    render() {
      // main html body and method association
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
               <div class="slider">
                  Time Scale: <span id="time value">25</span> ms per tile visit<br/>
                  <input id="time slider" type="range" min="1" max="50" defaultValue="25" step="1" onInput={this.handleTimeScaleChange}/>
               </div>
               <div className="legend">
                  <span id="startTileLegend" className="legendEntry">
                     <span className="tile start-tile"></span>
                     <span className="legendText"> Start Tile</span>
                  </span>
                  <span id="finishTileLegend" className="legendEntry">
                     <span className="tile finish-tile"></span>
                     <span className="legendText"> Finish Tile</span>
                  </span>
                  <span id="obstacleTileLegend" className="legendEntry">
                  <span className="tile obstacle-tile"></span>
                     <span className="legendText"> Obstacle Tile</span>
                  </span>
                  <span id="unvisitedTileLegend" className="legendEntry">
                     <span className="tile"></span>
                     <span className="legendText"> Unvisited Tile</span>
                  </span>
                  <span id="visitedTileLegend" className="legendEntry">
                  <span className="tile visited-tile"></span>
                     <span className="legendText"> Visited Tile</span>
                  </span>
                  <span id="pathTileLegend" className="legendEntry">
                     <span className="tile shortestpath-tile"></span>
                     <span className="legendText"> Path Tile</span>
                  </span>
               </div>
            </div>
            <h3 id="adviceText">"{this.state.adviceObject.advice}" - </h3>
            <h3 id="adviceText">{this.state.adviceObject.source}</h3>
            <div className="grid" id="mainGrid" style={{width: `${COL_LENGTH*TILE_WIDTH+TILE_WIDTH/2}px`}}>
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
      );
   }
}
