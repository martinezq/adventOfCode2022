const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run);

// --------------------------------------------

function parse(lines) {
    return lines;
}

function run(data) {

    let mem = {};
    let mask = 0;

    data.forEach(cmd => {
        if (R.startsWith("mask", cmd)) {
            mask = cmd.split(' = ')[1];
            U.log('mask = ', mask);
        }

        if (R.startsWith("mem", cmd)) {
            const x = cmd.split(/mem\[([0-9]+)\] = ([0-9]+)/g);
            const addr = Number(x[1]);
            const value = Number(x[2]);
            const valueBin = U.dec2bin(value, 36);

            U.log("addr", addr, "value", value, "valueBin", valueBin);

            const mappedValue = valueBin.split('').map((x, i) => {
                if (mask[i] == 'X') return x;
                return mask[i];
            }).join('');

            U.log("mappedValue", mappedValue);

            mem[addr] = U.bin2dec(mappedValue);
        }
    });
    

    U.log(mem);

    return R.reduce(R.add, 0, R.values(mem));
}

