const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map((x, r) => x.split('').map((x, c) => ({ id: `${r},${c}`, h: Number(x)})));
}

// --------------------------------------------

function selectTrees(a, tree) {
    return  R.reduce((acc, c) => {
        if (acc.stop) return acc;
        if (c.h < acc.max) {
            acc.res.push(c);
        } else {
            acc.res.push(c);
            acc.stop = true;
        }
        return acc;
    }, { res: [], max: tree.h, stop: false }, a).res;
}

// --------------------------------------------

function run(data) {

    let scores = {};

    function countTree(t, score) {
        scores[t.id] = (scores[t.id] || [])
        scores[t.id].push(score);
    }

    data.forEach((line, r) => {
        line.forEach((tree, c) => {
            countTree(tree, selectTrees(R.drop(c + 1, line), tree).length);
            countTree(tree, selectTrees(R.reverse(R.take(c, line)), tree).length);
        })
    });

    R.transpose(data).forEach((line, r) => {
        line.forEach((tree, c) => {
            countTree(tree, selectTrees(R.drop(c + 1, line), tree).length);
            countTree(tree, selectTrees(R.reverse(R.take(c, line)), tree).length);
        })
    });

    U.logf(scores);

    const result = R.values(scores).map(x => R.reduce(R.multiply, 1, x));

    return U.maxA(result);

}