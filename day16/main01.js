const R = require('ramda');
const U = require('./utils');

let bestResult = 0;
let cache = {};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const a = lines
        .map(x => x.match(/Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.*)/))
        .map(x => ({
            valve: x[1],
            flow: Number(x[2]),
            tunnels: x[3].split(', ')
        }));

    let res = {};

    a.forEach(x => {
        res[x.valve] = x;
    });

    const res2 = R.mapObjIndexed((v, k) => {
        return {
            ...v,
            // tunnels: R.sortBy(x => -res[x].flow, v.tunnels)
        }
    }, res);

    return res2;

}

// --------------------------------------------
/*
30: 0, 0
29: 0, 0
28: 20, 0
*/

function search(data, valvesToOpen, valve, timeLeft, currentFlow, pressureReleased, openedValves, moves, pressures) {
    let stop = false;

    currentFlow = currentFlow || 0;
    pressureReleased = pressureReleased || 0;
    openedValves = openedValves || {};
    moves = moves || [];
    pressures = pressures || [];

    pressureReleased += currentFlow;
    pressures = pressures.concat(currentFlow);

    if (moves.length > 2 && moves[moves.length - 1] === moves[moves.length - 3] && moves[moves.length - 1] !== '__') {
        pressureReleased += (timeLeft - 1) * currentFlow;
        stop = true;
    }

    // if (R.keys(openedValves).length === valvesToOpen) {
    //     pressureReleased += (timeLeft - 1) * currentFlow;
    //     stop = true;
    // }

    if (bestResult < pressureReleased) {
        bestResult = pressureReleased;
        U.log('bestResult',timeLeft, bestResult, moves.join(' '), pressures.join(' '));
    }

    // U.log(R.repeat(' ', 30 - timeLeft).join(''), 'search', valve, timeLeft, currentFlow, pressureReleased, openedValves, moves.join(''));

    if (timeLeft === 1) {
        stop = true;
    };

    // const key = `${valve}-${timeLeft}-${currentFlow}-${pressureReleased}-${R.sort(R.identity, R.keys(openedValves))}`;
    // const key = `${valve}-${timeLeft}-${currentFlow}-${pressureReleased}-${R.keys(openedValves)}`;
    // const key = `${valve}-${timeLeft}-${currentFlow}-${pressureReleased}`;
    // if (cache[key]) {
        // return cache[key];
    // }

    // cache[key] = pressureReleased;

    if (stop) {
        return;
    }

    const { tunnels, flow } = data[valve];

        // const stunnels = R.sortBy(x => openedValves[x] ? 1 : 0, tunnels);


    if (!openedValves[valve] && flow > 0) {
        const openedValves2 = R.set(R.lensProp(valve), true, openedValves);
        const nextFlow = currentFlow + flow;

        search(data, valvesToOpen, valve, timeLeft - 1, nextFlow, pressureReleased, openedValves2, moves.concat(['__']), pressures);
    }

    tunnels.map(t => {
        search(data, valvesToOpen, t, timeLeft - 1, currentFlow, pressureReleased, openedValves, moves.concat([t]), pressures);
    });

    
}

// --------------------------------------------

function run(data) {

    // U.log('Hello');
    const valvesToOpen = R.values(data).filter(x => x.flow > 0).length;

    U.log('valvesToOpen', valvesToOpen);

    const result = search(data, valvesToOpen, 'AA', 30);

    // bestResult 1 928  DD __ CC BB __ AA II JJ __ II AA DD EE FF GG HH __ GG FF EE    0 0 20 20 20 33 33 33 33 54 54 54 54 54 54 54 54 76 76 76 76
    // bestResult 1 1006 DD __ CC BB __ AA II JJ __ II AA DD EE __ FF GG HH __ GG FF EE 0 0 20 20 20 33 33 33 33 54 54 54 54 54 57 57 57 57 79 79 79 79

    return result;
}

