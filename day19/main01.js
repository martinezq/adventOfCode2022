const R = require('ramda');
const U = require('./utils');

let cache = new Map();
let bestOre = -1;

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

function move(blueprint, state, totalTime) {
    totalTime = totalTime || state.time;

    if (state.time === 0) {
        return state;
    }

    // if (state.time < 10 && state.robots.obsidian < 2 && state.robots.clay < 2) {
    //     return state;
    // };

    // serialized state
    // const key = `${state.time}-${state.res.ore}-${state.res.clay}-${state.res.obsidian}-${state.res.geode}-${state.robots.ore}-${state.robots.clay}-${state.robots.obsidian}-${state.robots.geode}`;
    const key = 1 * state.time + 100 * state.res.ore + 1000 * state.res.clay + 10000 * state.res.obsidian + 100000 * state.res.geode
            + 1000000 * state.robots.ore + 10000000 * state.robots.clay + 100000000 * state.robots.obsidian + 1000000000 * state.robots.geode;
    const cached = cache.get(key);

    if (cached) {
        return cached;
    }

    let results = [];

    function withRobot(robot) {
        if (canBuildRobot(blueprint, state, robot)) {
            let newState = buildRobot(blueprint, state, robot);
            newState.res[robot]--; // new robot is not working yet
            newState = move(blueprint, step(newState), totalTime);
            
            results.push(newState);

            return true;
        }

        return false;
    }

    results.push(move(blueprint, step(state), totalTime));

    const geode = withRobot('geode');
    const obsidian = withRobot('obsidian');
    const clay = withRobot('clay');
    const ore = withRobot('ore');

    const best = R.reduce(R.maxBy(x => x.res.geode), results[0], results);

    cache.set(key, best);

    if (best.res.geode > bestOre) {
        bestOre = best.res.geode;
        U.log('best', best)
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

function simulateBlueprint(blueprint) {
    cache.clear();
    bestOre = 0;
    
    return move(blueprint, initState(24));
}

function run(data) {

    let result = 0;

    R.drop(0, data).forEach((blueprint, i) => {
        U.log('blueprint', i + 1)
        const x = simulateBlueprint(blueprint);

        result += x.res.geode * (i + 1);
    });

    return result;
}


