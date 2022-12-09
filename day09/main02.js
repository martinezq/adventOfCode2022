const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => {
        const parts = x.split(' ');
        return [parts[0], Number(parts[1])];
    });
}

// --------------------------------------------

function run(data) {

    let visited = {};
    let hp = [0, 0];
    let tp = [0, 0];
    let rope = R.times(x => [0, 0], 10);

    const visit = ([x, y]) => visited[`${x},${y}`] = (visited[`${x},${y}`] || 0) + 1;
    const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
    const norm = (a) => a > 0 ? 1 : (a < 0 ? -1 : 0);
    
    function simulateNode(num) {
        const hp = rope[num - 1];
        const tp = rope[num];

        const dx = hp[0] - tp[0];
        const dy = hp[1] - tp[1];

        if (Math.abs(dx) > 1) {
            tp[0] += norm(dx);
            if (Math.abs(dy) > 0) {
                tp[1] += norm(dy);
            }
        } else if (Math.abs(dy) > 1) {
            tp[1] += norm(dy);
            if (Math.abs(dx) > 0) {
                tp[0] += norm(dx);
            }            
        }

    }

    // ----

    visit(rope[9]);

    data.forEach(move => {
        // U.log(dir, steps);
        const [dir, steps] = move;
        R.times(() => {
            if (dir === 'R') rope[0][0]++;
            if (dir === 'L') rope[0][0]--;
            if (dir === 'D') rope[0][1]++;
            if (dir === 'U') rope[0][1]--;

            for (let n = 1; n < 10; n++) {
                const prev = rope[n].concat([]);
                simulateNode(n);
                if (eq(prev, rope[n])) {
                    break;
                }
            }
            visit(rope[9]);
            U.log(rope);            
        }, steps);

    });

    const result = R.values(visited).length;

    return result;
}

