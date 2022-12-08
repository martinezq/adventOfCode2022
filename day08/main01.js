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

function selectTrees(a) {
    return  R.reduce((acc, c) => {
        if (c.h > acc.max) {
            acc.res.push(c);
            acc.max = c.h;
        }
        return acc;
    }, { res: [], max: -1 }, a).res;
}

// --------------------------------------------

function run(data) {
    
    let trees = {};

    function countTree(t) {
        trees[t.id] = (trees[t.id] || 0) + 1;
    }

    data.forEach(line => {
        selectTrees(line).forEach(countTree);
        selectTrees(R.reverse(line)).forEach(countTree);
    });

    const data2 = R.transpose(data);

    data2.forEach(line => {
        selectTrees(line).forEach(countTree);
        selectTrees(R.reverse(line)).forEach(countTree);
   });

    U.logf(trees);

    return R.keys(trees).length;
}

