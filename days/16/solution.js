module.exports = function (input) {
    input = input.trim();
    const things = new Map();
    let width = 0;
    for (let c = 0; c < input.length; c++) {
        if (input[c] === '\n' && width === 0) {
            width = c + 1;
        }
        if (input[c] === '|') {
            things.set(c, 'splitY');
        } else if (input[c] === '-') {
            things.set(c, 'splitX');
        } else if (input[c] === '\\') {
            things.set(c, 'mirrorNW');
        } else if (input[c] === '/') {
            things.set(c, 'mirrorNE');
        }
    }
    const height = Math.ceil(input.length / width);
    const gwidth = width-1;
    let part1 = 0;
    let part2 = 0;
    for (let n = 0; n < (gwidth + height) * 2; n++) {
        let cx = 0;
        let cy = 0;
        let dx = 0;
        let dy = 0;
        if (n >= 0 && n < gwidth) {
            cx = n;
            cy = 0;
            dy = 1;
        }
        if (n >= gwidth + height && n < gwidth*2 + height) {
            cx = gwidth*2 + height-1 - n;
            cy = height - 1;
            dy = -1;
        }
        if (n >= gwidth && n < gwidth + height) {
            cy = n - gwidth;
            cx = gwidth - 1;
            dx = -1;
        }
        if (n >= gwidth*2 + height) {
            cy = gwidth*2 + height*2-1 - n;
            cx = 0;
            dx = 1;
        }
        const c = cx + cy * width;
        let tileRecord = new Set();
        let queue = [{ c, dx, dy }];
        let seenRays = new Set();

        while (queue.length) {
            const ray = queue.shift();

            const key = ray.c * 100 + ray.dx * 10 + ray.dy + 11
            if (seenRays.has(key)) {
                continue;
            }
            const x = ray.c % width;
            const y = Math.floor(ray.c / width);
            if (!(x >= 0 && y >= 0 && x < width-1 && y < height)) {
                continue;
            }
            tileRecord.add(ray.c);
            seenRays.add(key)
            const thing = things.get(ray.c);
            if (thing === 'splitY' && ray.dx !== 0) {
                queue.push({ c: ray.c - width, dx: 0, dy: -1 });
                queue.push({ c: ray.c + width, dx: 0, dy: 1 });
            } else if (thing === 'splitX' && ray.dy !== 0) {
                queue.push({ c: ray.c - 1, dx: -1, dy: 0 });
                queue.push({ c: ray.c + 1, dx: 1, dy: 0 });
            } else if (thing === 'mirrorNW') {
                const newDx = ray.dy;
                const newDy = ray.dx;
                const newC = ray.c + newDx + newDy * width;
                queue.push({ c: newC, dx: newDx, dy: newDy });
            } else if (thing === 'mirrorNE') {
                const newDx = -ray.dy;
                const newDy = -ray.dx;
                const newC = ray.c + newDx + newDy * width;
                queue.push({ c: newC, dx: newDx, dy: newDy });
            } else {
                const newC = (x + ray.dx) + (y + ray.dy) * width;
                queue.push({ c: newC, dx: ray.dx, dy: ray.dy });
            }

        }
        part1 = tileRecord.size;
        if (tileRecord.size > part2) {
            part2 = tileRecord.size;
        }
    }

    return [part1, part2];
}