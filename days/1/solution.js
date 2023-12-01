module.exports = function (input) {
    let total = 0;
    const numbs = input
        .trim()
        .split(/\r?\n/)
        .map((line) => line
            .match(/\d/g)
        )
        .map((line) => 10 * line[0] + 1 * line[line.length - 1])
        .reduce((total, line) => total + line)
    ;
        
    let total2 = 0;
    const numbs2 = input
        .trim()
        .split('\r\n')
        .map((line) => line
            .replaceAll(
                /(o)(?=ne)|(t)(?=wo)|(t)(?=hree)|(f)(?=our)|(f)(?=ive)|(s)(?=ix)|(s)(?=even)|(e)(?=ight)|(n)(?=ine)/g,
                (match, one, two, three, four, five, six, seven, eight, nine) => {
                    if (one) return 1;
                    if (two) return 2;
                    if (three) return 3;
                    if (four) return 4;
                    if (five) return 5;
                    if (six) return 6;
                    if (seven) return 7;
                    if (eight) return 8;
                    if (nine) return 9;
                })
            .match(/\d/g)
        )
        .map((line) => 10 * line[0] + 1 * line[line.length - 1])
        .reduce((total, line) => total + line)

    return [numbs, numbs2];
}