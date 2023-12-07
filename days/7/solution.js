module.exports = function (input) {
    let hands = input
        .trim()
        .replaceAll('T', 'B')
        .replaceAll('J', 'C')
        .replaceAll('Q', 'D')
        .replaceAll('K', 'E')
        .replaceAll('A', 'F')
        .split('\n').map((line) => {
            let [cards, bid] = line.split(' ');
            bid = parseInt(bid);
            const cardMap = { 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, B:0, C:0, D:0, E:0, F:0 };

            for (let c = 0; c < cards.length; c++) {
                const card = cards[c];
                cardMap[card] += 1;
            }
            let rating = 0;
            for (const cardCount of Object.values(cardMap)) {
                if (cardCount === 2) {
                    if (rating === 3) {
                        rating = 4;
                    } else if (rating === 1) {
                        rating = 2;
                    } else {
                        rating = 1;
                    }
                } else if (cardCount === 3) {
                    if (rating === 1) {
                        rating = 4;
                    } else {
                        rating = 3;
                    }
                } else if (cardCount === 4) {
                    rating = 5;
                } else if (cardCount === 5) {
                    rating = 6;
                }
            }
            return { cards, bid, rating };
        }
    );
    hands = hands.toSorted((hand1, hand2) => {
        if (hand1.rating !== hand2.rating) {
            return hand1.rating - hand2.rating;
        } else {
            for (let c = 0; c < hand1.cards.length; c++) {
                if (hand1.cards[c] !== hand2.cards[c]) {
                    return hand1.cards.charCodeAt(c) - hand2.cards.charCodeAt(c);
                }
            }
            return 0;
        }
    });
    const part1 = hands.reduce((sum, hand, h) => sum + hand.bid * (h+1), 0)




    
    let hands2 = input
        .trim()
        .replaceAll('T', 'B')
        .replaceAll('J', '0')
        .replaceAll('Q', 'D')
        .replaceAll('K', 'E')
        .replaceAll('A', 'F')
        .split('\n').map((line) => {
            let [cards, bid] = line.split(' ');
            bid = parseInt(bid);
const cardMap = { 0:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, B:0, D:0, E:0, F:0 };

for (let c = 0; c < cards.length; c++) {
    const card = cards[c];
    cardMap[card] += 1;
}
let rating = 0;
// console.log(cards)
for (const [card, cardCount] of Object.entries(cardMap)) {
    // console.log(card, cardCount, rating)
    if (card === '0') continue;
    if (cardCount === 1) {
        if (rating === 0 && cardMap['0'] === 1) rating = 1;
        if (rating < 3 && cardMap['0'] === 2) rating = 3;
        if (cardMap['0'] === 3) rating = 5;
        if (cardMap['0'] === 4) rating = 6;
    } else if (cardCount === 2) {
        if (cardMap['0'] === 3) {
            rating = 6
        } else if (cardMap['0'] === 2) {
            rating = 5
        } else if (rating === 3) {
            rating = 4;
        } else if (rating === 1) {
            rating = 2;
            if (cardMap['0'] === 1) rating = 3;
        } else {
            rating = 1;
            if (cardMap['0'] === 1) rating = 3;
        }
    } else if (cardCount === 3) {
        if (rating === 1) {
            rating = 4;
        } else {
            rating = 3;
        }
        if (cardMap['0'] === 1) rating = 5;
        if (cardMap['0'] === 2) rating = 6;
    } else if (cardCount === 4) {
        rating = 5;
        if (cardMap['0'] === 1) rating = 6;
    } else if (cardCount === 5) {
        rating = 6;
    }
}
if (cardMap['0'] === 5) rating = 6;
            return { cards, bid, rating };
        }
    );
    hands2 = hands2.toSorted((hand1, hand2) => {
        if (hand1.rating !== hand2.rating) {
            return hand1.rating - hand2.rating;
        } else {
            for (let c = 0; c < hand1.cards.length; c++) {
                if (hand1.cards[c] !== hand2.cards[c]) {
                    return hand1.cards.charCodeAt(c) - hand2.cards.charCodeAt(c);
                }
            }
            return 0;
        }
    });
    // for (const hand of hands2) {
    //     const realcards = hand.cards
    //         .replaceAll('B', 'T')
    //         .replaceAll('0', 'J')
    //         .replaceAll('D', 'Q')
    //         .replaceAll('E', 'K')
    //         .replaceAll('F', 'A')
    //     console.log(realcards + ' ' + hand.bid);
    // }
    const part2 = hands2.reduce((sum, hand, h) => sum + hand.bid * (h+1), 0)

    return [part1, part2];
}
