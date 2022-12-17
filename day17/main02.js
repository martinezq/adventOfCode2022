const R = require('ramda');
const U = require('./utils');

// --------------------------------------------

const shapes = [
    [
        '####'
    ],
    [
        '.#.',
        '###',
        '.#.'
    ],
    [
        '..#',
        '..#',
        '###'
    ],
    [
        '#',
        '#',
        '#',
        '#'
    ],
    [
        '##',
        '##'
    ]   
].map(s => s.map(r => r.split('')));

// const totalRocks = 2022;
// const maxHeight = totalRocks * 13;

const totalRocks = 10000000;
const maxHeight = totalRocks * 2 + 10;

// initialize map maxHeight x 7
let map = [];
for (let i = 0; i < maxHeight; i++) {
    map.push(['.', '.', '.', '.', '.', '.', '.']);
}


// --------------------------------------------

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines[0].split('').map(x => x === '>' ? 1 : -1)
}

// --------------------------------------------

function isColliding(shape, map, y, x) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === '#' && map[y + i][j + x] === '#') {
                return true;
            }
        }
    }

    return false;
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let count = 0;
    let time = 0;
    let topy = maxHeight;
    let besty = maxHeight;
    let delta = 0;
    let deltas = [];

    while (count < totalRocks) {
        for (let s = 0; s < shapes.length; s++) {
            if (count++ === totalRocks) break;

            topy = besty - shapes[s].length - 3;

            let x = 2;

            for (let y = topy; y < maxHeight - shapes[s].length + 1; y++) {
                const dx = data[time++ % data.length];

                if (x + dx < 0 || x + dx + shapes[s][0].length > 7 || isColliding(shapes[s], map, y, x + dx)) {
                    x = x;
                } else {
                    x += dx;
                }

                if (y + shapes[s].length === maxHeight || isColliding(shapes[s], map, y + 1, x)) {

                    // copy shape to map at y
                    for (let i = 0; i < shapes[s].length; i++) {
                        for (let j = 0; j < shapes[s][i].length; j++) {
                            if (shapes[s][i][j] === '#') {
                                map[y + i][x + j] = '#';
                            }
                        }
                    }

                    topy = y;
                    
                    const newBesty = Math.min(besty, y);
                    delta = besty - newBesty;
                    besty = newBesty;
                    
                    deltas.push(delta);
                    
                    
                    break;
                }
            }

            // U.log(count, time, maxHeight - besty, delta);
            // U.log(U.matrixToTile(map));
        }

    
    }
    U.log(maxHeight - besty);

    const bucket = 100000;
    const d2 = R.splitEvery(bucket, deltas).map(R.sum);

    console.log('---');
    d2.forEach(d => console.log(d));
    console.log('---');

    // pattern discovered in excel chart from the output above

    const pattern = 11;
    

    const first = d2[0];
    const next = R.take(pattern, R.drop(1, d2));

    const sumFirst = first;
    const sumNext = R.sum(next);

    
    let result = sumFirst;
    let it = bucket;

    while (it + pattern * bucket < 1000000000000) {
        it += pattern * bucket;
        result += sumNext;
    }

    const remaining = (1000000000000 - it) / bucket;

    result += R.sum(R.take(remaining, R.drop(1, d2)));


    return result;
}

// try: 1272363010045
// try: 1555113636385