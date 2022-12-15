const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines
        .map(x => x.match(/x=(\d+), y=(\d+).*x=(\d+), y=(\d+)/))
        .filter(R.identity).map(x => R.tail(x).map(Number))
        .map(R.splitEvery(2));
}

// --------------------------------------------

function distance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function run(data) {

    const y = 2000000;

    const minX = U.minA(data.map(x => [x[0][0], x[1][0]]).flat());
    const maxX = U.maxA(data.map(x => [x[0][0], x[1][0]]).flat());
    const size = Math.abs(minX) + Math.abs(maxX);

    let count = 0;

    for (let x = minX - size; x < maxX + size; x++) {
        let res = false;
        
        data.forEach(line => {
            const distanceToBeacon = distance(line[1], [x, y]);

            if (distanceToBeacon <= 0) {
                return;
            }

            const distanceToSensor = distance(line[0], [x, y]);
            const radius = distance(line[0], line[1]);

            if (distanceToSensor <= radius) { 
                res = true;
            }
        });

        if (res) {
            // U.log(x, y);
            count++;
        }

    }
 
    const result = count;

    return result;
}

