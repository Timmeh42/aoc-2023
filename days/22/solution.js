module.exports = function (input) {
    const lines = input.trim().split('\n');
    const bricks = [];
    for (let l = 0; l < lines.length; l++) {
        const [x1, y1, z1, x2, y2, z2] = [...lines[l].match(/\d+/g)].map(Number);
        bricks.push({ x1, y1, z1, x2, y2, z2, brick: l });
    }

    while (true) {
        let motion = 0;
        for (const brick of bricks) {
            fall:
            while (brick.z1 > 1 && brick.z2 > 1) {
                brick.z1 -= 1;
                brick.z2 -= 1;
                motion -= 1;
                for (const blocker of bricks) {
                    if (blocker.brick === brick.brick) continue;
                    if (
                        blocker.z2 >= brick.z1 && blocker.z1 <= brick.z2 &&
                        blocker.x2 >= brick.x1 && blocker.x1 <= brick.x2 &&
                        blocker.y2 >= brick.y1 && blocker.y1 <= brick.y2
                    ) {
                        // collision
                        brick.z1 += 1;
                        brick.z2 += 1;
                        motion += 1;
                        break fall;
                    }
                }
            }
        }
        if (motion === 0) break;
    }

    for (const brick of bricks) {
        brick.belows = new Set();
        for (const blocker of bricks) {
            if (blocker.brick === brick.brick) continue;
            if (blocker.aboves === undefined) {
                blocker.aboves = new Set();
            }
            if (
                blocker.z2 >= (brick.z1 - 1) && blocker.z1 <= (brick.z2 - 1) &&
                blocker.x2 >= brick.x1 && blocker.x1 <= brick.x2 &&
                blocker.y2 >= brick.y1 && blocker.y1 <= brick.y2
            ) {
                // collision
                brick.belows.add(blocker);
                blocker.aboves.add(brick);
            }
        }
    }

    let disintegrables = 0;
    for (const brick of bricks) {
        let safe = true;
        for (const above of brick.aboves) {
            if (above.belows.size <= 1) {
                safe = false;
            }
        }
        if (safe) {
            disintegrables++
        }
    }
    const part1 = disintegrables;

    const chainReaction = (brick) => {
        const allRemoved = new Set();
        allRemoved.add(brick);
        const brickQueue = [...brick.aboves];

        while (brickQueue.length) {
            const checkBrick = brickQueue.shift();
            let willFall = true;
            for (const below of checkBrick.belows) {
                if (allRemoved.has(below) === false) {
                    willFall = false;
                }
            }
            if (willFall === true) {
                allRemoved.add(checkBrick);
                brickQueue.push(...checkBrick.aboves);
            }
        }
        return allRemoved.size;
    }

    let totalReaction = 0;
    for (const brick of bricks) {
        totalReaction += chainReaction(brick) - 1;
    }

    const part2 = totalReaction;
    return [part1, part2];
}