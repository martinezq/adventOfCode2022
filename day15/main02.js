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

function run(data) {

    const min = 0
    // const max = 20;
    const max = 4000000;

    // ------------------------------------------------------------------------

    function calculateCandidateSegments() {

        let res = [];

        data.forEach(line => {
            U.log(line);

            const [sx, sy] = line[0];

            const dist = U.distanceManhattan(line[0], line[1]) + 1;

            res.push([[sx, sy - dist],[sx + dist - 1, sy - 1]]);
            res.push([[sx + dist, sy],[sx + 1, sy + dist - 1]]);
            res.push([[sx, sy + dist], [sx - dist + 1, sy + 1]]);
            res.push([[sx - dist, sy], [sx - 1, sy - dist + 1]]);
            
        });

        return res;
    }

    // ------------------------------------------------------------------------

    function calculateCandidateFreqs(candidateSegments) {

        let res = [];

        candidateSegments.forEach(s1 => {
            candidateSegments.forEach(s2 => {
                if (s1 === s2) return;

                const cp = U.crossingPoint(s1, s2);

                if (cp) {
                    const freq = cp[0] * 4000000 + cp[1];
                    res.push(freq);
                }
                
            });
        });

        return R.uniq(res);
    }

    // ------------------------------------------------------------------------

    function validateFreq(freq) {
        const y = freq % 4000000;
        const x = (freq - y) / 4000000;

        let valid = x >= min && x <= max && y >= min && y <= max;

        if (!valid) return false;

        data.forEach(line => {
            const distanceToSensor = U.distanceManhattan(line[0], [x, y]);
            const distanceToBeacon = U.distanceManhattan(line[1], [x, y]);
            const dist = U.distanceManhattan(line[0], line[1]);
            

            if (distanceToSensor <= dist || distanceToSensor === 0 || distanceToBeacon === 0) {
                valid = false;
            }
        });

        return valid;
    }
    
    // ------------------------------------------------------------------------

    const segments = calculateCandidateSegments();
    const freqs = calculateCandidateFreqs(segments);

    const validFreqs = freqs.filter(validateFreq);

    const result = R.head(validFreqs);

    return result;

}

