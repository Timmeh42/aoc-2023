module.exports = function (input) {
    const patterns = input.trim().split('\n\n');
    let part1 = 0;
    let part2 = 0;
    for (const pattern of patterns) {
        const lines = pattern.split('\n');
        const lineLength = lines[0].length;
        const mirrors = findMirror(lines);
        if (mirrors.length !== 1) {
            throw [pattern];
        } else {
            part1 += mirrors[0][0] + mirrors[0][1] * 100;
        }
        const mirror = mirrors[0];
        smudging:
        for (let sx = 0; sx < lineLength; sx++) {
            for (let sy = 0; sy < lines.length; sy++) {
                const cleanMirrors = findSmudgedMirror(lines, sx, sy);
                if (cleanMirrors.length === 0) {
                    continue;
                }
                let cleanMirror;
                if (cleanMirrors.length > 1) {
                    if (cleanMirrors[0][0] !== mirror[0] || cleanMirrors[0][1] !== mirror[1]) {
                        cleanMirror = cleanMirrors[0];
                    } else {
                        cleanMirror = cleanMirrors[1];
                    }
                } else {
                    cleanMirror = cleanMirrors[0];
                }
                if (cleanMirror[0] > 0 && cleanMirror[0] !== mirror[0]) {
                    part2 += cleanMirror[0];
                    break smudging;
                } else if (cleanMirror[1] > 0 && cleanMirror[1] !== mirror[1]) {
                    part2 += cleanMirror[1] * 100;
                    break smudging;
                }
            }
        }
    }
    return [part1, part2];
}

function findMirror(lines) {
    const lineLength = lines[0].length;
    let mirrors = [];

    let xMirrors = [];
    xMirrorMaker:
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        for (let c = 0; c < line.length; c++) {
            xMirrors = xMirrors.filter((x) => {
                return c < x || (x * 2 - c - 1) < 0 || line[x * 2 - c - 1] === line[c];
            });
            if (l === 0 && c < line.length - 1) {
                xMirrors.push(c + 1);
            }
            if (xMirrors.length === 0) {
                break xMirrorMaker;
            }
        }
    }
    mirrors.push(...xMirrors.map((x) => [x, 0]));

    let yMirrors = [];
    yMirrorMaker:
    for (let c = 0; c < lineLength; c++) {
        for (let l = 0; l < lines.length; l++) {
            yMirrors = yMirrors.filter((y) => {
                return l < y || (y * 2 - l - 1) < 0 || lines[y * 2 - l - 1][c] === lines[l][c];
            });
            if (c === 0 && l < lines.length - 1) {
                yMirrors.push(l + 1);
            }
            if (yMirrors.length === 0) {
                break yMirrorMaker;
            }
        }
    }
    mirrors.push(...yMirrors.map((y) => [0, y]));
    return mirrors
}

function findSmudgedMirror(lines, sx, sy) {
    const lineLength = lines[0].length;
    let mirrors = [];
    lines = lines.map((l) => l.split(''));

    lines[sy][sx] = lines[sy][sx] === '.' ? '#' : '.';
    
    let xMirrors = [];
    xMirrorMaker:
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        for (let c = 0; c < line.length; c++) {
            xMirrors = xMirrors.filter((x) => {
                return c < x || (x * 2 - c - 1) < 0 || line[x * 2 - c - 1] === line[c];
            });
            if (l === 0 && c < line.length - 1) {
                xMirrors.push(c + 1);
            }
            if (xMirrors.length === 0) {
                break xMirrorMaker;
            }
        }
    }
    mirrors.push(...xMirrors.map((x) => [x, 0]));

    let yMirrors = [];
    yMirrorMaker:
    for (let c = 0; c < lineLength; c++) {
        for (let l = 0; l < lines.length; l++) {
            yMirrors = yMirrors.filter((y) => {
                return l < y || (y * 2 - l - 1) < 0 || lines[y * 2 - l - 1][c] === lines[l][c];
            });
            if (c === 0 && l < lines.length - 1) {
                yMirrors.push(l + 1);
            }
            if (yMirrors.length === 0) {
                break yMirrorMaker;
            }
        }
    }
    mirrors.push(...yMirrors.map((y) => [0, y]));
    return mirrors;
}