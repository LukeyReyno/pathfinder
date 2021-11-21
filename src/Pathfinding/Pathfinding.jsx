import React, {Component} from "react";
import Tile from './Tile/Tile'

import './Pathfinding.css';

const ROW_LENGTH = 15;
const COL_LENGTH = 50;

const START_POS = [10, 5];
const FINISH_POS = [10, 45];

const TILE_LENGTH = "25px";

export default class Pathfinding extends Component {
   constructor(props) {
      super(props);
      this.state = {
         grid: [],
      };
   }

   componentDidMount() {
      const grid = initializeGrid();
      this.setState({grid});
      console.log(START_POS[0]);
   }

   render() {
      const {grid} = this.state;

      return (
         <div>
            <h1>SUS</h1>
            <div className="grid">
               {grid.map((row, rowIndex) => {
                  return (
                  <div key={rowIndex} style={{height: TILE_LENGTH}}>
                     {row.map((tile, tileIndex) => {
                        const {isStart, isFinish} = tile;
                        return (
                           <Tile
                              key={tileIndex}
                              row={rowIndex}
                              col={tileIndex}
                              tHeight={TILE_LENGTH}
                              tWidth={TILE_LENGTH}
                              isStart={isStart}
                              isFinish={isFinish}></Tile>
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
            isStart: row === START_POS[0] && col === START_POS[1],
            isFinish: row === FINISH_POS[0] && col === FINISH_POS[1],
         };
         currentRow.push(currentTile);
      }
      grid.push(currentRow);
   }
   return grid;
}
