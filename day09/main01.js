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

    const visit = ([x, y]) => visited[`${x},${y}`] = (visited[`${x},${y}`] || 0) + 1;
    const eq = (a, b) => a[0] === b[a] && a[1] === b[1];
    const norm = (a) => a > 0 ? 1 : (a < 0 ? -1 : 0);
    
    // ----

    visit(tp);

    data.forEach(([dir, steps]) => {
        // U.log(dir, steps);
        R.times(() => {
            if (dir === 'R') {
                hp[0]++;
                if (Math.abs(hp[0] - tp[0]) > 1) {
                    tp[0]++;
                    const d = tp[1] - hp[1];
                    tp[1] -= norm(d);
                }
            }
            if (dir === 'L') {
                hp[0]--;
                if (Math.abs(hp[0] - tp[0]) > 1) {
                    tp[0]--;
                    const d = tp[1] - hp[1];
                    tp[1] -= norm(d);
                }
            }
            if (dir === 'D') {
                hp[1]++;
                if (Math.abs(hp[1] - tp[1]) > 1) {
                    tp[1]++;
                    const d = tp[0] - hp[0];
                    tp[0] -= norm(d);
                }
            }
            if (dir === 'U') {
                hp[1]--;
                if (Math.abs(hp[1] - tp[1]) > 1) {
                    tp[1]--;
                    const d = tp[0] - hp[0];
                    tp[0] -= norm(d);
                }
            }

            visit(tp);
            U.log(hp, tp);            
        }, steps);

    });

    const result = R.values(visited).length;

    return result;
}

