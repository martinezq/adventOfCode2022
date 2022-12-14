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

function toMatrix(data) {

    let points = [];

    data.forEach(line => {
        for (let i = 1; i < line.length; i++) {
            const [x1, y1] = line[i - 1]
            const [x2, y2] = line[i];

            const calculatedPoints = U.createLinePointsBetween(x1, y1, x2, y2);

            points = points.concat(calculatedPoints);
        }
    });

    const minX = R.reduce(R.min, Number.POSITIVE_INFINITY, points.map(x => x[0]));
    const maxX = R.reduce(R.max, 0, points.map(x => x[0]));
    const maxY = R.reduce(R.max, 0, points.map(x => x[1]));

    const calculatedPoints = U.createLinePointsBetween(minX - maxY, maxY + 2, maxX + maxY, maxY + 2);

    points = points.concat(calculatedPoints);

    return U.createMatrixFromPoints(points, '.', (x) => '#');
}

// ---

function run(data) {
    const ssx = 500;
    const ssy = 0;

    const m = toMatrix(data);
    m[ssy][ssx] = '+';

    const bottom = m.length - 1;

    const window = U.calculateMatrixWindow(m, 1);
    U.log(U.matrixToTile(m, { window }));

    let count = 0;
    let active = true;

    const isEmpty = f => f !== '#' && f !== 'o';

    while (active) {

        // new unit
        let sx = ssx ;
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

    U.log(U.matrixToTile(m, { window }));

    const result = count;

    return result;
}

