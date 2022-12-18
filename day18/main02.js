const R = require('ramda');
const U = require('./utils');

U.runWrapper(parse, run, {
    hideRaw: true,
    hideParsed: false
});

// --------------------------------------------

function parse(lines) {
    return lines.map(x => x.split(',').map(Number));
}

// --------------------------------------------

function distanceBetweenCubes(cube1, cube2) {
    const [x1, y1, z1] = cube1;
    const [x2, y2, z2] = cube2;

    const xDiff = Math.abs(x1 - x2);
    const yDiff = Math.abs(y1 - y2);
    const zDiff = Math.abs(z1 - z2);

    const result = xDiff + yDiff + zDiff;
    
    return result;

}

function twoCubesTouch(cube1, cube2) {
    return distanceBetweenCubes(cube1, cube2) === 1;
}

function countNeighborsOfCube(cube, data, air) {

    let count = 0;

    for (let i = 0; i < data.length; i++) {
        const candidate = data[i];

        if (distanceBetweenCubes(cube, candidate) === 1) {
            count += 1;
        }
    }

    for (let i = 0; i < air.length; i++) {
        const candidate = air[i];

        if (distanceBetweenCubes(cube, candidate) === 1) {
            count += 1;
        }
    }    

    return count;
}

function isCubeSurrounded(cube, data, air) {
    return countNeighborsOfCube(cube, data, air) === 6;
}

// --------------------------------------------

function calculateTotalArea(data) {
    let area = data.length * 6;

    for (let i = 0; i < data.length; i++) {
        const cube = data[i];

        for (let j = 0; j < data.length; j++) {
            const candidate = data[j];

            if (i === j) continue;

            if (twoCubesTouch(cube, candidate)) {
                area -= 1;
            }

        }
    }

    return area;    
}

function fillWithAir(data) {
    const minX = R.reduce(R.min, Infinity, R.map(R.head, data));
    const maxX = R.reduce(R.max, -Infinity, R.map(R.head, data));

    const minY = R.reduce(R.min, Infinity, R.map(R.nth(1), data));
    const maxY = R.reduce(R.max, -Infinity, R.map(R.nth(1), data));

    const minZ = R.reduce(R.min, Infinity, R.map(R.nth(2), data));
    const maxZ = R.reduce(R.max, -Infinity, R.map(R.nth(2), data));

    // U.log(minX, maxX, minY, maxY, minZ, maxZ);

    let air = [];

    for (let x = minX - 1; x <= maxX + 1; x++) {
        for (let y = minY - 1; y <= maxY + 1; y++) {
            for (let z = minZ - 1; z <= maxZ + 1; z++) {
                
                let free = true;
                for (i = 0; i < data.length; i++) {
                    if (distanceBetweenCubes([x, y, z], data[i]) === 0) {
                        free = false
                        break;
                    }
                }

                if (free) {
                    air.push([x, y, z]);
                }
            }
        }
    }

    return air;
}

function run(data) {

    let air = fillWithAir(data);

    U.log('air', air);

    let repeat = true;

    while(repeat) {
        let newAir = [];

        for (let i = 0; i < air.length; i++) {
            const cube = air[i];

            if (isCubeSurrounded(cube, data, air)) {
                newAir.push(cube);
            }
        }

        if (newAir.length === air.length) {
            repeat = false;
            break;
        }

        air = newAir;   
    }

    // --------------------------------------------

    let area = calculateTotalArea(data.concat(air));

    const result = area;

    return result;
}

