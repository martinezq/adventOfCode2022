const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: true
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x);
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    const result = data.length;

    return result;
}

