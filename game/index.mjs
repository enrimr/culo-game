import boardgame from 'boardgame.io/core'
import {generate} from './deck'
import immer from 'immer'

const {produce} = immer

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
                onPhaseBegin :produce((G,ctx)=>{
                    G.deck = ctx.random.Shuffle(G.deck)
                })
            }
        ]
    }
})

export default game
