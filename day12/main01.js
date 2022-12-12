const R = require('ramda');
const U = require('./utils');
const A = require('./astar');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let start, end;
    const grid =  lines.map((x, i) => x.split('').map((x, j) => {
        if (x === 'S') {
            start = [i, j];
            return 1;
        }
        if (x === 'E') {
            end = [i, j];
            return 'z'.charCodeAt(0)- 'a'.charCodeAt(0) + 1;
        };
        return x.charCodeAt(0)- 'a'.charCodeAt(0) + 1;
    }));

    return {
        start,
        end,
        grid
    }
}

// --------------------------------------------



function run({grid, start, end}) {

    // const {start, end, gird} = data;
    // U.log('Hello');

    const graphWithWeight = new A.Graph(grid);
	const startWithWeight = graphWithWeight.grid[start[0]][start[1]];
	const endWithWeight = graphWithWeight.grid[end[0]][end[1]];
	
    const neighborsInternal = graphWithWeight.neighbors;

    graphWithWeight.neighbors = function(node) {
        const res = neighborsInternal.call(this, node);
        return res.filter(x => x.weight - node.weight <= 1);
    }

    const resultWithWeight = A.astar.search(graphWithWeight, startWithWeight, endWithWeight, {
        heuristic: (pos0, pos1) => {
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
          }
    });

    // const result = data.length;

    return R.length(resultWithWeight);
}

