const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' ->').map(x => x.split(',').map(Number)));
}

// --------------------------------------------

function calcOffset(data) {
    let mx = Number.POSITIVE_INFINITY

    data.forEach(line => {
        for (let i = 1; i < line.length; i++) {
            const [x1, y1] = line[i - 1]
            const [x2, y2] = line[i];

            mx = U.minA([mx, x1, x2]);
        }
    });

    return mx;
}

function createLineFromTo(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    let line = [];

    if (dx === 0) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            line.push([x1, y]);
        }
    }

    if (dy === 0) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            line.push([x, y1]);
        }
    }
    
    return line;    
}

function toMatrix(data, offset) {

    let points = [];

    data.forEach(line => {
        for (let i = 1; i < line.length; i++) {
            const [x1, y1] = line[i - 1]
            const [x2, y2] = line[i];

            const calculatedPoints = createLineFromTo(x1 - offset, y1, x2 - offset, y2);

            points = points.concat(calculatedPoints);
        }
    });

    const minX = R.reduce(R.min, 0, points.map(x => x[0]));
    const maxX = R.reduce(R.max, 0, points.map(x => x[0]));
    const maxY = R.reduce(R.max, 0, points.map(x => x[1]));

    const calculatedPoints = createLineFromTo(minX - maxY, maxY + 2, maxX + maxY, maxY + 2);

    points = points.concat(calculatedPoints);


    return U.createMatrixFromPoints(points, '.', (x) => '#');
}

// ---

function run(data) {
    const ssx = 500;
    const ssy = 0;

    const offset = calcOffset(data) - 10;

    const m = toMatrix(data, offset);

    const bottom = m.length - 1;


    U.log(U.matrixToTile(m));

    let count = 0;
    let active = true;

    const isEmpty = f => f !== '#' && f !== 'o';

    while (active) {

        // new unit
        let sx = ssx - offset;
        let sy = ssy;

        if (!isEmpty(m[sy][sx])) break;
        
        while (true) {

            if (isEmpty(m[sy + 1][sx])) {
                sy++;
                continue;
            } else if (isEmpty(m[sy + 1][sx - 1])) {
                sy++
                sx--;
                continue;
            } else if (isEmpty(m[sy + 1][sx + 1])) {
                sy++;
                sx++;
                continue;
            }
            
            m[sy][sx] = 'o';
            count++;
            break;
        }

    }

    U.log(U.matrixToTile(m));

    const result = count;

    return result;
}

