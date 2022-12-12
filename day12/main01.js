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

    const path = U.findPath(grid, start, end, {
        acceptNeighbor: (n, s) => n.weight - s.weight <= 1
    });

    return R.length(path);
}

