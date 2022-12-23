const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const moves = [];

    const moves1 = R.last(lines).split('');
    let buf = [];

    for (let i = 0; i < moves1.length; i ++) {
        if (Number.isInteger(Number.parseInt(moves1[i]))) {
            buf.push(moves1[i]);
        } else {
            moves.push(Number(buf.join('')));
            moves.push(moves1[i]);
            buf = [];
        }
    }

    moves.push(Number(buf.join('')));

    const map = R.dropLast(2, lines).map(line => line.split(''));
    
    //return lines.map(x => x);

    return { map, moves };
}

// --------------------------------------------


function run({ map, moves }) {

    const map2 = R.clone(map);

    const dxs = [1, 0, -1, 0];
    const dys = [0, 1, 0, -1];

    const rowLengths = map.map(r => r.filter(x => x !== ' ').length);
    const columnLengths = R.transpose(map).map(r => r.filter(x => x !== ' ').length);

    U.log('row lengths', rowLengths);
    U.log('column lengths', columnLengths);

    score = 0;

    U.log(U.matrixToTile(map));

    x = map[0].findIndex(x => x === '.');
    y = 0;
    f = 0;

    U.log('start', x, y, f);

    map2[y][x] = '>';

    moves.forEach(move => {
        if (Number.isInteger(move)) {
            for (let i = 0; i < move; i ++) {
                let dx = dxs[f];
                let dy = dys[f];
                let nextMap = map[y + dy]?.[x + dx];
                
                if (nextMap === ' ' || nextMap === undefined) {
                    // wrap

                    if (f === 0) {
                        dx = -(rowLengths[y] - 1);
                    }

                    if (f === 1) {
                        dy = -(columnLengths[x] - 1);
                    }

                    if (f === 2) {
                        dx = rowLengths[y] - 1;
                    }

                    if (f === 3) {
                        dy = columnLengths[x] - 1;
                    }

                }

                nextMap = map[y + dy][x + dx];

                if (nextMap === '#') {
                    // stop
                } else if (nextMap === '.') {
                    x += dx;
                    y += dy;
                    map2[y][x] = ['>', 'v', '<', '^'][f];
                } 
    
            }
        } else {
            f  = (4 + f + (move === 'R' ? 1 : -1)) % 4;
            map2[y][x] = ['>', 'v', '<', '^'][f];
        }

        
    });

    map2[y][x] = 'E';

    U.log(U.matrixToTile(map2));
    U.log('end', x, y);
    // --------------------------------------------
    
    const result = (y + 1) * 1000 + (x + 1) * 4 + f;

    return result;
}


// 80392 ok