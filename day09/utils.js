const fs = require('fs');
const R = require('ramda');

function runWrapper(parseFunc, mainFunc, opts) {

    opts = opts || {
        hideRaw: false,
        hideParsed: false
    }

    const file = fs.readFileSync(`${__dirname}/input.txt`).toString();
    const lines = file.split('\r\n');

    log('------- INPUT RAW --------');
    if (!opts.hideRaw === true) {
        logf(lines);
    } else {
        log('<hidden>');
    }

    const parsed = parseFunc ? parseFunc(lines) : lines;

    log('--------- PARSED ---------');
    if (!opts.hideParsed === true) {
        logf(parsed);
    } else {
        log('<hidden>');
    }

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

/**
 * Log without formatting
 * @param  {...any} x 
 */
function log(...x) {
    console.log(...x.
        map(i => {
            if (Array.isArray(i)) return JSON.stringify(i);
            if (typeof i === 'object') return JSON.stringify(i);
            return i;
        })
    );
}

/**
 * Log using JSON formatting
 * @param  {...any} x
 */
function logf(...x) {
    const isSimpleType = (x) => !Array.isArray(x) && typeof x !== 'object';

    const replacer = (key, value) => {
        if (Array.isArray(value) && !Boolean(value.find(x => !isSimpleType(x)))) {
            return 'Array: [' + value.toString() + ']';
        } else {
            return value;
        }
    };

    console.log(...x
        .map(i => {
            if (isSimpleType(i)) return i;
            return JSON.stringify(i, replacer, 2);
        })
    );
}

/**
 * Log a matrix
 * @param {*} matrix 
 */
function logm(matrix) {
    if (matrix && Array.isArray(matrix)) {
        matrix.forEach(row => console.log(row));
    }

}

/**
 * Map all elements of 2D matrix
 * @param {*} matrix 
 * @param {*} func
 * @returns 
 */
function mapMatrix(matrix, func) {
    return matrix.map((row, i) => row.map((v, j) => func(v, i, j)));
}

/**
 * Flatten matrix and filter using function
 * @param {*} matrix 
 * @param {*} func 
 * @returns 
 */
function filterMatrix(matrix, func) {
    return matrix.flat().filter(func);
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

/**
 * Convert matrix to a tile string
 * @param {*} matrix 
 * @returns 
 */
function matrixToTile(matrix) {
    let str = '';

    matrix.forEach(r => {
        const line = r.join('') + '\n';
        str += line;
    });

    return str;
}

const minA = (x) => x.reduce((p, c) => Math.min(p, c), Number.POSITIVE_INFINITY);
const maxA = (x) => x.reduce((p, c) => Math.max(p, c), Number.NEGATIVE_INFINITY);
const sumA = (x) => R.reduce(R.add, 0, x);

const normalize = (x) => x > 0 ? 1 : (x < 0 ? -1 : 0);

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

/*

*/

/**
 * Process input
 * @param {*} rules [object]
 * @param {*} context [object]
 * @param {*} input [string]
 * 
 * @example
 * ```
 *  const rules = {
 *   '\\$ (cd) (.*)':    ([cmd, arg], context) => console.log('CMD', cmd, arg),
 *   '\\$ (ls)':         ([cmd], context) => console.log('CMD', cmd),
 *   '([0-9]+) (.*)':    ([size, name], context) => console.log('FILE', size, name),
 *   'dir (.*)':         ([name], context) => console.log('DIR', name)
 * }
 * ```
 */
function processUsingRulesInternal(rules, context, input) {
    let done = false;
    R.keys(rules).forEach(key => {
        if (done) return; // ignore

        const re = RegExp(key);
        const parsed = input.match(re);
        
        if (parsed) {
            const res = rules[key](R.tail(parsed), context);
            done = true;
            return res;
        } 
    });

    if (!done) {
        log(' ---> WARNING: No rule found to match: ' + input + ' <---');
    }
}

const processUsingRules = R.curry(processUsingRulesInternal);

module.exports = {
    runWrapper,
    parse,
    log, logf, logm,
    minA, maxA, sortByNumber,
    sumA,
    normalize,
    mapMatrix, filterMatrix,
    createMatrixFromPoints, matrixToTile,
    splitStringByLength,
    dec2bin, bin2dec,
    processUsingRules
}