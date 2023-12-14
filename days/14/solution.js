module.exports = function (input) {
    const grid = [[]];
    let x = 0;
    let y = 0;
    const gridMap = new Map();
    let width = 0;
    for (const char of input.trim()) {
        if (char === '\n') {
            if (width === 0) {
                width = x;
            }
            x = 0;
            y++;
            grid.push([]);
        } else {
            const coordHash = x + y * width;
            if (char !== '.') {
                gridMap.set(coordHash, char);
            }

            grid[y].push(char);
            x++;
        }
    }
    const height = y + 1;


    let part1;
    const directions = [[0, -1], [-1, 0], [0, 1], [1, 0]];
    let direction = [0, -1];
    const memory = [];
    const rounds = 4e9;
    let looped = false;
    for (let n = 0; n < rounds; n++) {
        direction = directions[n % 4];
        for (const [coordHash, char] of gridMap.entries()) {
            if (char === 'O') {
                const x = coordHash % width;
                const y = Math.floor(coordHash / width);
                let nx = x;
                let ny = y;
                let lastEmpty;
                while (true) {
                    nx += direction[0];
                    ny += direction[1];
                    if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
                        const nCoordHash = nx + ny * width;
                        const gridCheck = gridMap.get(nCoordHash)
                        if (gridCheck) {
                            if (gridCheck === '#') {
                                break;
                            }
                        } else {
                            lastEmpty = nCoordHash;
                        }
                    } else {
                        break
                    }
                }
                if (lastEmpty !== undefined) {
                    // console.log('moving to', lastEmpty)
                    gridMap.set(lastEmpty, char);
                    gridMap.delete(coordHash);
                }
    
            }
        }
        const hash = getHash(gridMap, width, height);
        const lastSeen = memory.indexOf(hash)
        if (looped === false && lastSeen !== -1) {
            const loopLength = n - lastSeen;
            // console.log(hash, lastSeen, loopLength, n, Math.floor((rounds - n) / loopLength) * loopLength)
            n += (Math.floor((rounds - n) / loopLength) - 1) * loopLength;
            // console.log('looping', hash)
            looped = true;
        }
        // if (getPart(gridMap, width, height) === 64) {
        //     console.log(hash, n)
        // }
        // if (looped === true) {
        //     console.log(hash, n, getPart(gridMap, width, height))
        // }
        memory.push(hash);
        if (part1 === undefined) {
            part1 = getPart(gridMap, width, height);
        }
        // console.log(direction)
        logMap(gridMap, width, height);
    }
    const part2 = getPart(gridMap, width, height);

    // for (let y = 0; y < grid.length; y++) {
    //     for (let x = 0; x < grid[y].length; x++) {
    //         let ty = y - 1;
    //         if (grid[y][x] === 'O') {
    //             while(ty >= 0 && grid[ty][x] === '.') {
    //                 grid[ty][x] = 'O';
    //                 grid[ty+1][x] = '.';
    //                 ty--;
    //             }
    //         }
    //     }
    // }

    // let part12 = 0;
    // for (let y = 0; y < grid.length; y++) {
    //     for (let x = 0; x < grid[y].length; x++) {
    //         if (grid[y][x] === 'O') {
    //             part12 += grid.length - y;
    //         }
    //     }
    // }
    // console.log(grid.map((line) => line.join('') + '            '))
    return [part1, part2];
}

function getPart(gridMap, width, height) {
    let part = 0;
    for (const [coordHash, char] of gridMap.entries()) {
        if (char === 'O') {
            const y = Math.floor(coordHash / width);
            part += height - y;
        }
    }
    return part;
}

function getHash(gridMap, width, height) {
    let hash = '';
    for (const [coordHash, char] of [...gridMap.entries()].sort((a, b) => a[0] - b[0])) {
        if (char === 'O') {
            // const x = coordHash % width;
            // const y = Math.floor(coordHash / width);
            // hash += x + y + x * y;
            hash += coordHash;
        }
    }
    return hash;
}

function logMap(gridMap, width, height) {
    let grid = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const hash = x + y * width;
            if (gridMap.has(hash)) {
                grid += gridMap.get(hash);
            } else {
                grid += '.';
            }
        }
        grid += '\n';
    }
    // console.log(grid)
}