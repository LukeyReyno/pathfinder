import React, {Component} from 'react';
import './Tile.css'

export default class Tile extends Component {
   constructor(props) {
      super(props);
      this.state = {};
   }

   render() {
      // Determine if properties are true, in order to add it to class name
      const {
         row, 
         col, 
         isFinish, 
         isStart,
         isObstacle,
         onMouseDown,
         onMouseUp,
         onMouseEnter,
      } = this.props;
      const extraClassName = isFinish
         ? 'finish-tile'
         : isStart
         ? 'start-tile'
         : isObstacle
         ? 'obstacle-tile'
         : '';

      return (
      <div 
      id={`tile-${row}-${col}`}
      className={`tile ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseUp={() => onMouseUp()}
      onMouseEnter={() => onMouseEnter(row, col)}>
      </div>
      )
   }
}
