module.exports = function (input) {
    let part1 = 0;
    let part2 = 0;
    for (const line of input.trim().split('\n')) {
        let [record, groups] = line.split(' ');
        groups = groups.split(',').map((n) => Number(n));
        part1 += arrangements(record, groups);
        let record2 = record;
        let groups2 = [...groups];
        for (let i = 0; i < 4; i++) {
            record2 += '?' + record;
            groups2 = groups2.concat(groups);
        }
        part2 += arrangements(record2, groups2);
    }
    return [part1, part2];
}

function arrangements(record, groups, recordId = 0, groupId = 0, cache = new Map()) {
    const key = recordId  * 100 + groupId;
    if (cache.has(key)) {
        return cache.get(key);
    }
    if (groups.length === groupId) {
        if (record.includes('#', recordId)) {
            return 0;
        } else {
            return 1;
        }
    }
    const spaceNeeded = groups.reduce((sum, g, i) => i <= groupId ? sum : sum + g + 1, 0);
    if (spaceNeeded > (record.length - recordId)) {
        return 0;
    }
    let results = 0;
    const group = groups[groupId];
    offsetLoop:
    for (let offset = recordId; offset <= record.length - spaceNeeded; offset++) {
        if (offset > recordId && record[offset - 1] === '#') {
            break;
        }
        for (let n = 0; n < group; n++) {
            if (offset + n >= record.length || record[offset + n] === '.') {
                continue offsetLoop;
            }
        }
        if (record[offset + group] !== '#') {
            results += arrangements(record, groups, offset + group + 1, groupId + 1, cache);
        }
    }
    cache.set(key, results)
    return results;
}