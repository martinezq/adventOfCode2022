const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const index = lines.findIndex(R.startsWith('root:'))
    lines[index] = lines[index].replace('+', '=');
    return lines;
}

// --------------------------------------------

function solve(root, val) {
    const { op, name, arg1, arg2 } = root;
    
    if (name === 'humn') return 'x';

    if (op === 'const') {
        return arg1;
    }
    if (op === '=') {
        return `${solve(arg1, val)} = ${solve(arg2, val)}`;
    }
    
    const b1 = solve(arg1, val);
    const b2 = solve(arg2, val);

    if (Number.isInteger(b1) && Number.isInteger(b2)) {
        const expr = `${b1} ${op} ${b2}`
        return eval(expr);
    } else {
        return `(${b1} ${op} ${b2})`;
    }

}

function run(data) {

    let ctx = {};

    const handle = (op, m, arg1, arg2, ctx) => {
        ctx[arg1] = ctx[arg1] || {};
        if (arg2) ctx[arg2] = ctx[arg2] || {};
        ctx[m] = ctx[m] || {};

        ctx[m].op = op;
        ctx[m].name = m;
        ctx[m].arg1 = op === 'const' ? arg1 : ctx[arg1];
        if (arg2) ctx[m].arg2 = ctx[arg2];
    }

    const process = U.processUsingRules({
        '(.*): (\-?[0-9]+)':    ([m, arg], ctx) => handle('const', m, Number(arg), null, ctx),
        '(.*): (.*) \\= (.*)':  ([m, arg1, arg2], ctx) => handle('=', m, arg1, arg2, ctx),
        '(.*): (.*) \\+ (.*)':  ([m, arg1, arg2], ctx) => handle('+', m, arg1, arg2, ctx),
        '(.*): (.*) \\- (.*)':  ([m, arg1, arg2], ctx) => handle('-', m, arg1, arg2, ctx),
        '(.*): (.*) \\* (.*)':  ([m, arg1, arg2], ctx) => handle('*', m, arg1, arg2, ctx),
        '(.*): (.*) \\/ (.*)':  ([m, arg1, arg2], ctx) => handle('/', m, arg1, arg2, ctx),
    }, ctx);

    // U.log(ctx);

    while (R.keys(ctx).length < data.length) {
        data.forEach(process);
        // U.log(ctx);
    }
    
    const result = solve(ctx.root, 150);

    return result;
}

