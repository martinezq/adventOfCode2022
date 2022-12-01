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
            const addrBin = U.dec2bin(addr, 36);

            U.log("addr", addr, "value", value, "addrBin", addrBin, "valueBin", valueBin);

            const mappedAddrRange = addrBin.split('').map((x, i) => {
                if (mask[i] == 'X') return 'X';
                if (mask[i] == '0') return x;
                return '1';
            }).join('');

            // U.log("mappedAddrRange", mappedAddrRange);

            const floatingNum = mappedAddrRange.split('').filter(x => x === 'X').length;

            // U.log("floatingNum", floatingNum);

            const range = R.times(x => U.dec2bin(x, floatingNum).split('').map(Number), Math.pow(2, floatingNum));

            // U.log("range", range);

            const floatingPositions = mappedAddrRange.split('').map((x, i) => x === 'X' ? i : undefined).filter(x => x !== undefined);

            // U.log("floatingPositions", floatingPositions);

            range.forEach(r => {
                const realAddr = mappedAddrRange.split('').map((x, i) => {
                    if (x === 'X') {
                        const pos = floatingPositions.findIndex(p => p === i);
                        return r[pos];
                    } else {
                        return x;
                    }
                }).join('');
                
                // U.log('realAddr', realAddr);

                // const realAddrDec = U.bin2dec(realAddr);

                mem[realAddr] = value;
    
            });

        }
    });
    

    // U.log(mem);

    return R.reduce(R.add, 0, R.values(mem));
}

