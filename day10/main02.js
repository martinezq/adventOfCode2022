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

    let screen = R.times(() => '.', 40 * 6);

    const doCount = () => {
        const col = cycles % 40;

        if (col === x || col === x + 1 || col === x -1) {
            screen[cycles] = '#';
        }

        cycles++;
    }

    data.forEach(line => {
        const [cmd, arg] = line;

        doCount();

        if (cmd === 'addx') {
            R.times(x => doCount(), 1);
            x += arg;
        }

    });

    U.log(U.matrixToTile(R.splitEvery(40, screen)));
    
    return 0;
}

