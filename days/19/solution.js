module.exports = function (input) {
    const [workflowsString, partsString] = input.trim().split('\n\n');
    const workflows = Object.fromEntries(workflowsString.split('\n')
        .map((str) => {
            [label, ...conditions] = str.slice(0, -1).split(/[{},]/g);
            conditions = conditions.map((condition) => {
                [first, symbol, value, colon, destination] = condition.split(/\b/g);
                if (symbol === undefined) {
                    return first;
                } else {
                    return [
                        first,
                        symbol,
                        Number(value),
                        destination,
                    ];
                }
            });
            return [ label, conditions ];
        }));
        
    const parts = partsString.split('\n')
        .map((partString) => 
            Object.fromEntries(partString.slice(1, -1).split(',').map((valString) => {
                const [key, value] = valString.split('=');
                return [key, Number(value)];
            }))
        );

    const rejections = [];
    const acceptions = [];

    for (const part of parts) {
        let workflow = workflows.in;
        theloop:
        while (true) {
            for (const condition of workflow) {
                let result;
                if (Array.isArray(condition)) {
                    if (condition[1] === '>') {
                        if (part[condition[0]] > condition[2]) {
                            result = condition[3];
                        } else {
                            continue
                        }
                    } else {
                        if (part[condition[0]] < condition[2]) {
                            result = condition[3];
                        } else {
                            continue
                        }
                    }
                } else {
                    result = condition;
                }
                
                if (result === 'R') {
                    rejections.push(part);
                    break theloop;
                } else if (result === 'A') {
                    acceptions.push(part);
                    break theloop;
                } else {
                    workflow = workflows[result];
                    break;
                }
            }
        }
    }
    const part1 = acceptions.reduce((sum, part) => sum + part.x + part.m + part.a + part.s, 0)

    const generateResultSpace = (workflow, existingResultSpace) => {
        existingResultSpace = { ...existingResultSpace };
        const resultSpace = [];
        for (const condition of workflow) {
            if (Array.isArray(condition)) {
                const key = condition[0];
                const symbol = condition[1];
                const value = condition[2] + (symbol === '>' ? 1 : 0);
                const currentLimitSet = existingResultSpace[key];
                let lowerLimitSet = [currentLimitSet[0], value - 1];
                let upperLimitSet = [value, currentLimitSet[1]];

                if (symbol === '<') {
                    newResultsSpace = {...existingResultSpace, [key]: lowerLimitSet};
                    existingResultSpace[key] = upperLimitSet;
                    if (condition[3] === 'R') {
                        // reject
                    } else if (condition[3] === 'A') {
                        resultSpace.push(newResultsSpace);
                    } else {
                        resultSpace.push(...generateResultSpace(workflows[condition[3]], newResultsSpace));
                    }
                } else if (symbol === '>') {
                    newResultsSpace = {...existingResultSpace, [key]: upperLimitSet};
                    existingResultSpace[key] = lowerLimitSet;
                    if (condition[3] === 'R') {
                        // reject
                    } else if (condition[3] === 'A') {
                        resultSpace.push(newResultsSpace);
                    } else {
                        resultSpace.push(...generateResultSpace(workflows[condition[3]], newResultsSpace));
                    }
                }
            } else {
                if (condition === 'R') {
                    // rejected
                } else if (condition === 'A') {
                    resultSpace.push(existingResultSpace);
                } else {
                    resultSpace.push(...generateResultSpace(workflows[condition], existingResultSpace))
                }
            }
        }
        return resultSpace;
    }

    limits = { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]};
    const resultSpaces = generateResultSpace(workflows.in, limits);
    part2 = resultSpaces.reduce((sum, space) => sum + (1 + space.x[1] - space.x[0]) * (1 + space.m[1] - space.m[0]) * (1 + space.a[1] - space.a[0]) * (1 + space.s[1] - space.s[0]), 0);

    return [part1, part2]
}