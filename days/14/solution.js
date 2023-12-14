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

    let tiltedGrid = [];
    let part1 = 0;
    let part2 = 0;
    const rounds = 4e9;
    let score = 0;
    const memory = [];
    let looped = false;
    for (let n = 0; n < rounds; n++) {
        let hash = '';
        tiltedGrid = [];
        for (let x = 0; x < width; x++) {
            tiltedGrid.push([]);
            let rockCount = 0;
            let spaceCount = 0;
            let brickCount = 0;
            let compactedY = 0;
            for (let y = 0; y < height; y++) {
                const piece = grid[x][y];
                if (piece !== 2 && brickCount > 0) {
                    tiltedGrid[x].push(...Array(rockCount).fill(1), ...Array(spaceCount).fill(0), ...Array(brickCount).fill(2));
                    if (rockCount > 0) hash += rockCount;
                    if (spaceCount > 0) hash += spaceCount;
                    if (brickCount > 0) hash += brickCount;
                    score += (2 * (height - compactedY) - rockCount + 1) * rockCount / 2
                    rockCount = 0;
                    spaceCount = 0;
                    brickCount = 0;
                    compactedY = y;
                }
                if (piece === 0) spaceCount++;
                else if (piece === 1) rockCount++;
                else if (piece === 2) brickCount++;
            }
            tiltedGrid[x].push(...Array(rockCount).fill(1), ...Array(spaceCount).fill(0), ...Array(brickCount).fill(2));
            if (rockCount > 0) hash += rockCount;
            if (spaceCount > 0) hash += spaceCount;
            if (brickCount > 0) hash += brickCount;
            score += (2 * (height - compactedY) - rockCount + 1) * rockCount / 2
        }
        if (n === 0) {
            part1 = score;
        }

        const lastSeen = memory.indexOf(hash);
        if (looped === false && lastSeen !== -1) {
            const loopLength = n - lastSeen;
            n += (Math.floor((rounds - n) / loopLength) - 1) * loopLength;
            looped = true;
        }
        memory.push(hash);

        const rotatedGrid = [];
        for (let x = 0; x < width; x++) {
            rotatedGrid.push([]);
            for (let y = 0; y < height; y++) {
                if (tiltedGrid[y][width - x - 1] === undefined) throw [x, y, width, height]
                rotatedGrid[x].push(tiltedGrid[y][width - x - 1]);
            }
        }
        grid = rotatedGrid;
        
        let s = '';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                s += rotatedGrid[x][y]
            }
            s += '\n'
        }

        score = 0;
        for (let x = 0; x < width; x++) {
            let colScore = 0
            for (let y = 0; y < height; y++) {
                if (grid[x][y] === 1) {
                    colScore += height - y;
                }
            }
            score += colScore;
        }
    }
    part2 = score;
    return [part1, part2];
}
