module.exports = function (input) {
    const nodes = new Map();
    const lines = input.trim().split('\n');
    const height = lines.length;
    const width = lines[0].length;

    const makeNodeKey = ({ x, y }) => y * width + x;

    const makeStepKey = ({ x, y, dx, dy, streak }) => {
        let key = y;
        key = key * width + x;
        key = key * 10 + 1 + dx;
        key = key * 10 + 1 + dy;
        key = key * 10 + streak;
        return key;
    }

    const generateNextSteps = ({ x, y, dx, dy, streak }, ultraCrucibles = false) => {
        const nextSteps = [];
        if ((ultraCrucibles === true && streak < 9) || (ultraCrucibles === false && streak < 2)) {
            const forwardStep = {
                x: x + dx,
                y: y + dy,
                dx,
                dy,
                streak: streak + 1,
            };
            forwardStep.stepKey = makeStepKey(forwardStep);
            forwardStep.nodeKey = makeNodeKey(forwardStep);
            nextSteps.push(forwardStep);
        }

        if ((ultraCrucibles === true && streak >= 3) || ultraCrucibles === false) {
            const leftStep = {
                x: x + dy,
                y: y + -dx,
                dx: dy,
                dy: -dx,
                streak: 0,
            };
            leftStep.stepKey = makeStepKey(leftStep);
            leftStep.nodeKey = makeNodeKey(leftStep);
            nextSteps.push(leftStep);
    
            const rightStep = {
                x: x + -dy,
                y: y + dx,
                dx: -dy,
                dy: dx,
                streak: 0,
            };
            rightStep.stepKey = makeStepKey(rightStep);
            rightStep.nodeKey = makeNodeKey(rightStep);
            nextSteps.push(rightStep);
        }

        return nextSteps;
    }

    let lastKey;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x ++) {
            const key = makeNodeKey({ x, y });
            const cost = Number(lines[y][x]);
            nodes.set(key, { x, y, cost });
            lastKey = key;
        }
    }

    const processQueue = (queue, ultraCrucibles = false) => {
        const processed = new Set();
        while (queue.length) {
            const step = queue.shift();
    
            if (step.nodeKey === lastKey && (ultraCrucibles === false || step.streak >= 3)) {
                return step.cumulativeCost;
                break;
            }
    
            if (processed.has(step.stepKey)) {
                continue;
            }
    
            processed.add(step.stepKey);
    
            const nextSteps = generateNextSteps(step, ultraCrucibles);
            for (const nextStep of nextSteps) {
                if (nextStep.x < 0 || nextStep.y < 0 || nextStep.x >= width || nextStep.y >= height) {
                    continue;
                }
                const node = nodes.get(nextStep.nodeKey);
                const nextStepProspectiveCost = step.cumulativeCost + node.cost;
                if (nextStep.cumulativeCost === undefined || nextStep.cumulativeCost > nextStepProspectiveCost) {
                    nextStep.cumulativeCost = nextStepProspectiveCost;
                }
                if (processed.has(nextStep.stepKey) === false) {
                    const queueIndex = queue.findIndex((step) => step.cumulativeCost > nextStepProspectiveCost);
                    if (queueIndex >= 0) {
                        queue.splice(queueIndex, 0, nextStep);
                    } else {
                        queue.push(nextStep);
                    }
                }
            }
        }
    };

    const startRight = {
        x: 0,
        y: 0,
        dx: 1,
        dy: 0,
        streak: 0,
        nodeKey: 0,
        cumulativeCost: 0,
    };
    startRight.stepKey = makeStepKey(startRight);
    const startDown = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 1,
        streak: 0,
        nodeKey: 0,
        cumulativeCost: 0,
    };
    startDown.stepKey = makeStepKey(startDown);
    const part1 = processQueue([startRight, startDown]);
    const part2 = processQueue([startRight, startDown], true);

    return [part1, part2];
}
