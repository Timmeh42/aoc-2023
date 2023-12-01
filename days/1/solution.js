module.exports = function (input) {
    const lines = input
        .trim()
        .split(/\r?\n/)
        ;

    let total1 = 0;
    const regexFirst1 = /.*?(\d)/;
    const regexLast1 = /.*(\d)/;
    for (const line of lines) {
        const first = regexFirst1.exec(line)[1];
        const last = regexLast1.exec(line)[1];
        total1 += 10 * first + 1 * last;
    }

    const dict = {
        1:1,
        2:2,
        3:3,
        4:4,
        5:5,
        6:6,
        7:7,
        8:8,
        9:9,
        one:1,
        two:2,
        three:3,
        four:4,
        five:5,
        six:6,
        seven:7,
        eight:8,
        nine:9,
    };

    let total2 = 0;
    const regexFirst2 = /.*?(\d|one|two|three|four|five|six|seven|eight|nine)/;
    const regexLast2 = /.*(\d|one|two|three|four|five|six|seven|eight|nine)/;
    for (const line of lines) {
        const first = regexFirst2.exec(line)[1];
        const last = regexLast2.exec(line)[1];

        total2 += 10 * dict[first] + dict[last]
    }
    return [total1, total2];
}