module.exports = function (input) {
    input = '.' + input.trim().split(/\r?\n/).join('.\n.') + '.'
    const lineLength = input.search(/\r?\n/);
    input = '.' * lineLength + '\n' + input + '\n' + '.' * lineLength
    const grid = input.replaceAll(/\r?\n/g, '').trim();
    const symbols = [...grid.matchAll(/[^\d\.]/g)];
    const labels = [...grid.matchAll(/\d{1,3}/g)];
    gears = {};
    let part1 = 0;
    for (const label of labels) {
        const lx = Math.floor(label.index % lineLength);
        const ly = Math.floor(label.index / lineLength);

        const ll = label[0].length;
        let isLabel = false;
        for (const symbol of symbols) {
            const sx = Math.floor(symbol.index % lineLength);
            const sy = Math.floor(symbol.index / lineLength);
            if (sx >= lx - 1 && sx <= lx + ll && sy >= ly - 1 && sy <= ly + 1) {
                isLabel = true;
                if (symbol[0] === '*') {
                    if (gears[symbol.index]) {
                        gears[symbol.index].push(label[0]);
                    } else {
                        gears[symbol.index] = [label[0]];
                    }
                }
            }
        }
        if (isLabel) part1 += parseInt(label[0]);
    }
    const part2 = Object.values(gears)
        .filter((v) => v.length === 2)
        .map((v) => v[0] * v[1])
        .reduce((sum, v) => sum + v, 0)
    return [part1, part2];
}