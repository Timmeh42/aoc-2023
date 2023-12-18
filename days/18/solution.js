module.exports = function (input) {
    const instructions = input.trim().split('\n').map((line) => line.split(' '));

    const dirMap = {
        U: [0, -1],
        D: [0, 1],
        L: [-1, 0],
        R: [1, 0],
        0: [1, 0],
        1: [0, 1],
        2: [-1, 0],
        3: [0, -1],
    };

    // part 1
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    let areas = [];

    let x = 0;
    let y = 0;
    for (const instruction of instructions) {
        const len = Number(instruction[1])
        const dir = dirMap[instruction[0]];
        areas.push([x, y, dir, len]);
        x += dir[0] * len;
        y += dir[1] * len;
        if (xMin > x) xMin = x;
        if (xMax < x) xMax = x;
        if (yMin > y) yMin = y;
        if (yMax < y) yMax = y;

    }

    let fill = 1;
    for (const area of areas) {
        if (area[2][1] === 0) {
            const height = yMax - area[1];
            const width = area[3];
            fill += area[2][0] * width * height;
        }
        fill += (area[3]) / 2;
    }
    const part1 = fill;

    // part 2
    xMin = Infinity;
    xMax = -Infinity;
    yMin = Infinity;
    yMax = -Infinity;

    areas = [];
    x = 0;
    y = 0;
    for (const instruction of instructions) {
        const len = parseInt(instruction[2].slice(2, 7), 16)
        const dir = dirMap[instruction[2][7]];
        areas.push([x, y, dir, len]);
        x += dir[0] * len;
        y += dir[1] * len;
        if (xMin > x) xMin = x;
        if (xMax < x) xMax = x;
        if (yMin > y) yMin = y;
        if (yMax < y) yMax = y;

    }

    fill = 1;
    for (const area of areas) {
        if (area[2][1] === 0) {
            const height = yMax - area[1];
            const width = area[3];
            fill += area[2][0] * width * height;
        }
        fill += (area[3]) / 2;
    }
    const part2 = fill;


    
    return [part1, part2]
}