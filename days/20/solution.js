module.exports = function (input) {
    const modules = new Map();
    for (const line of input.trim().split('\n')) {
        const strings = line.split(/\b\W*/g);
        if (strings[0] === 'broadcaster') {
            const [name, ...outputs] = strings;
            const module = { type: 'B', name, outputs, inputs: {} };
            modules.set(name, module);
        } else {
            const [type, name, ...outputs] = strings;
            const module = { type, name, outputs, inputs: {} };
            modules.set(name, module);
        }
    }

    for (const module of modules.values()) {
        for (const output of module.outputs) {
            const outputModule = modules.get(output);
            if (outputModule !== undefined) {
                outputModule.inputs[module.name] = 0;
            }
        }
        if (module.name === 'kh') {
            module.loops = {};
        }
    }

    const messageQueue = [];

    let lows = 0;
    let highs = 0;
    let part1;
    let part2;
    for (let n = 1; true; n++) {
        messageQueue.push([0, 'broadcaster', 'button']);

        while (messageQueue.length) {
            const [pulse, destination, source] = messageQueue.shift();
            // console.log(pulse, destination, source);
            if (pulse === 1) {
                highs++;
            } else {
                lows++;
            }
            const module = modules.get(destination);
            if (module === undefined) continue;
    
            if (module.type === '%') {
                if (pulse === 0) {
                    module.state = module.state === 1 ? 0 : 1;
                    module.outputs.forEach((output) => messageQueue.push([module.state, output, module.name]));
                }
            } else if (module.type === '&') {
                module.inputs[source] = pulse;
                if (Object.values(module.inputs).every((pulse) => pulse === 1)) {
                    module.outputs.forEach((output) => messageQueue.push([0, output, module.name]));
                } else {
                    module.outputs.forEach((output) => messageQueue.push([1, output, module.name]));
                }
                if (module.outputs.includes('rx')) {
                    Object.entries(module.inputs).forEach(([k, v]) => {
                        if (v === 1 && module.loops[k] === undefined) {
                            module.loops[k] = n;
                        }
                    });
                    if (Object.keys(module.inputs).every((input) => module.loops[input] !== undefined)) {
                        part2 = Object.values(module.loops).reduce((mul, v) => mul * v);
                    }
                }
            } else if (module.type === 'B') {
                module.outputs.forEach((output) => messageQueue.push([pulse, output, module.name]));
            }
        }

        if (n === 999) {
            part1 = highs * lows;
        }
        if (part1 !== undefined && part2 !== undefined) {
            break;
        }
    }

    return [part1, part2];
}