module.exports = function (input) {
    const [directions, rawMap] = input.trim().split('\n\n');
    const map = new Map();
    for (const line of rawMap.split('\n')) {
        const bits = line.match(/\w+/g);
        const start = bits[0][2] === 'A';
        const end = bits[0][2] === 'Z';
        map.set(bits[0], { label: bits[0], L: bits[1], R: bits[2], start, end });
    }

    let part1 = 0;
    let pos = 'AAA';
    while (pos !== 'ZZZ') {
        let step = directions[part1 % directions.length];
        pos = map.get(pos)[step];
        part1++;
    }

    let paths = [...map.values()].filter((pos) => pos.start === true).map((pos) => ({ loops: [], loopLength: -1, offset: 0, pos, }));

    for (const path of paths) {
        let loops = 0;
        let pos = path.pos;
        let startpos;
        label:
        while (true) {
            for (const direction of directions) {
                pos = map.get(pos[direction]);
                loops++;
                if (startpos === undefined) {
                    startpos = pos;  
                } else {
                    if (pos.label === startpos.label) {
                        path.loops = loops;
                        break label;
                    }
                }
            }
        }
    }
    const primes = paths.map((path) => {
        let x = path.loops - 1;
        let maxFac = 1;
        let d = 2;
        while (x > 1) {
            while (x % d === 0) {
                maxFac = d;
                x = x / d;
            }
            d++;
            if (d*d > x) {
                if (x > 1) {
                    maxFac = x;
                }
                break;
            }
        }
        return maxFac;
    })

    const part2 = primes.reduce((x, m) => x * m, directions.length);

    return [part1, part2];
}
