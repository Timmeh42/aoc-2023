module.exports = function (input) {
    let part1 = 0;
    let part2 = 0;
    const lineLength = input.search(/\n/) + 1;
    let currentNumber = 0;
    let currentNumberIndex = 0;
    let numberSearchStart = 0;
    const numbers = [];
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        // check if digit
        if (char >= 48 && char <= 57) {
            if (currentNumber === 0) {
                currentNumberIndex = i;
            }
            currentNumber = currentNumber * 10 + char - 48;
        } else {
            if (currentNumber !== 0) {
                numbers.push({value: currentNumber, seen: false, start: currentNumberIndex, end: currentNumberIndex + Math.floor(Math.log10(currentNumber))});
                currentNumber = 0;
            }
        }
    }
    
    let neighbourhoodStart = -lineLength - 2;
    let neighbourhoodEnd = lineLength;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        // check if symbol
        neighbourhoodStart += 1;
        neighbourhoodEnd += 1;
        if (char === 61 || char === 64 || char === 47 || (char >= 35 && char <= 45)) {
            let gearLinks = 0;
            let gearRatio = 1;
            for (let n = numberSearchStart; n < numbers.length; n++) {
                const number = numbers[n];
                if (neighbourhoodStart > number.end) {
                    numberSearchStart = n + 1;
                    continue;
                }
                if (neighbourhoodEnd < number.start) {
                    break;
                }
                if (
                    number.end === i - 1 ||
                    number.start === i + 1 ||
                    (number.end >= i - lineLength - 1 && number.start <= i - lineLength + 1) ||
                    (number.end >= i + lineLength - 1 && number.start <= i + lineLength + 1)
                ) {
                    gearLinks += 1;
                    if (gearLinks <= 2) {
                        gearRatio *= number.value;
                    }
                    if (number.seen === false) {
                        number.seen = true;
                        part1 += number.value;
                    }
                }
            }
            if (gearLinks === 2) {
                part2 += gearRatio;
            }
        }
    }
    return [part1, part2];
}