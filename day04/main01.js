const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(',').map(y => y.split('-').map(Number)));
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    var count = 0;

    data.forEach(p => {
        const [x1, x2] = p[0];
        const [y1, y2] = p[1];

        // U.log(x1, x2, y1, y2);

        if ((y1 >= x1 && y2 <= x2) || (x1 >= y1 && x2 <= y2)) {
            count++;
        }

    });


    return count;
}

