(this.webpackJsonppathfinder=this.webpackJsonppathfinder||[]).push([[0],[,,,,,,,,,,,,function(t,e,i){},function(t,e,i){},function(t,e,i){},,function(t,e,i){},function(t,e,i){"use strict";i.r(e);var s=i(1),n=i.n(s),a=i(7),r=i.n(a),o=(i(12),i(13),i(2)),c=i(3),l=i(5),h=i(4),d=(i(14),i(0)),u=function(t){Object(l.a)(i,t);var e=Object(h.a)(i);function i(t){var s;return Object(o.a)(this,i),(s=e.call(this,t)).state={},s}return Object(c.a)(i,[{key:"render",value:function(){var t=this.props,e=t.row,i=t.col,s=t.isFinish,n=t.isStart,a=t.isObstacle,r=t.onMouseDown,o=t.onMouseUp,c=t.onMouseEnter,l=s?"finish-tile":n?"start-tile":a?"obstacle-tile":"";return Object(d.jsx)("div",{id:"tile-".concat(e,"-").concat(i),className:"tile ".concat(l),onMouseDown:function(){return r(e,i)},onMouseUp:function(){return o()},onMouseEnter:function(){return c(e,i)}})}}]),i}(s.Component);i(16);var f=[10,5],g=[6,45],m=[[[1,0],[0,1],[-1,0],[0,-1]],[[1,1],[-1,1],[-1,-1],[1,-1]],[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],[[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]]],j=[function(t,e,i,s){if(!e||!i||e===i)return!1;t[e.row][e.col].distance=0;var n=[e],a=[],r=!1;t:for(;n.length>0;){var o=n.shift();for(var c in o.isVisited=!0,a.push(o),s){var l=o.col+s[c][0],h=o.row+s[c][1];if(!(l>=t[0].length||l<0||h>=t.length||h<0)){var d=t[h][l];if(d===i){r=!0;break t}d.isObstacle||d.distance===1/0&&(d.distance=o.distance+1,n.push(d))}}}var u=[];if(u.push(a),r){var f=function(t,e,i){var s=[e],n=e;for(;n.distance>0;){var a=n;for(var r in i){var o=n.col+i[r][0],c=n.row+i[r][1];if(!(o>=t[0].length||o<0||c>=t.length||c<0)){var l=t[c][o];l.isVisited&&l.distance<a.distance&&(a=l)}}s.unshift(a),n=a}return s}(t,i,s);u.push(f)}else console.log("yo what the"),u.push([]);return u},function(t,e,i,s){if(!e||!i||e===i)return!1;t[e.row][e.col].distance=0;var n=[e],a=[],r=!1;t:for(;n.length>0;){var o=n.pop();for(var c in o.isVisited||a.push(o),o.isVisited=!0,s){var l=o.col+s[c][0],h=o.row+s[c][1];if(!(l>=t[0].length||l<0||h>=t.length||h<0)){var d=t[h][l];if(d===i){r=!0;break t}d.isObstacle||d.isVisited||(d.distance=o.distance+1,n.push(d))}}}var u=[];if(u.push(a),r){var f=function(t,e,i){var s=[e],n=e;for(;n.distance>0;){var a=n;for(var r in i){var o=n.col+i[r][0],c=n.row+i[r][1];if(!(o>=t[0].length||o<0||c>=t.length||c<0)){var l=t[c][o];l.isVisited&&l.distance<a.distance&&(a=l)}}s.unshift(a),(n=a).isVisited=!0}return s}(t,i,s);u.push(f)}else console.log("yo what the"),u.push([]);return u},function(t,e,i,s){if(!e||!i||e===i)return!1;for(var n,a,r=new Set,o={},c=!1,l=[],h=0;h<t.length;h++)for(var d=0;d<t[0].length;d++)t[h][d].distance=1/0,o[t[h][d]]=null,r.add(t[h][d]);for(t[e.row][e.col].distance=0;r.size>0;){var u=Array.from(r);u.sort((function(t,e){return t.distance-e.distance}));var f=u[0];if(l.push(f),f.isVisited=!0,r.delete(f),f===i){c=!0;break}for(var g in s){var m=f.col+s[g][0],j=f.row+s[g][1];if(!(m>=t[0].length||m<0||j>=t.length||j<0)){var v=t[j][m];if(!v.isObstacle&&r.has(v)){var b=f.distance+(n=f,a=v,Math.sqrt(Math.pow(n.col-a.col,2)+Math.pow(n.row-a.row,2)));b<v.distance&&(v.distance=b,o[[v.row,v.col]]=f)}}}}if(c){for(var p=[],O=i;void 0!==O;)p.unshift(O),O=o[[O.row,O.col]];return console.log(p),[l,p]}return[l,[]]}],v=function(t){Object(l.a)(i,t);var e=Object(h.a)(i);function i(t){var s;return Object(o.a)(this,i),(s=e.call(this,t)).initializeGrid=function(){for(var t=[],e=0;e<15;e++){for(var i=[],n=0;n<50;n++){var a={row:e,col:n,distance:1/0,isVisited:!1,isStart:e===s.state.startPosition[0]&&n===s.state.startPosition[1],isFinish:e===s.state.finishPosition[0]&&n===s.state.finishPosition[1]};i.push(a)}t.push(i)}return t},s.state={grid:[],mouseIsPressed:!1,directionsIndex:0,algorithmIndex:0,timeoutIDs:[],isSimulating:!1,startPosition:f,finishPosition:g,dragStart:!1,dragFinish:!1},s}return Object(c.a)(i,[{key:"resetGrid",value:function(){if(!this.state.isSimulating){var t=this.initializeGrid();this.setState({grid:t})}}},{key:"componentDidMount",value:function(){var t=this.initializeGrid();this.setState({grid:t}),this.setUpChoice()}},{key:"handleMouseDown",value:function(t,e){if(!this.state.isSimulating){var i=this.state.grid;i[t][e].isStart?(this.setState({dragStart:!0,mouseIsPressed:!0}),console.log("down on start")):i[t][e].isFinish?this.setState({dragFinish:!0,mouseIsPressed:!0}):(i[t][e].isObstacle=!i[t][e].isObstacle,this.setState({grid:i,mouseIsPressed:!0}))}}},{key:"handleMouseEnter",value:function(t,e){if(this.state.mouseIsPressed&&!this.state.isSimulating){var i=this.state.grid;this.state.dragStart?(i[this.state.startPosition[0]][this.state.startPosition[1]].isStart=!1,i[this.state.startPosition[0]][this.state.startPosition[1]].distance=1/0,document.getElementById("tile-".concat(this.state.startPosition[0],"-").concat(this.state.startPosition[1])).className="tile ",this.setState({startPosition:[t,e]}),i[t][e].isStart=!0,document.getElementById("tile-".concat(t,"-").concat(e)).className="tile start-tile"):this.state.dragFinish?(i[this.state.finishPosition[0]][this.state.finishPosition[1]].isFinish=!1,document.getElementById("tile-".concat(this.state.finishPosition[0],"-").concat(this.state.finishPosition[1])).className="tile ",this.setState({finishPosition:[t,e]}),i[t][e].isFinish=!0,document.getElementById("tile-".concat(t,"-").concat(e)).className="tile finish-tile"):i[t][e].isObstacle=!i[t][e].isObstacle,this.setState({grid:i,mouseIsPressed:!0})}}},{key:"handleMouseUp",value:function(){this.setState({mouseIsPressed:!1,dragStart:!1,dragFinish:!1})}},{key:"setUpChoice",value:function(){var t=this,e=document.getElementById("directionSelection");e.addEventListener("change",(function(e){var i=e.target.value;i&&t.setState({directionsIndex:i})})),(e=document.getElementById("algorithmSelection")).addEventListener("change",(function(e){var i=e.target.value;i&&t.setState({algorithmIndex:i})}))}},{key:"animateTraversal",value:function(t){for(var e=this,i=function(i){if(t[i]===e.state.grid[e.state.finishPosition[0]][e.state.finishPosition[1]])return"continue";if(t[i]===e.state.grid[e.state.startPosition[0]][e.state.startPosition[1]])return"continue";var s=setTimeout((function(){var e=t[i];document.getElementById("tile-".concat(e.row,"-").concat(e.col)).className="tile visited-tile"}),25*i),n=e.state.timeoutIDs;n.push(s),e.setState({timeoutIDs:n})},s=0;s<t.length;s++)i(s)}},{key:"animateShortestPath",value:function(t){console.log(t);for(var e=1;e<t.length-1;e++){var i=t[e];document.getElementById("tile-".concat(i.row,"-").concat(i.col)).className="tile shortestpath-tile"}}},{key:"resetVisualization",value:function(){if(this.state.isSimulating){for(var t=0;t<this.state.timeoutIDs.length;t++)clearTimeout(this.state.timeoutIDs[t]);for(var e=this.state.grid,i=0;i<15;i++)for(var s=0;s<50;s++)e[i][s].distance=1/0,e[i][s].isFinish||e[i][s].isStart||e[i][s].isObstacle||e[i][s].isVisited&&(e[i][s].isVisited=!1,document.getElementById("tile-".concat(i,"-").concat(s)).className="tile ");this.setState({grid:e,isSimulating:!1}),console.log(e)}}},{key:"visualize",value:function(){var t=this;if(!this.state.isSimulating){this.setState({isSimulating:!0});var e=this.state,i=e.grid,s=e.directionsIndex,n=e.algorithmIndex,a=e.startPosition,r=e.finishPosition;console.log(i);var o=i[a[0]][a[1]],c=i[r[0]][r[1]],l=j[n](i,o,c,m[s]);this.animateTraversal(l[0]),console.log(l[1]);var h=setTimeout((function(){t.animateShortestPath(l[1])}),25*l[0].length),d=this.state.timeoutIDs;d.push(h),this.setState({timeoutIDs:d}),console.log(i)}}},{key:"render",value:function(){var t=this,e=this.state.grid;return Object(d.jsxs)("div",{children:[Object(d.jsxs)("div",{className:"heading",children:[Object(d.jsx)("h1",{children:"General Path Finder Simulation"}),Object(d.jsx)("button",{className:"btn",onClick:function(){return t.visualize()},children:"Visualize Algorithm"}),Object(d.jsx)("button",{className:"btn",onClick:function(){return t.resetVisualization()},children:"Stop The Simulation!"}),Object(d.jsx)("button",{id:"reset",className:"btn",onClick:function(){return t.resetGrid()},children:"Reset The Grid"}),Object(d.jsx)("br",{}),Object(d.jsx)("br",{}),Object(d.jsxs)("span",{className:"selection-block",children:[Object(d.jsx)("label",{htmlFor:"algorithms",className:"subtitle",children:"Choose a Algorithm to search tiles:"}),Object(d.jsx)("br",{}),Object(d.jsxs)("select",{name:"algorithms",className:"selection",id:"algorithmSelection",children:[Object(d.jsx)("option",{value:"0",children:"Breadth First Search"}),Object(d.jsx)("option",{value:"1",children:"Depth First Search"}),Object(d.jsx)("option",{value:"2",children:"Dijkstra's Algorithm"})]})]},"selectAlgorithm"),Object(d.jsxs)("span",{className:"selection-block",children:[Object(d.jsx)("label",{htmlFor:"directions",className:"subtitle",children:"Choose a direction to travel:"}),Object(d.jsx)("br",{}),Object(d.jsxs)("select",{name:"directions",className:"selection",id:"directionSelection",children:[Object(d.jsx)("option",{value:"0",children:"Cardinal"}),Object(d.jsx)("option",{value:"1",children:"Diagonal"}),Object(d.jsx)("option",{value:"2",children:"Cardinal + Diagonal"}),Object(d.jsx)("option",{value:"3",children:"Knight Traversal"})]})]},"selectDirection"),Object(d.jsxs)("div",{className:"legend",children:[Object(d.jsxs)("span",{id:"startTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile start-tile"}),Object(d.jsx)("span",{className:"legendText",children:" Start Tile"})]}),Object(d.jsxs)("span",{id:"finishTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile finish-tile"}),Object(d.jsx)("span",{className:"legendText",children:" Finish Tile"})]}),Object(d.jsxs)("span",{id:"obstacleTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile obstacle-tile"}),Object(d.jsx)("span",{className:"legendText",children:" Obstacle Tile"})]}),Object(d.jsxs)("span",{id:"unvisitedTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile"}),Object(d.jsx)("span",{className:"legendText",children:" Unvisited Tile"})]}),Object(d.jsxs)("span",{id:"visitedTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile visited-tile"}),Object(d.jsx)("span",{className:"legendText",children:" Visited Tile"})]}),Object(d.jsxs)("span",{id:"pathTileLegend",className:"legendEntry",children:[Object(d.jsx)("span",{className:"tile shortestpath-tile"}),Object(d.jsx)("span",{className:"legendText",children:" Path Tile"})]})]})]}),Object(d.jsx)("div",{className:"grid",style:{width:"".concat(1262.5,"px")},children:e.map((function(e,i){return Object(d.jsx)("div",{style:{height:"".concat("25px")},children:e.map((function(e,s){var n=e.isStart,a=e.isFinish,r=e.isObstacle;return Object(d.jsx)(u,{onMouseDown:function(e,i){return t.handleMouseDown(e,i)},onMouseUp:function(e,i){return t.handleMouseUp()},onMouseEnter:function(e,i){return t.handleMouseEnter(e,i)},row:i,col:s,isStart:n,isFinish:a,isObstacle:r},s)}))},i)}))})]})}}]),i}(s.Component);var b=function(){return Object(d.jsx)("div",{className:"App",children:Object(d.jsx)(v,{})})},p=function(t){t&&t instanceof Function&&i.e(3).then(i.bind(null,18)).then((function(e){var i=e.getCLS,s=e.getFID,n=e.getFCP,a=e.getLCP,r=e.getTTFB;i(t),s(t),n(t),a(t),r(t)}))};r.a.render(Object(d.jsx)(n.a.StrictMode,{children:Object(d.jsx)(b,{})}),document.getElementById("root")),p()}],[[17,1,2]]]);
//# sourceMappingURL=main.1884a9ba.chunk.js.map