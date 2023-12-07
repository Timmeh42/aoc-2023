module.exports = function (input) {
    let hands = input
        .trim()
        .split('\n')
        .map((line) => {
            let [cards, bid] = line.split(' ');
            bid = parseInt(bid);
            const cardCounts = new Map();
            for (let c = 0; c < cards.length; c++) {
                const card = cards[c];
                cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
            }
            const orderedCardCounts = [...cardCounts.values()].sort().reverse()
            let rating1 = Math.max(...orderedCardCounts);
            if (rating1 >= 3) {
                rating1 += 2;
            }
            if (rating1 === 5 && orderedCardCounts[1] !== 2) {
                rating1 -= 1;
            }
            if (rating1 === 2 && orderedCardCounts[1] === 2) {
                rating1 += 1;
            }

            let rating2 = rating1;
            if (cardCounts.get('J') >= 4) { // four+ jokers: 5j = 7, 4j+1 = 7
                rating2 = 7;
            }
            if (cardCounts.get('J') === 3) { // three jokers: 3j+2 = 7, 3j+1 = 6
                rating2 = 7;
                if (orderedCardCounts[1] === 1) {
                    rating2 = 6;
                }
            }
            if (cardCounts.get('J') === 2) { // two jokers: 3+2j = 7, 2+2j = 6, 2j+1 = 4
                if (orderedCardCounts[0] === 3) {
                    rating2 = 7;
                } else if (orderedCardCounts[1] === 2) {
                    rating2 = 6;
                } else {
                    rating2 = 4;
                }
            }
            if (cardCounts.get('J') === 1) { // one joker: 4+1j = 7, 3+1j = 6, 2+2+1j = 5, 2+1j = 4, 1+1j = 2
                if (orderedCardCounts[1] === 1 && orderedCardCounts[0] <= 2) {
                    rating2 = orderedCardCounts[0] * 2;
                } else {
                    rating2 = orderedCardCounts[0] + 3;
                }
            }
            return { cards, bid, rating1, rating2 };
        });

    const sorter = (cardRanks, ratingLabel) => (hand1, hand2) => {
        if (hand1[ratingLabel] !== hand2[ratingLabel]) {
            return hand1[ratingLabel] - hand2[ratingLabel];
        } else {
            for (let c = 0; c < hand1.cards.length; c++) {
                if (hand1.cards[c] !== hand2.cards[c]) {
                    return cardRanks.indexOf(hand1.cards[c]) - cardRanks.indexOf(hand2.cards[c]);
                }
            }
        }
        return 0;
    };

    const part1 = hands
        .toSorted(sorter('23456789TJQKA', 'rating1'))
        .reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0)
        ;
    const part2 = hands
        .toSorted(sorter('J23456789TQKA', 'rating2'))
        .reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0)
        ;
    return [part1, part2];
}
