import boardgame from 'boardgame.io/core'
import {generate} from './deck'

const game = boardgame.Game({
    setup: ctx => {
        const players = []
        
        for (let i=0; i<ctx.numPlayers;i++){
            players[i] = {
                hand: [],
            }
        }

        return {
            players,
            deck: generate()
        }
    },
    flow:{
        phases: [
            {
                name:'deal',
                onPhaseBegin(G,ctx){
                    return {
                        ...G,
                        deck: ctx.random.Shuffle(G.deck)
                    }
                }
            }
        ]
    }
})

export default game
