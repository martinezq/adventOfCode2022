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
            tunnels: R.sortBy(x => -res[x].flow, v.tunnels)
        }
    }, res);

    return res2;

}


// --------------------------------------------

function isStupidMove(moves) {
    // if (moves.length > 2 && moves[moves.length - 1] === moves[moves.length - 3] && moves[moves.length - 1] !== '__') return true;
    // if (moves.length > 4 && moves[moves.length - 1] === moves[moves.length - 5] && moves[moves.length - 1] !== '__') return true;

    // return false;

    if (moves.length < 3 || moves[moves.length - 1] === '__') return false;

    for (let i = moves.length - 2 ; i >= 0; i--) {
        if (moves[i] === '__') return false;
        if (moves[i] === moves[moves.length - 1]) return true;
    }
    
    return false;
}

// --------------------------------------------

function run(data) {

    // --------------------------------------------

    function search(v1, v2, timeLeft, maxDeep, currentFlow, pressureReleased, openedValves, moves1, moves2) {
        let stop = false;

        // best: 2153, 2228, 2350, 2430, 2442, 2474, 2500, 2536

        if (timeLeft < 20 && pressureReleased < 100) {
            stop = true;
        }

        if (timeLeft < 15 && pressureReleased < 450) {
            stop = true;
        }

        if (timeLeft < 10 && pressureReleased < 930) {
            stop = true;
        }

        if (timeLeft < 5 && pressureReleased < 1650) {
            stop = true;
        }

        if (timeLeft < 3 && pressureReleased < 2000) {
            stop = true;
        }


        currentFlow = currentFlow || 0;
        pressureReleased = pressureReleased || 0;
        openedValves = openedValves || {};
        moves1 = moves1 || [];
        moves2 = moves2 || [];
    
        pressureReleased += currentFlow;
    
        let x = pressureReleased + (timeLeft - 1) * currentFlow;

        if (isStupidMove(moves1) || isStupidMove(moves2) || R.keys(openedValves).length === R.keys(data).length) {
            pressureReleased += (timeLeft - 1) * currentFlow;
            stop = true;
        };

        if (bestResult < x) {
            bestResult = x;
            U.log('bestResult',timeLeft, bestResult, moves1, moves2);
        }
    
        // U.log(R.repeat(' ', 26 - timeLeft).join(''), 'search', v1, v2, timeLeft, currentFlow, pressureReleased, openedValves);
    
        if (timeLeft === 1) {
            stop = true;
        };
    
        if (stop) {
            return;
        }
    
        
        
        function generateNextMoves() {
            let move1 = true;
            let move2 = true;

            if (!openedValves[v1]) {
                move1 = false;
            }        
            
            if (!openedValves[v2] && v1 !== v2) {
                move2 = false;
            }

            if (!move1 && !move2) {
                const openedValves2 = R.clone(openedValves);
                openedValves2[v1] = true;
                openedValves2[v2] = true;

                search(v1, v2, timeLeft - 1, maxDeep, currentFlow + data[v1].flow + data[v2].flow, pressureReleased, openedValves2, moves1.concat(['__']), moves2.concat(['__']));
            }            

            if (move1 && !move2) {
                const openedValves2 = R.clone(openedValves);
                openedValves2[v2] = true;

                data[v1].tunnels.map(t => {
                    search(t, v2, timeLeft - 1, maxDeep, currentFlow + data[v2].flow, pressureReleased, openedValves2, moves1.concat([t]), moves2.concat(['__']));
                });
            }

            if (!move1 && move2) {
                const openedValves2 = R.clone(openedValves);
                openedValves2[v1] = true;

                data[v2].tunnels.map(t => {
                    search(v1, t, timeLeft - 1, maxDeep, currentFlow + data[v1].flow, pressureReleased, openedValves2, moves1.concat(['__']), moves2.concat([t]));
                });
            }
        

            data[v1].tunnels.map(t1 => {
                data[v2].tunnels.map(t2 => {
                    search(t1, t2, timeLeft - 1, maxDeep, currentFlow, pressureReleased, openedValves, moves1.concat([t1]), moves2.concat([t2]));
                });
            });

            // tunnels.map(t => {
            //     search(t, v2, timeLeft - 1, currentFlow, pressureReleased, openedValves);
            // });
        
        }

        generateNextMoves();
        // generateNextMoves(1);
        
    }

    // --------------------------------------------

    let openedValves = {};
    R.keys(data).filter(x => data[x].flow === 0).forEach(x => openedValves[x] = true);

    U.log('valves', R.keys(openedValves).length);

    const result = search('AA', 'AA', 26, 100, 0, 0, openedValves); // 7: 126, 7: 184?

    return result;
}

