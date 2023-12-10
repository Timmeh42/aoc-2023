module.exports = function (input) {
    const grid = [];
    const lines = input.trim().split('\n');
    let start = [];
    for (let y = 0; y < lines.length; y++) {
        const posses = lines[y].split('');
        for (let x = 0; x < posses.length; x++) {
            if (grid[x] == undefined) grid[x] = [];
            // grid[x][y] = posses[x];
            if (posses[x] === 'S') {
                grid[x][y] = 'start';
                start = [x, y];
            } else if (posses[x] === '-') {
                grid[x][y] = [[-1, 0], [1, 0], null];
            } else if (posses[x] === '|') {
                grid[x][y] = [[0, -1], [0, 1], 0];
            } else if (posses[x] === 'J') {
                grid[x][y] = [[-1, 0], [0, -1], -1];
            } else if (posses[x] === 'L') {
                grid[x][y] = [[1, 0], [0, -1], -1];
            } else if (posses[x] === 'F') {
                grid[x][y] = [[1, 0], [0, 1], 1];
            } else if (posses[x] === '7') {
                grid[x][y] = [[-1, 0], [0, 1], 1];
            } else {
                grid[x][y] = null;
            }
        }
    }

    let part1 = 0;
    let part2 = 0;
    for (let d of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let sx = start[0];
        let sy = start[1];
        let sd = d;
        let steps = 1;
        let loop = false;
        const loopSquares = [];
        while (true) {
            const nextCol = grid[sx + d[0]]; //[sy + d[1]];
            if (nextCol === undefined || nextCol[sy + d[1]] === undefined) {
                break;
            }
            const nextPos = nextCol[sy + d[1]];
            if (nextPos === null) {
                break;
            }
            if (sx + d[0] === start[0] && sy + d[1] === start[1]) {
                loop = true;
                let xComp = sd[0] - d[0];
                let yComp = sd[1] - d[1];
                if (xComp === 2) {
                    loopSquares[start[1]][start[0]] = [[-1, 0], [1, 0], null];
                } else if (yComp === 2) {
                    loopSquares[start[1]][start[0]] = [[0, -1], [0, 1], 0];
                } else {
                    loopSquares[start[1]][start[0]] = [[xComp, 0], [0, yComp], xComp];
                }
                break;
            }
            steps += 1;
            sx += d[0];
            sy += d[1];
            if (loopSquares[sy] === undefined) loopSquares[sy] = [];
            loopSquares[sy][sx] = nextPos[2];

            if (nextPos[0][0] + d[0] === 0 && nextPos[0][1] + d[1] === 0) {
                d = nextPos[1];
            } else if (nextPos[1][0] + d[0] === 0 && nextPos[1][1] + d[1] === 0) {
                d = nextPos[0];
            } else {
                break;
            }
        }
        if (loop === true) {
            // pathLengths.push(steps / 2)
            part1 = steps / 2;
            let enclosed = 0;
            loopSquares.forEach((row, y) => {
                let enc = 0;
                let sx = 0;
                let inloop = false;
                let onloop = false;
                let lastCorner;
                row.forEach((s, x) => {
                    if (inloop && !onloop) {
                        enc += x - sx - 1;
                    }
                    if (lines[y][x] === '|') {
                        inloop = !inloop;
                    }
                    if (lines[y][x] === 'F') {
                        lastCorner = 'F';
                        onloop = true;
                    }
                    if (lines[y][x] === 'L') {
                        lastCorner = 'L';
                        onloop = true;
                    }
                    if (lines[y][x] === 'J') {
                        if (lastCorner === 'F') {
                            inloop = !inloop;
                        }
                        lastCorner = 'J';
                        onloop = false;
                    }
                    if (lines[y][x] === '7') {
                        if (lastCorner === 'L') {
                            inloop = !inloop;
                        }
                        lastCorner = '7';
                        onloop = false;
                    }
                    sx = x;
                });
                enclosed += enc;
            });
            part2 = enclosed;
        }
    }
    return [part1, part2];
}

