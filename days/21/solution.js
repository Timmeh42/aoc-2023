module.exports = function (input) {
    const lines = input.trim().split('\n');
    const width = lines[0].length;
    const height = lines.length;
    const grid = new Map();

    let startKey;
    for (let y = 0; y < height; y++) {
        const line = lines[y];
        for (let x = 0; x < width; x++) {
            const char = line[x];
            const key = x + y * width;
            if (char === 'S') {
                startKey = key;
            }
            if (char !== '#') {
                grid.set(key, char);
            }
        }
    }
    const fillGridCache = new Map();
    const fillGrid = (x, y, steps, startStep = 0) => {
        const startKey = x + y * width;
        const key = (steps * (width * height) + startKey) * 10 + startStep;
        if (fillGridCache.has(key)) return fillGridCache.get(key);
        let innerSizes = [0, 1]
        const frontiers = [
            new Set(),
            new Set(),
            new Set(),
            new Set(),
        ];
        frontiers[0].add(startKey);
        let dx = 1;
        let dy = 0;
        let maxX = 0
        let minX = 9999;
        for (let step = startStep; step < steps; step++) {
            const oldFrontier = frontiers[0];
            const innerFrontier = frontiers[1];
            const wildFrontier = new Set();
            for (const plot of oldFrontier.values()) {
                const x = plot % width;
                const y = Math.floor(plot / width);

                for (let d = 0; d < 4; d++) {
                    [dx, dy] = [-dy, dx];
                    let nx = x + dx;
                    let ny = y + dy;
                    const nkey = nx + ny * width;
                    if (nx >= 0 && ny >= 0 && nx < width && ny < height && grid.has(nkey) && !innerFrontier.has(nkey)) {
                        wildFrontier.add(nkey);
                        maxX = Math.max(maxX, nx)
                        minX = Math.min(minX, nx)
                    }
                }
            }
            frontiers.pop(3);
            frontiers.unshift(wildFrontier);
            innerSizes = [
                innerSizes[1],
                innerSizes[0] + wildFrontier.size,
            ];
        }
        fillGridCache.set(key, innerSizes[1]);
        console.log(maxX, minX)
        return innerSizes[1];
    }

    const part1 = fillGrid(65, 65, 64);
    return [part1];
}