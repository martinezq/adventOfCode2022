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

function run(data) {

    // U.log('Hello');

    var score = 0;

    data.forEach(round => {
        const [opp, my] = round;
        score += calculateTotalScore(opp, my);
    });

    return score;
}

