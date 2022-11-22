const fs = require('fs');
const R = require('ramda');

function runWrapper(parseFunc, mainFunc) {

    const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
    const lines = file.split('\r\n');

    log('------- INPUT RAW --------');
    log(lines);

    const parsed = parseFunc ? parseFunc(lines) : lines;

    log('--------- PARSED ---------');
    log(parsed);

    log('\n---------- RUN -----------');
    const result = mainFunc(parsed);
    log('-------- RUN END ---------\n',);

    log('--------- RESULT ---------');
    log(result);
}

function parse(str, regex, keys) {
    const a = str
        .match(regex)
        .slice(1)
        .map(x => Number(x) || x)

    if (keys) {
        let result = {};
        keys.forEach((k, i) => result[k] = a[i]);
        return result
    }

    return a;
}

function log(...x) {
    console.log(...x.
        map(i => {
            if (Array.isArray(i)) return JSON.stringify(i);
            if (typeof i === 'object') return JSON.stringify(i);
            return i;
        })
    );
}


function logf(...x) {
    console.log(...x
        .map(i => {
            if (Array.isArray(i)) return JSON.stringify(i, null, 2);
            if (typeof i === 'object') return JSON.stringify(i, null, 2);
            return i;
        })
    );
}

function logm(matrix) {
    if (matrix && Array.isArray(matrix)) {
        matrix.forEach(row => console.log(row));
    }

}

function mapMatrix(matrix, f) {
    return matrix.map((row, i) => row.map((v, j) => f(v, i, j)));
}

function filterMatrix(matrix, f) {
    return matrix.flat().filter(f);
}

function createMatrixFromPoints(points, defValue, f) {
    f = f || (() => 1);

    const width = R.last(points.map(x => x[0]).sort((x, y) => x-y)) + 1;
    const height = R.last(points.map(x => x[1]).sort((x, y) => x-y)) + 1;

    const m = R.times(r => {
        let line = Array.from({ length: width }, () => defValue);
        points.filter(x => x[1] === r).forEach(x => line[x[0]] = f(x[0], r))
        return line;
    }, height);

    return m;
}

function matrixToTile(m) {
    let str = '';

    m.forEach(r => {
        const line = r.join('') + '\n';
        str += line;
    });

    return str;
}

const minA = (x) => x.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY);
const maxA = (x) => x.reduce((p, c) => Math.max(p, c), Number.NEGATIVE_INFINITY);
const sortByNumber = R.sortBy(Number);

function splitStringByLength(str, len) {
    let result = [];
    let j = 0;
    let buf = [];

    for (let i=0; i<str.length; i++) {
        buf[j++] = str[i];
        if (j == len) {
            result.push(buf.join(''));
            j = 0;
        }
    }

    return result;
}

/** 
 * Decimal to binary string
 *   @example 
 *      dec2bin(8)     -> '1011'
 *      dec2bin(8, 36) -> '000000000000000000000000000000001011'
**/
function dec2bin(x, length) {
    return (x >>> 0).toString(2).padStart(length, '0');
}

/**  
 * Binary string to decimal
 * @example
 *      bin2dec('1011') -> 8
**/ 
function bin2dec(x) {
    return parseInt(x, 2);
}

module.exports = {
    runWrapper,
    parse,
    log, logf, logm,
    minA, maxA, sortByNumber,
    mapMatrix, filterMatrix,
    createMatrixFromPoints, matrixToTile,
    splitStringByLength,
    dec2bin, bin2dec
}