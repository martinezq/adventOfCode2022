const R = require('ramda');
const U = require('./utils');

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

    // ------------------------------------------------------------------------

    function test(grid, start, end) {
        const path = U.findPath(grid, start, end, {
            acceptNeighbor: (n, s) => n.weight - s.weight <= 1
        });
    
        return R.length(path);
    }

    // ------------------------------------------------------------------------

    let best = Number.POSITIVE_INFINITY;
    const startingGrid = U.mapMatrix(grid, x => x > 1 ? 0 : x);

    const startingPoints = U.mapMatrix(grid, (x, i, j) => (test(startingGrid, start, [i, j]) > 0) || (i === start[0] && j === start[1]));

    U.mapMatrix(startingPoints, (x, i, j) => {
        const result = x ? test(grid, [i, j], end) : Number.POSITIVE_INFINITY;
        if (result < best) {
            best = result;
        }
    });

    return best;
}

