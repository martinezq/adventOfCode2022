const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return R.splitWhenever(x => x.length < 1, lines).map(x => x.map(y => JSON.parse(y)));
}

// --------------------------------------------

function isCorrectPair(x, y) {
    // U.log(x, y);

    if (Array.isArray(x) && Array.isArray(y)) {

        for (let i = 0; i < x.length; i++) {

            if (y[i] === undefined) return -1;

            const comp = isCorrectPair(x[i], y[i]);

            if (comp > 0) return 1;
            if (comp < 0) return -1;
        }

        if (x.length < y.length) return 1;

        return 0;
    }


    if (Array.isArray(x) && !Array.isArray(y)) {
        return isCorrectPair(x, [y]);
    }

    if (!Array.isArray(x) && Array.isArray(y)) {
        return isCorrectPair([x], y);
    }

    if (Number.isInteger(x) && Number.isInteger(y)) {
        return y - x;
    }
    
    return false;
}

function run(data) {

    // U.log('Hello');

    const res = data.map(a => {
        const x = isCorrectPair(a[0], a[1]);
        U.log(a, x);
        return x;
    }).map((x, i) => [i, x]);
    const res2 = res.filter(x => x[1] >= 0).map(x => x[0] + 1);

    const result = R.reduce(R.add, 0, res2);

    return result;
}

