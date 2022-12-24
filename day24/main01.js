const R = require('ramda');
const U = require('./utils');

let bestDist = Number.POSITIVE_INFINITY;
let bestTime = Number.POSITIVE_INFINITY;
let cache = {};

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(''));
}

// --------------------------------------------

function findBlizzards(data) {
    const blizzards = [];
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            const b = data[y][x];
            if (b === '>') {
                blizzards.push({ x, y, dx: 1, dy: 0 });
            }
            if (b === '<') {
                blizzards.push({ x, y, dx: -1, dy: 0 });
            }
            if (b === '^') {
                blizzards.push({ x, y, dx: 0, dy: -1 });
            }
            if (b === 'v') {
                blizzards.push({ x, y, dx: 0, dy: 1 });
            }

        }
    }
    return blizzards;
}

function printMapWithBlizzards(map, blizzards, pos = [1, 0]) {
    const map2 = R.clone(map);

    blizzards.forEach(b => {
        if (Array.isArray(b)) {
            b = { x: b[0], y: b[1] }; 
        }

        if (map2[b.y][b.x] === '.') {
            map2[b.y][b.x] = 1;
        } else {
            map2[b.y][b.x]++
        };
    });

    map2[pos[1]][pos[0]] = 'E';

    U.log(U.matrixToTile(map2));
}

function cleanMap(map) {
    return map.map(x => x.map(y => y !== '#' ? '.' : '#'));
}

// --------------------------------------------

function generateMapStates(map, blizzards, num = 10) {
    let states = [];

    states.push(blizzards.map(b => [b.x, b.y]));

    for (let i = 0; i < num; i++) {
        // U.log('--- step', i + 1, '---');

        for (let j = 0; j < blizzards.length; j++) {
            const b = blizzards[j];
            b.x += b.dx;
            b.y += b.dy;

            if (map[b.y][b.x] === '#') {
                if (b.x === 0) {
                    b.x = map[0].length - 2;
                }

                if (b.x === map[0].length - 1) {
                    b.x = 1;
                }

                if (b.y === 0) {
                    b.y = map.length - 2;
                }

                if (b.y === map.length - 1) {
                    b.y = 1;
                }

            }


        }
        
        states.push(blizzards.map(b => [b.x, b.y]));

        // printMapWithBlizzards(map, blizzards);
    }

    return states;
}

// --------------------------------------------

function solve(map, states, start, end, time = 0) {

    const key = start.join(',') + '-' + time;

    if (cache[key]) {
        return cache[key];
    }

    const blizzards = states[time];

    if (U.distanceManhattan(start, end) < bestDist) {
        bestDist = U.distanceManhattan(start, end);
        U.log('--- time', time, '---');
        printMapWithBlizzards(map, blizzards, start);
    }
    
    if (start[0] === end[0] && start[1] === end[1]) {
        if (time < bestTime) {
            bestTime = time;
            U.log('bestTime', bestTime);
        }
        return time;
    }

    if (time >= states.length - 2) {
        return Number.POSITIVE_INFINITY;
    }
    
    const remTime = bestTime - time;
    if (U.distanceManhattan(start, end) >= remTime) {
        return Number.POSITIVE_INFINITY;
    }

    const blizzardsNext = states[time + 1];

    const moves = [
        [start[0], start[1]],
        [start[0] + 1, start[1]],
        [start[0] - 1, start[1]],
        [start[0], start[1] + 1],
        [start[0], start[1] - 1],
    ];

    const movesRanked = R.sortBy(m => U.distanceManhattan(m, end), moves);

    const res = movesRanked.map(m => {
        if (m[0] < 0 || m[1] < 0) return;
        if (map[m[1]][m[0]] === '#') return;

        if (blizzardsNext.some(s => s[0] === m[0] && s[1] === m[1])) {
            return;
        }

        return solve(map, states, m, end, time + 1);
    });

    const val = U.minA(R.filter(x => x !== undefined, res));

    cache[key] = val;

    return val;
}

// --------------------------------------------

function run(data) {
    const blizzards = findBlizzards(data);
    const map = cleanMap(data);

    U.log(map[0].length - 2, map.length - 2);

    U.log('--- start ---');
    printMapWithBlizzards(map, blizzards);

    // const num = map.length * map.length * 2;
    const num = 794;
    const states = generateMapStates(map, blizzards, num);

    // U.logf(states);


    const result = solve(map, states, [1, 0], [map[0].length - 2, map.length - 1]);

    return result;
}

// 830 too high
// 793 too high

