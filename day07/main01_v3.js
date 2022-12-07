const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines;
}    

// --------------------------------------------

function run(data) {
    
    let ctx = {
        sizes: {},
        stack: []
    }

    // ------------------------------------------------------------------------

    const rules = {
        '\\$ cd \\/':     (_, ctx) => ctx.stack = [],
        '\\$ cd \\.\\.':  (_, ctx) => ctx.stack.pop(),
        '\\$ cd (.*)':    ([arg], ctx) => ctx.stack.push(arg),
        '\\$ (ls)':       (_) => {},
        'dir (.*)':       ([name]) => {},
        '([0-9]+) (.*)':  ([size, name], ctx) => {
            ctx.stack.forEach((p, i) => {
                const key = R.take(i + 1, ctx.stack).join('/');
                ctx.sizes[key] = (ctx.sizes[key] || 0) + Number(size);
            })
        },
    };

    const process = U.processUsingRules(rules, ctx);

    // ------------------------------------------------------------------------

    data.forEach(line => process(line));

    // ------------------------------------------------------------------------

    U.logf('sizes', ctx.sizes);

    const selectedSizes = R.filter(R.lt(R.__, 100000), R.values(ctx.sizes));

    const result = U.sumA(selectedSizes);

    return result;
}

