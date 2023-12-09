module.exports = function (input) {
    const sequences = input.trim().split('\n').map((line) => line.split(' ').map((s) => parseInt(s)));

    let part1 = 0;
    let part2 = 0;
    for (const sequence of sequences) {
        console.log(sequence)
        let diffSequences = [sequence];
        let diffSequence = sequence;
        while (true) {
            diffSequence = diffSequence.map((v, i, s) => s[i+1] - v).filter((v) => !Number.isNaN(v));
            diffSequences.push(diffSequence);
            if (diffSequence[0] === 0 && diffSequence[diffSequence.length - 1] === 0) {
                break;
            }
        }

        for (let d = diffSequences.length - 2; d >= 0; d--) {
            let sequence = diffSequences[d];
            sequence.push(sequence[sequence.length-1] + diffSequences[d+1].pop());
            sequence.unshift(sequence[0] - diffSequences[d+1][0]);
        }

        part1 += diffSequences[0].pop();
        part2 += diffSequences[0][0];
    }
    return [part1, part2];
}

