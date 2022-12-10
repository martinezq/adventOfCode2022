const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' ')).map(([cmd, arg]) => ([cmd, Number(arg)]));
}

// --------------------------------------------

function run(data) {

    let x = 1;
    let cycles = 0;
    let result = 0;

    const doCount = () => {
        cycles++;

        if ((cycles - 20) % 40 === 0) {
            result += x * cycles;
        }
    }

    data.forEach(line => {
        const [cmd, arg] = line;

        doCount();

        if (cmd === 'addx') {
            R.times(x => doCount(), 1);
            x += arg;
        }

    });
    
    return result;
}

