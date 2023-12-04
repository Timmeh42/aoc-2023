module.exports = function (input) {
    let mode = 'new';
    let number = 0;
    let wins = [];
    let part1 = 0;
    let part2 = 0;
    let cardScore = 0;
    let multis = [];
    let cardNumber = 0;
    input = input + '\n';
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        if (char === 58) {
            if (number !== 0) {
                cardNumber = number;
                number = 0;
            }
            mode = 'wins';
            number = 0;
        } else if (char === 124) {
            mode = 'gets';
            number = 0;
        } else if (char >= 48 && char <= 57) {
            number *= 10;
            number += char - 48;
        } else if (char === 32 || char === 10) {
            if (mode === 'wins') {
                if (number !== 0) {
                    wins.push(number);
                    number = 0;
                }
            } else if (mode === 'gets') {
                if (number !== 0) {
                    for (const winNumber of wins) {
                        if (winNumber === number) {
                            cardScore += 1;
                        }
                    }
                    number = 0;
                }
                if (char === 10) {
                    if (cardScore !== 0) {
                        part1 += 2**(cardScore - 1);
                    }
                    const myMulti = (multis[cardNumber] || 0) + 1;
                    part2 += myMulti;
                    for (let i = 0; i <= cardScore; i++) {
                        multis[cardNumber + i] = (multis[cardNumber + i] || 0) + myMulti;
                    }
                    mode = 'new';
                    wins = [];
                    cardScore = 0;
                }
            }
        }
    }
    return [part1, part2];
}