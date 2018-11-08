import boardgame from 'boardgame.io/core'
import {generate} from './deck'
import immer from 'immer'
import _ from 'lodash'

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
    moves:{
        play: produce((G,ctx,...cards)=>{
            const player = G.players[ctx.currentPlayer]
            // El número máximo de cartas a jugar el 4
            if (cards.length<1 || cards.lenght>4){
                return console.log('Número de cartas no está entre 1 y 4')
            }
            // Que el usuario tenga esas cartas
            if(_.intersection(player.hand, cards).length !== cards.length){
                return console.log('El usuario no tiene estas cartas')
            }
            // Que las cartas sean del mismo rank
            // El rango debe ser mayor que la anterior jugada, solo si no eres el primero en jugar
            // Quitar cartas de la mano
            // Guardar las cartas en match
            console.log(cards)
            console.log('ok')
        })
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
                    ctx.events.endPhase()
                })
            },
            {
                name: 'round',
                allowedMoves:['play']
            }
        ]
    }
})

export default game
