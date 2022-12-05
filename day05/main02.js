const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const r = R.splitWhen(x => x.length < 2, lines);

    const r1 = r[0].map(R.splitEvery(4));
    const r2 = r1.map(x => x.map(R.trim));

    let result = [];

    r2.forEach((x) => {
        x.forEach((y, i) => {
            if (y.length > 2) {
                result[i] = result[i] || [];
                result[i].push(y.split('')[1]);
            }
        })
    });

    result = result.map(r => R.reverse(r));

    const moves = R.tail(r[1]).map(x => {
        return U.parse(x, /move (\d+) from (\d+) to (\d+)/, ['num', 'from', 'to']);
    });

    return {
        stack: result,
        moves
    };
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let {stack, moves} = data;

    moves.forEach(m => {
        const {num, from, to} = m;
        const a = R.takeLast(num, stack[from - 1]);
        stack[from - 1]= R.take(stack[from - 1].length - num, stack[from - 1]);
        stack[to - 1] = R.concat(stack[to - 1], a);
        
    });

    U.logf(stack);

    const result = stack.map(x => x.pop()).join('');

    return result;
}

