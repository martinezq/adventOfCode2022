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

    let result = 0;
    const len = 14;

    for (let i = 0; i<data.length - len; i++) {
        const list = R.take(len, R.drop(i, data));

        if (R.uniq(list).length === len) {
            result = i + 1;
            break;
        }
    }

    return result + len - 1;
}

