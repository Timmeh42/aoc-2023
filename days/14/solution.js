module.exports = function (input) {
    let grid = [];
    let x = 0;
    let y = 0;
    for (const char of input.trim()) {
        if (char === '\n') {
            y++;
            x = 0;
        } else {
            if (y === 0) {
                grid.push([]);
            }
            let c = 0;
            if (char === 'O') c = 1;
            if (char === '#') c = 2;
            grid[x].push(c);
            x++;
        }
    }
    const height = y + 1;
    const width = x;

    let tempGrid = new Array(grid.length);
    for (let n = 0; n < grid.length; n++) {
        tempGrid[n] = new Array(grid.length);
    }

    let part1 = 0;
    let part2 = 0;
    const rounds = 4e9;
    let score = 0;
    const memory = [];
    let looped = false;
    for (let n = 0; n < rounds; n++) {
        let hash = '';
        for (let x = 0; x < width; x++) {
            let rockCount = 0;
            let spaceCount = 0;
            let brickCount = 0;
            let compactedY = 0;
            for (let y = 0; y < height; y++) {
                const piece = grid[x][y];
                if (piece !== 2 && brickCount > 0) {
                    for (let n = 0; n < rockCount; n++) {
                        tempGrid[x][compactedY + n] = 1;
                    }
                    for (let n = 0; n < spaceCount; n++) {
                        tempGrid[x][compactedY + rockCount + n] = 0;
                    }
                    for (let n = 0; n < brickCount; n++) {
                        tempGrid[x][compactedY + rockCount + spaceCount + n] = 2;
                    }
                    if (rockCount > 0) hash += rockCount;
                    if (spaceCount > 0) hash += spaceCount;
                    if (brickCount > 0) hash += brickCount;
                    if (part1 === 0) {
                        score += (2 * (height - compactedY) - rockCount + 1) * rockCount / 2
                    }
                    rockCount = 0;
                    spaceCount = 0;
                    brickCount = 0;
                    compactedY = y;
                }
                if (piece === 0) spaceCount++;
                else if (piece === 1) rockCount++;
                else if (piece === 2) brickCount++;
            }
            for (let n = 0; n < rockCount; n++) {
                tempGrid[x][compactedY + n] = 1;
            }
            for (let n = 0; n < spaceCount; n++) {
                tempGrid[x][compactedY + rockCount + n] = 0;
            }
            for (let n = 0; n < brickCount; n++) {
                tempGrid[x][compactedY + rockCount + spaceCount + n] = 2;
            }
            if (rockCount > 0) hash += rockCount;
            if (spaceCount > 0) hash += spaceCount;
            if (brickCount > 0) hash += brickCount;
            if (part1 === 0) {
                score += (2 * (height - compactedY) - rockCount + 1) * rockCount / 2
            }
        }

        // part1 score
        if (n === 0) {
            part1 = score;
        }

        // check hash
        const lastSeen = memory.indexOf(hash);
        if (looped === false && lastSeen !== -1) {
            const loopLength = n - lastSeen;
            n += (Math.floor((rounds - n) / loopLength) - 1) * loopLength;
            looped = true;
        }
        memory.push(hash);

        // rotate
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                grid[x][y] = tempGrid[y][width - x - 1];
            }
        }

        // part2 score
        score = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (grid[x][y] === 1) {
                    score += height - y;
                }
            }
        }
    }
    part2 = score;
    return [part1, part2];
}
