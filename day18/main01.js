const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(',').map(Number));
}

// --------------------------------------------

function twoCubesTouch(cube1, cube2) {
    const [x1, y1, z1] = cube1;
    const [x2, y2, z2] = cube2;

    const xDiff = Math.abs(x1 - x2);
    const yDiff = Math.abs(y1 - y2);
    const zDiff = Math.abs(z1 - z2);

    const result = xDiff + yDiff + zDiff === 1;
    
    return result;
}

// --------------------------------------------

function run(data) {

    const minX = R.reduce(R.min, Infinity, R.map(R.head, data));
    const maxX = R.reduce(R.max, -Infinity, R.map(R.head, data));

    const minY = R.reduce(R.min, Infinity, R.map(R.nth(1), data));
    const maxY = R.reduce(R.max, -Infinity, R.map(R.nth(1), data));

    const minZ = R.reduce(R.min, Infinity, R.map(R.nth(2), data));
    const maxZ = R.reduce(R.max, -Infinity, R.map(R.nth(2), data));

    U.log(minX, maxX, minY, maxY, minZ, maxZ);

    // --------------------------------------------

    let area = data.length * 6;

    for (let i = 0; i < data.length; i++) {
        const cube = data[i];

        for (let j = 0; j < data.length; j++) {
            const candidate = data[j];

            if (i === j) continue;

            if (twoCubesTouch(cube, candidate)) {
                area -= 1;
            }

        }
    }

    const result = area;

    return result;
}

