const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const s1 =  R.splitWhenever(R.isEmpty, lines);
    const s2 = s1.map(x => ({
        items: x[1].split(': ')[1].split(', ').map(Number),
        op: R.takeLast(2, x[2].split(' ')),
        test: Number(R.last(x[3].split(' '))),
        branch1: Number(R.last(x[4].split(' '))),
        branch2: Number(R.last(x[5].split(' '))),
        counter: 0
    }));

    // U.log(s3);

    return s2;
}

// --------------------------------------------

function run(data) {

    const xx = data.map(x => x.test).reduce(R.multiply, 1);

    // U.log('Hello');
    let monkeys = data;

    function applyOp(op, value) {
        const arg = op[1] === 'old' ? value : Number(op[1]);
        if (op[0] === '+') {
            return value + arg;
        } else {
            return value * arg;
        }
    }

    R.times(n => {
        U.log(' -> iteration',n);

        monkeys.forEach(m => {
            m.items.forEach(i => {
                m.counter++;
                const l1 = applyOp(m.op, i);
                const l2 = l1; //Math.floor(l1 / 3);
                const test = l2 % m.test === 0;
                if (test) {
                    monkeys[m.branch1].items.push(l2 % xx);
                } else {
                    monkeys[m.branch2].items.push(l2 % xx);
                }
            });
            m.items = [];
        });    

    }, 10000);

    const result = R.sortBy(x => -x, monkeys.map(x => x.counter));

    U.log('results', result);

    return result[0] * result[1];
}

