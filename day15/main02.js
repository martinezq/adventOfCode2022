const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines
        .map(x => x.match(/x=(-?\d+), y=(-?\d+).*x=(-?\d+), y=(-?\d+)/))
        .filter(R.identity).map(x => R.tail(x).map(Number))
        .map(R.splitEvery(2));
}

// --------------------------------------------

function distance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

// function calculates crossing point of two segments, based on given point coordinates
// each segment is defined by starting and ending point
function crossingPoints(segment, segment2) {
    const [x1, y1] = segment[0];
    const [x2, y2] = segment[1];
    const [x3, y3] = segment2[0];
    const [x4, y4] = segment2[1];

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denominator === 0) {
        return [];
    }

    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;

    if (x < Math.min(x1, x2) || x > Math.max(x1, x2) || x < Math.min(x3, x4) || x > Math.max(x3, x4)) {
        return [];
    }

    return [[Math.round(x), Math.round(y)]];
}

function run(data) {

    const min = 0
    // const max = 20;
    const max = 4000000;

    let candidatePoints = [];
    let candidateLines = [];

    data.forEach(line => {
        U.log(line);

        const [sx, sy] = line[0];
        const [bx, by] = line[1];

        const dist = distance(line[0], line[1]) + 1;

        candidateLines.push([[sx, sy - dist],[sx + dist - 1, sy - 1]]);
        candidateLines.push([[sx + dist, sy],[sx + 1, sy + dist - 1]]);
        candidateLines.push([[sx, sy + dist], [sx - dist + 1, sy + 1]]);
        candidateLines.push([[sx - dist, sy], [sx - 1, sy - dist + 1]]);
        
    });

    const countPoint = (x, y) => {
        if (x < min || x > max || y < min || y > max) {
        
        } else {
            const f = x * 4000000 + y;
            candidatePoints[f] = (candidatePoints[f] || 0) + 1;
        }
    }

    candidateLines.forEach(l1 => {
        candidateLines.forEach(l2 => {
            if (l1 === l2) return;

            const cps = crossingPoints(l1, l2);

            // U.log(l1, l2, cp);

            cps.forEach(cp => countPoint(cp[0], cp[1]));
        });
    });

    // 13617887632466 - why bad?
    // 13360899249595 - good

    function testPoint(freq) {
        const y = freq % 4000000;
        const x = (freq - y) / 4000000;

        let ranking = 1;

        data.forEach(line => {
            const distanceToSensor = distance(line[0], [x, y]);
            const distanceToBeacon = distance(line[1], [x, y]);
            const dist = distance(line[0], line[1]);
            

            if (distanceToSensor <= dist || distanceToSensor === 0 || distanceToBeacon === 0) {
                ranking = 0;
            }
        });

        return ranking;
    }

    const ranking = R.sortBy(x => -x.ranking, R.keys(candidatePoints).map(k => ({ ranking: testPoint(Number(k)), freq: Number(k) })));

    // U.log(ranking);
    
    // U.logf(ranking.map(p => {
    //     const y = p.freq % 4000000;
    //     const x = (p.freq - y) / 4000000;

    //     return {point: [x, y], freq: p.freq};
    // }));

    const result = R.head(ranking);

    return result.freq;

}

