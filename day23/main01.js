const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    let res = [];
    
    lines.forEach((line, y) => line.split('').forEach((pos, x) => pos === '#' ? res.push({ x, y, d: 0 }) : null));

    return res;
}

// --------------------------------------------

function run(data) {

    const dirs = [
        { dx: 0, dy: -1, checks: [{ dx: 0, dy: -1 }, { dx: -1, dy: -1 }, { dx: 1, dy: -1 }] },
        { dx: 0, dy: 1, checks: [{ dx: -1, dy: 1 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }] },
        { dx: -1, dy: 0, checks: [{ dx: -1, dy: -1 }, { dx: -1, dy: 0 }, { dx: -1, dy: 1 }] },
        { dx: 1, dy: 0, checks: [{ dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 }] },
    ];

    U.log(0, 'positions', data);

    for (let s = 0; s < 10; s++) {
        let moves = [];

        for (let i = 0; i < data.length; i++) {
            const {x, y, d} = data[i];

            moves[i] = null;

            const hasNeighbour = data.some(i => Math.max(Math.abs(i.x - x), Math.abs(i.y - y)) === 1);
            
            if (hasNeighbour) {
                for (let j = 0; j < 4; j++) {
                    const td = dirs[(d + j) % 4];
                    
                    const allChecksFree = R.all(
                        c => !R.any(
                            i => i.x === x + c.dx && i.y === y + c.dy, data
                        ), td.checks
                    );
                    
                    if (allChecksFree) {
                        moves[i] = { x: x + td.dx, y: y + td.dy, d: d };
                        break;
                    }
                }
            }
        }

        U.log((s + 1), 'moves', moves);

        let invalidMoveIndexes = [];

        moves.forEach((m, i) => {
            if (!m) return;

            const {x, y} = m;

            if (R.any(m2 => m2 !== null && m2 !== m && m2.x === x && m2.y === y, moves)) {
                invalidMoveIndexes[i] = true;
            }
        });

        moves.forEach((m, i) => {
            if (!invalidMoveIndexes[i] && m !== null) {
                data[i] = m;
            }
            data[i].d = (data[i].d + 1) % 4;
        });

        U.log((s + 1), 'positions', data);

        let m = R.times(x => R.times(y => '.', 15), 12);
        data.forEach(d => m[d.y][d.x] = '#');
        U.log(U.matrixToTile(m));
    
        
    }



    const minx = U.minA(data.map(i => i.x));
    const maxx = U.maxA(data.map(i => i.x));
    
    const miny = U.minA(data.map(i => i.y));
    const maxy = U.maxA(data.map(i => i.y));

    const result = (maxx - minx + 1) * (maxy - miny + 1) - data.length;

    return result;
}

