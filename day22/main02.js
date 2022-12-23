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

function findEdges(map, s = 4) {
    let edges = [];
    
    const maxLength = U.maxA(map.map(r => r.length));

    for (let y = 0; y < map.length; y += s) {
        for (let x = 0; x < maxLength; x += s) {
            if (map[y][x] !== ' ' && map[y][x] !== undefined) {
                edges.push([x, y, x + s - 1, y]);
                edges.push([x, y, x, y + s - 1]);
                edges.push([x, y + s - 1, x + s - 1, y + s - 1]);
                edges.push([x + s - 1, y, x + s - 1, y + s - 1]);
            }
        }
    }

    return edges;
}

function removeAdjustingEdges(edges) {
    const edges2 = [];

    for (let i = 0; i < edges.length; i ++) {
        const e1 = edges[i];

        let found = false;

        for (let j = 0; j < edges.length; j ++) {
            if (i === j) {
                continue;
            }

            const e2 = edges[j];

            const dist = Math.abs(e1[0] - e2[0]) + Math.abs(e1[1] - e2[1]) + Math.abs(e1[2] - e2[2]) + Math.abs(e1[3] - e2[3]);

            if (dist === 2) {
                found = true;
                break;
            }
        }

        if (!found) {
            edges2.push(e1);
        }
    }

    return edges2;
}

function findEdgeIndex(x, y, f, edges) {
    for (let i = 0; i < edges.length; i ++) {
        const e = edges[i];

        if (x >= e[0] && x <= e[2] && y >= e[1] && y <= e[3]) {
            if ((f === 0 || f === 2) && e[0] === e[2]) return i;
            if ((f === 1 || f === 3) && e[1] === e[3]) return i;
        }
    }
}

function printEdges(map, edges) {
    let map2 = R.clone(map);

    for (let i = 0; i < edges.length; i ++) {
        const e = edges[i];

        for (let x = e[0]; x <= e[2]; x ++) {
            for (let y = e[1]; y <= e[3]; y ++) {
                map2[y][x] = i.toString(16).toUpperCase();
            }
        }
    }

    U.log(U.matrixToTile(map2));
}

function normalizeEdge(edge) {
    const dx = edge[2] - edge[0];
    const dy = edge[3] - edge[1];
    
    return [0, 0, dx, dy];
}

function rotate(edge, r) {
    const xs = edge[0];
    const ys = edge[1];

    const ne = normalizeEdge(edge)

    const v = [ne[2], ne[3]];

    for (let i = 0; i < r; i ++) {
        const x = v[0];
        const y = v[1];

        v[0] = -y;
        v[1] = x;
    }

    return [xs, ys, xs + v[0], ys + v[1]];
}

// --------------------------------------------

function run({ map, moves }) {

    const edges = findEdges(map, map.length > 50 ? 50 : 4);
    // U.log('edges', edges.length, edges);
    const externalEdges = removeAdjustingEdges(edges);
    U.logf('externalEdges', externalEdges.length, externalEdges);

    const edgeMapExample = [
        { from: externalEdges[0],  to: externalEdges[3],  r: 2 },
        { from: externalEdges[1],  to: externalEdges[6],  r: 2 },
        { from: externalEdges[2],  to: externalEdges[12], r: 2 },
        { from: externalEdges[3],  to: externalEdges[0],  r: 2 },
        { from: externalEdges[4],  to: externalEdges[12], r: 2 },
        { from: externalEdges[5],  to: externalEdges[10], r: 2 },
        { from: externalEdges[6],  to: externalEdges[1],  r: 1 },
        { from: externalEdges[7],  to: externalEdges[9],  r: 2 },
        { from: externalEdges[8],  to: externalEdges[11], r: 1, rev: true },
        { from: externalEdges[9],  to: externalEdges[7],  r: 2 },
        { from: externalEdges[10], to: externalEdges[5],  r: 2, rev: true },
        { from: externalEdges[11], to: externalEdges[8],  r: 2 },
        { from: externalEdges[12], to: externalEdges[4],  r: 2, rev: true },
        { from: externalEdges[13], to: externalEdges[2],  r: 2 },
    ];

    const edgeMap = [
        { from: externalEdges[0],  to: externalEdges[11], r: 1 },
        { from: externalEdges[1],  to: externalEdges[8],  r: 2, rev: true },
        { from: externalEdges[2],  to: externalEdges[12], r: 0},
        { from: externalEdges[3],  to: externalEdges[6],  r: 1 },
        { from: externalEdges[4],  to: externalEdges[10], r: 2, rev: true },
        { from: externalEdges[5],  to: externalEdges[7],  r: 3 },
        { from: externalEdges[6],  to: externalEdges[3],  r: 3 },
        { from: externalEdges[7],  to: externalEdges[5],  r: 1},
        { from: externalEdges[8],  to: externalEdges[1],  r: 2, rev: true },
        { from: externalEdges[9],  to: externalEdges[13], r: 1 },
        { from: externalEdges[10], to: externalEdges[4],  r: 2, rev: true },
        { from: externalEdges[11], to: externalEdges[0],  r: 3 },
        { from: externalEdges[12], to: externalEdges[2],  r: 0},
        { from: externalEdges[13], to: externalEdges[9],  r: 3 },
    ];    

    U.log('edgeMap', edgeMap);
    
    printEdges(map, externalEdges);

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


    // --------------------------------------------

    let count = 0;

    moves.forEach(move => {
        U.log(++count, move);
        if (Number.isInteger(move)) {
            for (let i = 0; i < move; i ++) {
                let dx = dxs[f];
                let dy = dys[f];
                let nextMap = map[y + dy]?.[x + dx];
                
                let nf = f;

                if (nextMap === ' ' || nextMap === undefined) {
                    // wrap
                    const edgeIndex = findEdgeIndex(x, y, f, externalEdges);
                    const { from, to, r, rev } = edgeMap[edgeIndex];

                    const ble = [from[0], from[1], x, y];
                    const nble = normalizeEdge(ble);
                    const rnble = rotate(nble, r);

                    let to2 = to;

                    if (rev) {
                        to2 = [to[2], to[3], to[0], to[1]];
                    }

                    const nx = to2[0] + rnble[2];
                    const ny = to2[1] + rnble[3];

                    U.log(to, r, nx, ny);

                    dx = nx - x;
                    dy = ny - y;
                    

                    nf = (4 + f + r) % 4;

                    // U.log(to);

                }

                nextMap = map[y + dy][x + dx];

                if (nextMap === '#') {
                    // stop
                } else if (nextMap === '.') {
                    x += dx;
                    y += dy;
                    f = nf;
                    map2[y][x] = ['>', 'v', '<', '^'][f];
                } else {
                    U.log('error!');
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


// 166013 too high
// 166013
// 165167
// 120103 too high
// 141232
// 19534