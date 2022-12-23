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

    let round = 0;
    let go = true;

    while(go) {
        round++;

        U.log('------- ROUND ' + round + ' -------');

        let moves = [];

        for (let i = 0; i < data.length; i++) {
            const {x, y, d} = data[i];

            moves[i] = null;

            const hasNeighbour = data.filter(d => d !== data[i]).some(d => Math.max(Math.abs(d.x - x), Math.abs(d.y - y)) === 1);
            
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

        // U.log(round, 'moves', moves);

        let invalidMoveIndexes = [];

        moves.forEach((m, i) => {
            if (!m) return;

            const {x, y} = m;

            if (R.any(m2 => m2 !== null && m2 !== m && m2.x === x && m2.y === y, moves)) {
                invalidMoveIndexes[i] = true;
            }
        });

        go = false;

        moves.forEach((m, i) => {
            if (!invalidMoveIndexes[i] && m !== null) {
                data[i] = m;
                go = true;
            }
            data[i].d = (data[i].d + 1) % 4;
        });

        // U.log(round, 'positions', data);
            
    }

    // let m = R.times(x => R.times(y => '.', 15), 12);
    // data.forEach(d => m[d.y][d.x] = '#');
    // U.log(U.matrixToTile(m));

    const result = round;

    return result;
}

