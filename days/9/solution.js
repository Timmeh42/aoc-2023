module.exports = function (input) {
    const sequences = input.trim().split('\n').map((line) => line.split(' ').map((s) => parseInt(s)));
    let part1 = 0;
    let part2 = 0;
    for (let sequence of sequences) {
        part1 += sequence.at(-1);
        part2 += sequence[0];
        let mul = -1;
        while (true) {
            for (let s = 0; s < sequence.length - 1; s++) {
                sequence[s] = sequence[s + 1] - sequence[s];
            }
            sequence.length -= 1;
            const start = sequence[0];
            const end = sequence.at(-1);
            if (start === 0 && end === 0) {
                break;
            }
            part1 += end;
            part2 += start * mul;
            mul *= -1;
        }
    }
    return [part1, part2];
}

