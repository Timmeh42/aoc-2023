module.exports = function (input) {
    const lines = input.trim().split('\n');
    const times = lines[0].split(/\s+/).slice(1).map((s) => parseInt(s));
    const distances = lines[1].split(/\s+/).slice(1).map((s) => parseInt(s));
    let part1 = 1;

    const high = (time, distance) => Math.ceil((-time - (time**2 - 4*distance)**0.5)/(-2))
    const low = (time, distance) => Math.floor((-time + (time**2 - 4*distance)**0.5)/(-2))
    for (let i = 0; i < times.length; i++) {
        part1 *= high(times[i], distances[i]) - low(times[i], distances[i]) - 1;
    }
    const time = parseInt(lines[0].split(/\s+/).slice(1).join(''))
    const distance = parseInt(lines[1].split(/\s+/).slice(1).join(''))
    const part2 = high(time, distance) - low(time, distance) - 1;
    return [part1, part2];
}
