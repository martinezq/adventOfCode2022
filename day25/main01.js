const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x);
}

// --------------------------------------------

function decode(snafu) {
    let result = 0;
    
    const map = {
        '=': -2,
        '-': -1,
        0: 0,
        1: 1,
        2: 2
    }
    
    const positions = snafu.split('');

    for (let i = 0 ; i < positions.length ; i++) {
        const x = map[positions[positions.length - i - 1]];
        const d = Math.pow(5, i) * x;
        result += d;
    }

    return result;
}

// arabic to roman number
function encode(num) {
    const map = {
        0: '0',
        1: '1',
        2: '2',
        3: '=',
        4: '-'
    }

    let result = '';

    while (num > 0) {
        const x = num % 5;

        result = map[x] + result;
        num = Math.floor(num / 5);

        if (x > 2) {
            num += 1;
        }

    }

    return result;
}

function run(data) {

    // U.log(encode(decode('1=')));

    const decimals = data.map(decode);

    const sumOfDecimals = R.sum(decimals);

    const result = encode(sumOfDecimals);

    // U.log(sumOfDecimals, decode(result));

    return result;
}

