module.exports = function (input) {
    const lines = input
        .trim()
        .split(/\r?\n/)
        ;
    const limits = [12, 13, 14];

    let part1 = 0;
    let part2 = 0;

    lineloop:
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        const reds = line.match(/\d+(?= red)/g).map((n) => parseInt(n));
        const greens = line.match(/\d+(?= green)/g).map((n) => parseInt(n));
        const blues = line.match(/\d+(?= blue)/g).map((n) => parseInt(n));
        const maxes = [reds, greens, blues].map((color) => Math.max(0, ...color));

        const power = maxes[0] * maxes[1] * maxes[2];
        part2 += power;

        for (let i = 0; i < 3; i++) {
            if (maxes[i] > limits[i]) {
                continue lineloop;
            }
        }
        part1 += l + 1;
    }

    return [part1, part2];
}