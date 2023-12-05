module.exports = function (input) {
    const seeds = input.match(/seeds:([\d\s]+)\n\n/)[1].trim().split(' ').map((n) => parseInt(n));
    const maps = [...input.trim().matchAll(/map:([\n\d\s]+)/g)]
        .map((match) => match[1]
            .trim()
            .split('\n')
            .map((line) => line
                .split(' ')
                .map((n) => parseInt(n))
            )
            .toSorted((line1, line2) => line1[1] - line2[1])
        );
    const transforms1 = seeds.map((seed) => ({
        inStart: seed,
        inEnd: seed + 1,
        outStart: seed,
        outEnd: seed + 1,
        offset: 0,
        width: 1,
    }));
    const transforms2 = []
    for (let s = 0; s < seeds.length; s+=2) {
        transforms2.push({
            inStart: seeds[s],
            inEnd: seeds[s] + seeds[s+1],
            outStart: seeds[s],
            outEnd: seeds[s] + seeds[s+1],
            offset: 0,
            width: seeds[s+1],
        });
    }
    
    const results1 = transforms1.flatMap((transform) => splitTransformByMap(transform, maps))
    const part1 = Math.min(...results1.map((transform) => transform.outStart))
    
    const results2 = transforms2.flatMap((transform) => splitTransformByMap(transform, maps))
    const part2 = Math.min(...results2.map((transform) => transform.outStart))
    
    return [part1, part2];
}

function splitTransformByMap(oldTransform, maps) {
    const transform = { ...oldTransform };
    if (maps.length === 0) return [transform];
    const outputTransforms = [];
    for (const line of maps[0]) {
        const width = line[2];
        const offset = line[0] - line[1];
        const inStart = line[1];
        const inEnd = inStart + width;
        const outStart = line[0];
        const outEnd = outStart + width;
        // if not overlapping, to the left, do nothing
        if (inEnd <= transform.outStart) {
            continue;
        }
        
        // if past the left edge, cut off sliver
        if (inStart > transform.outStart) {
            const sliverWidth = Math.min(transform.width, inStart - transform.outStart);
            outputTransforms.push({
                inStart: transform.inStart,
                inEnd: transform.inStart + sliverWidth,
                outStart: transform.outStart,
                outEnd: transform.outStart + sliverWidth,
                offset: transform.offset,
                width: sliverWidth,
            });

            transform.width -= sliverWidth;
            transform.inStart += sliverWidth;
            transform.outStart += sliverWidth;
        }

        if (transform.width > 0) {
            const overlapWidth = Math.min(inEnd, transform.outEnd) - transform.outStart;
            const overlapOffset = transform.offset + offset;
            outputTransforms.push({
                inStart: transform.inStart,
                inEnd: transform.inStart + overlapWidth,
                outStart: transform.inStart + overlapOffset,
                outEnd: transform.inStart + overlapOffset + overlapWidth,
                offset: overlapOffset,
                width: overlapWidth,
            });
            transform.inStart += overlapWidth;
            transform.outStart += overlapWidth;
            transform.width -= overlapWidth;
        }
        if (transform.width <= 0) {
            break;
        }

    }
    if (transform.width > 0) {
        outputTransforms.push(transform);
    }
    const results = [];
    for (const outputTransform of outputTransforms) {
        results.push(...splitTransformByMap(outputTransform, maps.slice(1)));
    }
    return results;
}