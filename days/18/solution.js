module.exports = function (input) {
    const instructions = input.trim().split('\n').map((line) => line.split(' '));

    // part 1
    let y = 0;
    let fill = 1;
    for (const instruction of instructions) {
        const len = Number(instruction[1])
        if (instruction[0] === 'R') {
            fill -= len * y;
        }
        if (instruction[0] === 'L') {
            fill += len * y;
        }
        if (instruction[0] === 'U') {
            y -= len;
        }
        if (instruction[0] === 'D') {
            y += len;
        }
        fill += len / 2;
    }
    const part1 = fill;

    // part 2
    y = 0;
    fill = 1;
    for (const instruction of instructions) {
        const len = parseInt(instruction[2].slice(2, 7), 16)
        if (instruction[2][7] === '0') {
            fill -= len * y;
        }
        if (instruction[2][7] === '2') {
            fill += len * y;
        }
        if (instruction[2][7] === '3') {
            y -= len;
        }
        if (instruction[2][7] === '1') {
            y += len;
        }
        fill += len / 2;
    }
    const part2 = fill;

    return [part1, part2]
}