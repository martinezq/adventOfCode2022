const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const sections = R.splitWhen(R.isEmpty, lines);

    const stackElements = sections[0].map(R.splitEvery(4));
    const stackElementsTransposed = R.transpose(stackElements)
    
    const stacks = stackElementsTransposed
        .map(R.dropLast(1))
        .map(R.dropWhile(x => R.trim(x).length < 1))
        .map(R.reverse)
        .map(R.map(y => y.split('')[1]));

    const moves = R.tail(sections[1]).map(x => {
        return U.parse(x, /move (\d+) from (\d+) to (\d+)/, ['num', 'from', 'to']);
    });

    return {
        stacks,
        moves
    };
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');

    let {stacks, moves} = data;

    moves.forEach(m => {
        const {num, from, to} = m;
        R.times(x => {
            const v = stacks[from - 1].pop();
            stacks[to - 1].push(v);
        }, num);
        
    });

    U.logf(stacks);

    const result = stacks.map(x => x.pop()).join('');

    return result;
}

