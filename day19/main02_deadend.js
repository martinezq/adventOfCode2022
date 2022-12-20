const R = require('ramda');
const U = require('./utils');

let cache = new Set();
let globalBest = -1;

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines
        .map(x => x.split(': ')[1])
        .map(x => x.split('. '))
        .map(b => b.map(x => {
            const v1 = x.match(/Each ([a-z]*) robot costs (\d+) ([a-z]*) and (\d+) ([a-z]*)\.?/);
            
            if (v1) {
                return {
                    robot: v1[1],
                    ore: 0,
                    clay: 0,
                    obsidian: 0,
                    [v1[3]]: parseInt(v1[2]),
                    [v1[5]]: parseInt(v1[4]),
                }
            }
            
            const v2 = x.match(/Each ([a-z]*) robot costs (\d+) ([a-z]*)\.?/);

            if (v2) {
                return {
                    robot: v2[1],
                    ore: 0,
                    clay: 0,
                    obsidian: 0,
                    [v2[3]]: parseInt(v2[2]),
                }
            }
        }))
        .map(b => {
            let res = {};

            b.forEach(x => {
                res[x.robot] = {
                    ore: x.ore,
                    clay: x.clay,
                    obsidian: x.obsidian,
                    geode: x.geode
                }
            });

            return res;
        });
}

// --------------------------------------------

function step(state) {
    const { time, res, robots } = state;

    return {
        time: time - 1,
        res: {
            ore: res.ore + robots.ore,
            clay: res.clay + robots.clay,
            obsidian: res.obsidian + robots.obsidian,
            geode: res.geode + robots.geode
        },
        robots
    }
}

function canBuildRobot(blueprint, state, robot) {
    const { res } = state;
    const { ore, clay, obsidian } = blueprint[robot];

    return res.ore >= ore && res.clay >= clay && res.obsidian >= obsidian;
}

function buildRobot(blueprint, state, robot) {
    return {
        ...state,
        res: {
            ...state.res,
            ore: state.res.ore - blueprint[robot].ore,
            clay: state.res.clay - blueprint[robot].clay,
            obsidian: state.res.obsidian - blueprint[robot].obsidian
        },
        robots: {
            ...state.robots,
            [robot]: state.robots[robot] + 1
        }
    }
}

function move(blueprint, state, moves) {

    moves = moves || [];
    moves = moves.concat([state]);

    if (state.time === 0) {
        return { state, moves };
    }

    // const key = `${state.time}-${state.res.ore}-${state.res.clay}-${state.res.obsidian}-${state.res.geode}-${state.robots.ore}-${state.robots.clay}-${state.robots.obsidian}-${state.robots.geode}`;
    // const key =
    //     state.time + 
    //     100 * state.res.ore + 
    //     10000 * state.res.clay + 
    //     1000000 * state.res.obsidian + 
    //     100000000 * state.res.geode + 
    //     1000000000 * state.robots.ore + 
    //     10000000000 * state.robots.clay + 
    //     100000000000 * state.robots.obsidian + 
    //     1000000000000 * state.robots.geode;

    // const cached = cache[key];

    // if (cached) {
    //     return cached;
    // }

    let results = [];

    function withRobot(robot) {
        if (canBuildRobot(blueprint, state, robot)) {
            let newState = buildRobot(blueprint, state, robot);
            newState.res[robot]--; // new robot is not working yet
            results.push(move(blueprint, step(newState), moves));

            return true;
        }

        return false;
    }

    withRobot('obsidian');
    withRobot('geode');
    withRobot('clay');
    withRobot('ore');

    if (state.res.ore < 50 && state.res.clay < 50 && state.res.obsidian < 20 || results.length === 0) {
        results.push(move(blueprint, step(state), moves));
    }

    const rank = R.maxBy(x => 
        10 * x.state.res.geode +
        5 * x.state.res.obsidian +
        state.time * x.state.robots.geode + 
        state.time * x.state.robots.obsidian 
    );
    
    const best = R.reduce(rank, results[0], results);
    const bestValue = best.state.res.geode;
    
    // cache[key] = best;

    if (bestValue > globalBest) {
        globalBest = bestValue;
        U.log('globalBest', best.state);
    };

    return best;
}

// --------------------------------------------

function initState(time) {
    return {
        time: time || 24,
        res: {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: 0
        },
        robots: {
            ore: 1,
            clay: 0,
            obsidian: 0,
            geode: 0
        }
    }
}

// 5184 :(
// 11520 :(
// 13775 :(

function simulateBlueprint(blueprint) {
    globalBest = -1;

    let timeStep = 24;
    let timeBack = 8;
    let timeMax = 32;
    let timeElapsed = 0;

    let lastState = initState(timeStep);
    
    let res;
    
    while(true) {
        cache = {};

        res = move(blueprint, lastState);
        timeElapsed += lastState.time;

        timeStep = Math.max(timeBack + 1, timeStep);

        // U.log('timeElapsed', timeElapsed);

        if (timeElapsed >= timeMax) break;

        lastState = R.nth(-timeBack - 1, res.moves);
        timeElapsed -= timeBack;
        
        if (timeElapsed + timeStep <= timeMax) {
            lastState.time = timeStep;
        } else {
            lastState.time = timeMax - timeElapsed;
        }


    }

    
    return res.state;
}

function run(data) {

    let result = 1;

    R.take(3, data).forEach((blueprint, i) => {
        U.log('blueprint', i + 1)
        const x = simulateBlueprint(blueprint).res.geode;

        result *= x;
    });

    return result;
}


