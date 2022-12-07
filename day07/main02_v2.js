const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    const step1 = R.flatten(lines.map(x => R.startsWith('$', x) ? ['$', R.tail(x.split(' ')).join(' ')] : x));

    U.log('step 1', step1);

    const step2 = R.splitWhenever(R.startsWith('$'), step1);
    
    U.log('step 2', step2);

    return step2.map(c => {
        if (c.length === 1) {
            const [cmd, arg] = c[0].split(' ');
            return {
                cmd,
                arg,
                output: []
            } 
        } else {
            return {
                cmd: R.head(c),
                output: R.tail(c).map(x => x.split(' ')).map(x => ({
                    name: x[1],
                    type: x[0] === 'dir' ? 'dir' : 'file',
                    size: x[0] === 'dir' ? undefined : Number(x[0])
                }))
            }
        }
    }); 
}    

// --------------------------------------------

function run(data) {

    let sizes = {};
    let stack = ['/'];

    data.forEach(cmd => {
        if (cmd.cmd === 'cd') {
            if (cmd.arg === '/') {
                stack = ['/'];
            } else if (cmd.arg === '..') {
                stack.pop();
            } else {
                stack.push(cmd.arg);
            }
        } else if (cmd.cmd === 'ls') {
            const size = R.reduce(R.add, 0, cmd.output.filter(x => x.type === 'file').map(x => x.size));
            stack.forEach((p, i) => {
                const key = R.take(i + 1, stack).join('/');
                sizes[key] = (sizes[key] || 0) + size;
            })
        }
    });

    U.logf('sizes', sizes);

    const total = sizes['/'];

    const sortedSizes = R.sortBy(R.identity, R.values(sizes));

    const result = sortedSizes.find(x => total - x < 40000000);

    return result;
}

