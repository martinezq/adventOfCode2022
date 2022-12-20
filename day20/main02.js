const R = require('ramda');
const U = require('./utils');

const MULT = 811589153;

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => MULT * Number(x));
}

// --------------------------------------------

function print(head, len) {
    let arr = [];
    let p = head;
    while (len-- > 0) {
        arr.push(p.v);
        p = p.n;
    }

    const arrSum = R.sum(arr);

    U.log(arrSum, arr);
}

// convert array to linked list
function toList(data) {
    let head = { v: data[0], p: null, n: null };
    let p = head;
    for (let i = 1; i < data.length; i++) {
        let v = data[i];
        let n = { v, p, n: null };
        p.n = n;
        p = n;
    }
    p.n = head;
    head.p = p;
    return head;

}

function toArrayOfPointers(head) {
    let arr = [];
    let p = head;
    while (p) {
        arr.push(p);
        p = p.n;
        if (p === head) break;
    }
    return arr;
}

function move(head, n) {
    let p = head;
    let bn = n;

    if (n > 0) {
        while (n > 0) {
            p = p.n;

            if (p === head) {
                // U.log(bn, n);
            }

            n--;
        }
    } else if (n < 0) {
        while (n < 0) {
            p = p.p;

            if (p === head) {
                // U.log(bn, n);
            }

            n++;
        }
    }
    
    return p;
}

// --------------------------------------------

function run(data) {

    let head = toList(data);
    let pointers = toArrayOfPointers(head);

    U.log(data.length, pointers.length);
    print(head, data.length);
    
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < pointers.length; i++) {
            let p = pointers[i];
            let { v } = p;

            if (v === 0) continue;

            if (v < 0) {
                // if (Math.abs(v) % pointers.length === 0) continue;
                v = v % (pointers.length - 1);
            }

            if (v > 0) {
                // if ((v + 2) % pointers.length === 0) continue;
                v = v % (pointers.length - 1);
            }

            let pp = p.p;
            p.p.n = p.n;
            p.n.p = p.p;

            p.n = null;
            p.p = null;

            let x = move(pp, v);

            if (x.n == pp) {
                // U.log(v);
            }

            p.p = x;
            p.n = x.n;
            x.n.p = p;
            x.n = p;

            // while (head.v !== 0) head = head.n;

            // print(head, data.length);
        }
    }
    // --------------------------------------------

    // print(head, data.length);

    let p = head;

    while (p.v !== 0) p = p.n;

    const a = move(p, 1000).v;
    const b = move(p, 2000).v;
    const c = move(p, 3000).v;

    U.log('results', a, b, c);

    return a + b + c;
}

// -924 wrong
// -1549 wrong
