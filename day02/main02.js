const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(' '));
}

// --------------------------------------------

// A,X - rock
// B,Y - Paper
// C,Z - Scissors

function calculateResultScore(opp, my) {
    if (opp === 'A' && my === 'X') return 3;
    if (opp === 'B' && my === 'Y') return 3;
    if (opp === 'C' && my === 'Z') return 3;

    if (opp === 'A' && my === 'Y') return 6;
    if (opp === 'A' && my === 'Z') return 0;

    if (opp === 'B' && my === 'X') return 0;
    if (opp === 'B' && my === 'Z') return 6;

    if (opp === 'C' && my === 'X') return 6;
    if (opp === 'C' && my === 'Y') return 0;
}

function calculateTotalScore(opp, my) {
    let score = calculateResultScore(opp, my);

    if (my == 'X') return score + 1;
    if (my == 'Y') return score + 2;
    if (my == 'Z') return score + 3;
}

// X- lose, Y - draw, Z - loose
function decideMyMove(opp, result) {
    if (opp === 'A') {
        if (result === 'X') return 'Z';
        if (result === 'Y') return 'X';
        if (result === 'Z') return 'Y';
    }

    if (opp === 'B') {
        if (result === 'X') return 'X';
        if (result === 'Y') return 'Y';
        if (result === 'Z') return 'Z';
    }

    if (opp === 'C') {
        if (result === 'X') return 'Y';
        if (result === 'Y') return 'Z';
        if (result === 'Z') return 'X';
    }

}

function run(data) {

    // U.log('Hello');

    var score = 0;

    data.forEach(round => {
        const [opp, result] = round;
        
        const myMove = decideMyMove(opp, result);
        score += calculateTotalScore(opp, myMove);
    });

    return score;
}

