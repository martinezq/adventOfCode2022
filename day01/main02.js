const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run);

// --------------------------------------------

function parse(lines) {
    var result = [[]];
    var index = 0;
    
    lines.forEach(line => {
        if (line === '') {
            index ++;
            result[index] = [];
        } else {
            result[index].push(Number(line));
        }
    });
    
    return result;
}

function run(data) {

    U.log('Hello');

    const totals = data.map(x => R.reduce(R.add, 0, x));

    const totalsSorted = R.sortBy(x => -Number(x), totals);

    return totalsSorted[0] + totalsSorted[1] + totalsSorted[2];
}

