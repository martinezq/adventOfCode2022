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

    let ctx = {};

    const ready = (m1, m2, ctx) => ctx[m1] !== undefined && ctx[m2] !== undefined; 

    const process = U.processUsingRules({
        '(.*): (\-?[0-9]+)':    ([m, arg], ctx) => ctx[m] = Number(arg),
        '(.*): (.*) \\+ (.*)':  ([m, arg1, arg2], ctx) => ready(arg1, arg2, ctx) && (ctx[m] = ctx[arg1] + ctx[arg2]),
        '(.*): (.*) \\- (.*)':  ([m, arg1, arg2], ctx) => ready(arg1, arg2, ctx) && (ctx[m] = ctx[arg1] - ctx[arg2]),
        '(.*): (.*) \\* (.*)':  ([m, arg1, arg2], ctx) => ready(arg1, arg2, ctx) && (ctx[m] = ctx[arg1] * ctx[arg2]),
        '(.*): (.*) \\/ (.*)':  ([m, arg1, arg2], ctx) => ready(arg1, arg2, ctx) && (ctx[m] = Math.floor(ctx[arg1] / ctx[arg2])),
    }, ctx);

    while (!ctx.root) {
        data.forEach(process);
        U.log(ctx);
        // ctx.root = -1;
    }
    
    const result = ctx.root;

    return result;
}

