const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines;
    return R.splitWhenever(x => R.startsWith('$', x), lines);

    return lines.map(x => {
        if (R.startsWith('$', x)) {
            return {
                cmd: x.split(' ')[1],
                args: x.split(' ')[2]
            }
        } else {
            return {
                output: ''
            }
        }
    });
}

// --------------------------------------------

function calculateDirSize(fs) {
    if (fs._size === undefined) {
        const values = R.values(R.omit(['_parent', '_size', '_type'], fs));
        fs._size = R.reduce((p, c) => p + calculateDirSize(c)._size, 0, values);
    }

    return fs;
}


function flatFs(fs, buf) {
    buf = buf || [];
    const values = R.values(R.omit(['_parent', '_size', '_type'], fs));
    const valuesDir = values.filter(x => x._type === 'dir');

    valuesDir.forEach(x => buf.push(x));

    valuesDir.forEach(x => flatFs(x, buf));

    return buf;
}

function run(data) {

    // U.log('Hello');

    let fs = {};
    let curr = fs;

    data.forEach(line => {
        if (R.startsWith('$ cd', line)) {
            const arg = line.split(' ')[2];
            if (arg === '/') {
                curr = fs;
            } else if (arg === '..') {
                curr = curr._parent;
            } else {
                curr[arg] = curr[arg] || {
                    _parent: curr,
                    _type: 'dir'
                };
                curr = curr[arg];
            }
        } else {
            if (R.startsWith('$ ls', line)) {
                U.log(line);
            } else if (R.startsWith('dir', line)) {
                U.log(line);
            } else {
                const [size, name] = line.split(' ');
                curr[name] = {
                    _size: Number(size),
                    _parent: curr,
                    _type: 'file'
                };
            }
        }
    });

    fs = calculateDirSize(fs);
    
    const fFs = flatFs(fs);

    // U.logf(R.omit('_parent', fs));

    const above = fFs.filter(x => x._size <= 100000).map(x => x._size);

    const result = R.reduce(R.add, 0, above);

    return result;
}

