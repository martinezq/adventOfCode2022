const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run);

// --------------------------------------------

function parse(lines) {
    return lines;
}

function run(data) {

    U.log('Hello');

    return data.length;
}

