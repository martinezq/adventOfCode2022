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

    function simulateNode(num, rope) {
        const hp = rope[num - 1];
        const tp = rope[num];

        const dx = hp[0] - tp[0];
        const dy = hp[1] - tp[1];

        if (Math.abs(dx) > 1) {

            tp[0] += U.normalize(dx);

            if (Math.abs(dy) > 0) {
                tp[1] += U.normalize(dy);
            }

        } else if (Math.abs(dy) > 1) {

            tp[1] += U.normalize(dy);

            if (Math.abs(dx) > 0) {
                tp[0] += U.normalize(dx);
            }
        }

    }

    // ----
    
    let rope = R.times(x => [0, 0], 10);
    let visited = {};

    const visit = ([x, y]) => visited[`${x},${y}`] = (visited[`${x},${y}`] || 0) + 1;

    // ----

    visit(R.last(rope));

    data.forEach(move => {
        // U.log(dir, steps);
        const [dir, steps] = move;
        R.times(() => {
            if (dir === 'R') rope[0][0]++;
            if (dir === 'L') rope[0][0]--;
            if (dir === 'D') rope[0][1]++;
            if (dir === 'U') rope[0][1]--;

            R.times(n => simulateNode(n + 1, rope), rope.length - 1);
            
            visit(R.last(rope));
            // U.log(rope);            
        }, steps);

    });

    const result = R.values(visited).length;

    return result;
}

