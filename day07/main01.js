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

    function calculateSizes(fs) {
        fs.size = R.reduce((p, c) => p + calculateSizes(c).size, fs.size, fs.dirs);
        return fs;
    }
    
    
    function findAllDirs(fs, buf) {
        buf = buf || [];
        fs.dirs.forEach(x => buf.push(x));
        fs.dirs.forEach(x => findAllDirs(x, buf));
    
        return buf;
    }

    // ------------------------------------------------------------------------

    // U.log('Hello');

    let fs = { name: '/', dirs: [] };
    let curr = fs;
    let stack = [fs];

    data.forEach(cmd => {
        if (cmd.cmd === 'cd') {
            if (cmd.arg === '/') {
                stack = [fs];
                curr = fs
            } else if (cmd.arg === '..') {
                 stack.pop();
                 curr = R.last(stack);
            } else {
                const prev = curr;
                const existing = prev.dirs.find(x => x.name === cmd.arg);

                if (existing) {
                    curr = prev.dirs.find(x => x.name === cmd.arg);
                } else {
                    curr = { name: cmd.arg, dirs: [] };
                    prev.dirs.push(curr);
                }
                
                stack.push(curr);
            }
        } else if (cmd.cmd === 'ls') {
            const size = R.reduce(R.add, 0, cmd.output.filter(x => x.type === 'file').map(x => x.size));
            curr.size = size;
        }

        // U.log('stack', stack);
        // U.log('curr', curr);
    });

    U.logf('fs 1', fs);

    fs = calculateSizes(fs);

    U.logf('fs 2', fs);

    const dirs = findAllDirs(fs);
    const sizes = dirs.map(x => x.size);

    U.logf('dirs', dirs);
    U.logf('sizes', sizes);

    const selectedSizes = sizes.filter(x => x <= 100000);

    const result = R.reduce(R.add, 0, selectedSizes);

    return result;

}

