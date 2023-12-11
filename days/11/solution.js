module.exports = function (input) {
    const lineLength = input.indexOf('\n');
    const galaxySearch = input.matchAll(/#/g);
    const galaxies = [];
    for (const galaxy of galaxySearch) {
        const x = galaxy.index % (lineLength + 1);
        const y = Math.floor(galaxy.index / (lineLength + 1));
        galaxies.push({ x, y, x2: x, y2: y });
    }

    const ageMulti = 1000000;

    let accumulatedYShift1 = 0;
    let accumulatedYShift2 = 0;
    let lastSeenY;
    for (const galaxy of galaxies) {
        if (lastSeenY !== undefined) {
            if (galaxy.y - lastSeenY > 1) {
                accumulatedYShift1 += (galaxy.y - lastSeenY - 1);
                accumulatedYShift2 += (galaxy.y - lastSeenY - 1) * (ageMulti - 1);
            }
        }
        lastSeenY = galaxy.y;
        galaxy.y2 += accumulatedYShift2;
        galaxy.y += accumulatedYShift1;
    }

    galaxies.sort((g1, g2) => g1.x - g2.x);

    let accumulatedXShift1 = 0;
    let accumulatedXShift2 = 0;
    let lastSeenX;
    for (const galaxy of galaxies) {
        if (lastSeenX !== undefined) {
            if (galaxy.x - lastSeenX > 1) {
                accumulatedXShift1 += (galaxy.x - lastSeenX - 1);
                accumulatedXShift2 += (galaxy.x - lastSeenX - 1) * (ageMulti - 1);
            }
        }
        lastSeenX = galaxy.x;
        galaxy.x2 += accumulatedXShift2;
        galaxy.x += accumulatedXShift1;
    }

    let part1 = 0;
    let part2 = 0;
    for (let g1 = 0; g1 < galaxies.length; g1++) {
        for (let g2 = g1 + 1; g2 < galaxies.length; g2++) {
            part1 += Math.abs(galaxies[g1].x - galaxies[g2].x) + Math.abs(galaxies[g1].y - galaxies[g2].y);
            part2 += Math.abs(galaxies[g1].x2 - galaxies[g2].x2) + Math.abs(galaxies[g1].y2 - galaxies[g2].y2);
        }
    }
    
    return [part1, part2];
}

