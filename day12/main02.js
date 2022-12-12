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

    function test(grid, start, end) {

        const graphWithWeight = new A.Graph(grid);
        const startWithWeight = graphWithWeight.grid[start[0]][start[1]];
        const endWithWeight = graphWithWeight.grid[end[0]][end[1]];
        
        const neighborsInternal = graphWithWeight.neighbors;

        graphWithWeight.neighbors = function(node) {
            const res = neighborsInternal.call(this, node);
            return res.filter(x => x.weight - node.weight <= 1);
        }

        const resultWithWeight = A.astar.search(graphWithWeight, startWithWeight, endWithWeight);

        return R.length(resultWithWeight);
    }

    let best = Number.POSITIVE_INFINITY;

    const grid2 = U.mapMatrix(grid, x => x > 1 ? 0 : x);

    grid.forEach((line, i) => {
        line.forEach((pos, j) => {
            if (pos === 1) {
                const x = test(grid2, start, [i, j])

                if (x > 0) {
                    const res = test(grid, [i, j], end);

                    if (res < best) {
                        best = res;
                    }
                }
            }
        })
    });


    return best;
}

