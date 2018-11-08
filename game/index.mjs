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

                    G.deck.forEach((card,i)=>{
                        const playerId = i % ctx.numPlayers
                        G.players[playerId].hand.push(card)
                    })
                    G.deck = [] // vaciamos la baraja ya que en el culo se reparten todas las cartas, si fuera un juego de robar carta, podríamos mantenerlo
                })
            }
        ]
    }
})

export default game
