const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines[0].split('');
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let counter = 0;
    let result = 0;

    for (let i=0; i<data.length-4; i++) {
        const list = R.take(4, R.drop(i, data));
        if (R.uniq(list).length === 4) {
            counter++;
            result = i + 1;
            break;
        }
    }

    return result + 3;
}

