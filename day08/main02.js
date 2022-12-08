const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split('').map(x => Number(x)));
}

// --------------------------------------------

function takeWhileP(f, a) {
    let res = [];
    let p = undefined
    a.forEach((x, i) => {
        if (f(x, p)) res.push(x);
        p = x;
    });

    U.log('res', res);

    return res;

}

function run(data) {

    const width = data[0].length;
    const height = data.length;
    
    // U.log('Hello');

    let scores = {};

    data.forEach((line, r) => {
        line.forEach((tree, c) => {
            let score1 = 0;
            for (let a = c + 1; a < width; a++) {
                if (line[a] < tree) score1++;
                if (line[a] >= tree) { score1++; break; }
            }

            let score2 = 0;
            for (let a = c - 1; a >= 0; a--) {
                if (line[a] < tree) score2++;
                if (line[a] >= tree) { score2++; break; }
            }

            let score3 = 0;
            for (let b = r + 1; b < height; b++) {
                if (data[b][c] < tree) score3++;
                if (data[b][c] >= tree) { score3++; break; }
            }

            let score4 = 0;
            for (let b = r - 1; b >= 0; b--) {
                if (data[b][c] < tree) score4++;
                if (data[b][c] >= tree) { score4++; break; }
            }

            U.log(score1, score2, score3, score4);
            scores[`${r},${c}`] = score1 * score2 * score3 * score4;
        });
    });

    U.logf(scores);

    // const result = 2 * width + 2 * height - 4;

    const result = U.maxA(R.values(scores));

    return result;
}

