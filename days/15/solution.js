module.exports = function (input) {
    const part1 = input.trim().split(',').map((step) => hash(step)).reduce((sum, n) => sum + n);
    const lensMap = new Map();
    for (const lens of input.trim().split(',')) {
        const word = lens.match(/\w+/)[0];
        const focus = lens.match(/\d/)?.[0];

        if (focus) {
            lensMap.set(word, Number(focus));
        } else {
            lensMap.delete(word);
        }
    }

    const boxCounts = new Map();
    let part2 = 0;
    for (const [label, focus] of lensMap.entries()) {
        const box = hash(label);
        const boxCount = boxCounts.get(box) || 0
        const score = (box + 1) * (boxCount + 1) * focus;
        boxCounts.set(box, boxCount + 1);
        part2 += score;
    }
    return [part1, part2];
}

function hash(string) {
    let hash = 0;
    for (let c = 0; c < string.length; c++) {
        const char = string.charCodeAt(c);
        hash += char;
        hash *= 17;
        hash %= 256;
    }
    return hash;
}