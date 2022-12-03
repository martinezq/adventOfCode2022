const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => {
        return [
            R.take(x.length / 2, x).split(''),
            R.takeLast(x.length / 2, x).split(''),
        ]
    });
}

function rank(c) {
    if (c >= 'a' && c <= 'z') return c.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    return c.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    const commons = data.map(x => {
        return x[0].find(y => x[1].find(z => y === z));
    });

    const ranks = commons.map(rank);

    // U.logf(commons);
    // U.logf(ranks);

    const result = R.reduce(R.add, 0, ranks)

    return result;
}

