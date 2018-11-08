const SUITS = ['O','C','E','B']
const RANKS = ['2','3','4','5','6','7','S','C','R','1']

export function generate(){
    return SUITS.reduce(
        (deck, suit) => 
            RANKS.reduce((deck, rank) => 
                deck.concat(rank + suit), deck),
            []
    )
}