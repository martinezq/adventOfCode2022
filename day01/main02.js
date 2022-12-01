const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run);

// --------------------------------------------

function parse(lines) {
    return R.splitWhenever(line => line === '', lines).map(x => x.map(Number));
}

function run(data) {

    U.log('Hello');

    const totals = data.map(x => R.reduce(R.add, 0, x));

    const totalsSorted = R.sortBy(x => -Number(x), totals);

    return totalsSorted[0] + totalsSorted[1] + totalsSorted[2];
}

