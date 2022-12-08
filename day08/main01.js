const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split('').map(x => Number(x)));
}

// --------------------------------------------

function takeWhileP(f, a) {
    let res = [];
    let p = undefined
    a.forEach((x, i) => {
        if (f(x, p)) res.push(x);
        p = x;
    });

    U.log('res', res);

    return res;

}

function run(data) {

    const width = data[0].length;
    const height = data.length;
    
    // U.log('Hello');

    let counter = 0;

    let buf = {};

    data.forEach((line, i) => {
        let maxA = 0;
        for (let a = 0; a < width; a++) {
            if (a === 0 || a === width - 1 || line[a] > line[maxA]) {
                // U.log(a);
                buf[`${i},${a}`] = 1
                maxA = a;
            }
        }

        maxA = width - 1;
        for (let a = width - 1; a >= 0 ; a--) {
            if (a === 0 || a === width - 1 || line[a] > line[maxA]) {
                // U.log(a);
                buf[`${i},${a}`] = 1
                maxA = a;
            }
        }
    });

    for (let a = 0; a < width; a++) {
        let maxB = 0;
        for (let b = 0; b < height; b++) {
            if (b === 0 || b === height - 1 || data[b][a] > data[maxB][a]) {
                // U.log(a);
                buf[`${b},${a}`] = 1
                maxB = b;
            }
        }
        maxB = height - 1;
        for (let b = height - 1; b >= 0; b--) {
            if (b === 0 || b === height - 1 || data[b][a] > data[maxB][a]) {
                // U.log(a);
                buf[`${b},${a}`] = 1
                maxB = b;
            }
        }

    }

    U.logf(buf);

    // const result = 2 * width + 2 * height - 4;

    const result = R.values(buf).length;

    return result;
}

