const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.filter(x => x.length > 0).map(x => JSON.parse(x));
}

// --------------------------------------------

function comparePackages(x, y) {
    // U.log(x, y);

    if (Array.isArray(x) && Array.isArray(y)) {

        for (let i = 0; i < x.length; i++) {

            if (y[i] === undefined) return -1;

            const comp = comparePackages(x[i], y[i]);

            if (comp > 0) return 1;
            if (comp < 0) return -1;
        }

        if (x.length < y.length) return 1;

        return 0;
    }


    if (Array.isArray(x) && !Array.isArray(y)) {
        return comparePackages(x, [y]);
    }

    if (!Array.isArray(x) && Array.isArray(y)) {
        return comparePackages([x], y);
    }

    if (Number.isInteger(x) && Number.isInteger(y)) {
        return y - x;
    }
    
}

function run(data) {

    const input = data.concat([[[2]], [[6]]]);

    const sorted = input.sort((x, y) => -comparePackages(x, y));

    const a = R.findIndex(R.equals([[2]]), sorted) + 1;
    const b = R.findIndex(R.equals([[6]]), sorted) + 1;

    U.log(sorted);

    return a * b;
}

