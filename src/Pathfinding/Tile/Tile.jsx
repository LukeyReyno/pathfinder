import React, {Component} from 'react';
import './Tile.css'

export default class Tile extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }

   render() {
      // Determine if properties are true, in order to add it to class name
      const {row, col, tHeight, tWidth, isFinish, isStart} = this.props;
      const extraClassName = isFinish
         ? 'finish-tile'
         : isStart
         ? 'start-tile'
         : '';

      return (
      <div 
      id={`tile-${row}-${col}`}
      className={`tile ${extraClassName}`} 
      style={{
         height: `${tHeight}`, 
         width: `${tWidth}`,
         }}>
      </div>
      )
   }
}

export const DEFAULT_TILE = {
   row: 0,
   col: 0,
   tHeight: 0,
   tWidth: 0,
   isVisited: false,
   isStart: false,
   isFinish: false,
}