const R = require('ramda');
const U = require('./utils');

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

function initState(time) {
    // [time, ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots]
    return [time, 0, 0, 0, 0, 1, 0, 0, 0];
}

// --------------------------------------------


function simulateBlueprint(blueprint) {
    const costs = {
        'ore': [blueprint.ore.ore, blueprint.ore.clay, blueprint.ore.obsidian],
        'clay': [blueprint.clay.ore, blueprint.clay.clay, blueprint.clay.obsidian],
        'obsidian': [blueprint.obsidian.ore, blueprint.obsidian.clay, blueprint.obsidian.obsidian],
        'geode': [blueprint.geode.ore, blueprint.geode.clay, blueprint.geode.obsidian]
    };

    let bestValue = -1;
    let seen = {};
    
    let head = {
        s: initState(32)
    };

    let tail = head;

    const add = s => {
        tail.n = { s }; 
        tail = tail.n;
    }
    
    while (head) {
        let state = head.s;

        const [time, ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots] = state;

        if (geode > bestValue) {
            bestValue = geode;
            U.log('bestValue', state);
        }

        if (time === 0) {
            head = head.n;
            continue;
        }


        const maxReqOre = Math.max(costs.ore.ore, costs.clay.ore, costs.obsidian.ore, costs.geode.ore);

        if (oreRobots > maxReqOre) oreRobots = maxReqOre;
        if (clayRobots > costs.obsidian.clay) clayRobots = costs.obsidian.clay;
        if (obsidianRobots > costs.geode.obsidian) obsidianRobots = costs.geode.obsidian;
        if (ore > time * maxReqOre - oreRobots * (time - 1)) ore = time * maxReqOre - oreRobots * (time - 1);
        if (clay > time * costs.obsidian.clay - clayRobots * (time - 1)) clay = time * costs.obsidian.clay - clayRobots * (time - 1);
        if (obsidian > time * costs.geode.obsidian - obsidianRobots * (time - 1)) obsidian = time * costs.geode.obsidian - obsidianRobots * (time - 1);

        const state2 = [time, ore, clay, obsidian, geode, oreRobots, clayRobots, obsidianRobots, geodeRobots];

        // U.log('state2', state2);

        const key =
            state2[0] +
            10 * state2[1] +
            100 * state2[2] +
            1000 * state2[3] +
            10000 * state2[4] +
            100000 * state2[5] +
            1000000 * state2[6] +
            10000000 * state2[7] +
            100000000 * state2[8];
            
        
        if (seen[key]) {
            head = head.n;
            continue;
        }

        seen[key] = true;

        // U.log(state);


        add([time - 1, ore + oreRobots, clay + clayRobots, obsidian + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots]);
        
        if (ore >= costs.ore[0]) {
            add([time - 1, ore - costs.ore[0] + oreRobots, clay - costs.ore[1] + clayRobots, obsidian - costs.ore[2] + obsidianRobots, geode + geodeRobots, oreRobots + 1, clayRobots, obsidianRobots, geodeRobots]);
        }

        if (ore >= costs.clay[0]) {
            add([time - 1, ore - costs.clay[0] + oreRobots, clay - costs.clay[1] + clayRobots, obsidian - costs.clay[2] + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots + 1, obsidianRobots, geodeRobots])
        }

        if (ore >= costs.obsidian[0] && clay >= costs.obsidian[1]) {
            add([time - 1, ore - costs.obsidian[0] + oreRobots, clay - costs.obsidian[1] + clayRobots, obsidian - costs.obsidian[2] + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots + 1, geodeRobots])
        }

        if (clay >= costs.geode[1] && obsidian >= costs.geode[2]) {
            add([time - 1, ore - costs.geode[0] + oreRobots, clay - costs.geode[1] + clayRobots, obsidian - costs.geode[2] + obsidianRobots, geode + geodeRobots, oreRobots, clayRobots, obsidianRobots, geodeRobots + 1]);
        }

        head = head.n;

    }

    return bestValue;
}

function run(data) {

    let result = 1;

    R.take(3, data).forEach((blueprint, i) => {
        U.log('blueprint', i + 1)
        const x = simulateBlueprint(blueprint);

        result *= x;
    });

    return result;
}


