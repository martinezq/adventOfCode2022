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
function calculateTotalScore(opp, my) {
    const matrix = {
        'A X': 3 + 1,
        'A Y': 6 + 2,
        'A Z': 0 + 3,
        'B X': 0 + 1,
        'B Y': 3 + 2,
        'B Z': 6 + 3,
        'C X': 6 + 1,
        'C Y': 0 + 2,
        'C Z': 3 + 3
    }

    return matrix[`${opp} ${my}`];
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

