import boardgame from 'boardgame.io/core'
import {generate, getRankFromCards} from './deck'
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
            lastPlayer: null,
            match: [],
            deck: generate(),
            podium: []
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
            const rank = getRankFromCards(cards)
            if (rank==null) {
                return console.log('Las cartas no son del mismo rango')
            }
            // El rango debe ser mayor que la anterior jugada, solo si no eres el primero en jugar
            if (G.match.length){
                const lastCards = G.match[G.match.length - 1]
                const lastRank = getRankFromCards(lastCards)
                if (rank <= lastRank){
                    return console.log ('rank is not bigger than match')
                }
                if (lastCards.lenght !== cards.lenght){
                    return console.log('num cards is not same as match')
                }
            }
            
            
            // Quitar cartas de la mano
            player.hand = player.hand.filter(card => !cards.includes(card))
            
            // Guardar las cartas en match
            G.match.push(cards)

            console.log(cards)
            console.log('ok')

            G.lastPlayer = ctx.currentPlayer

            ctx.events.endTurn()
        }),
        pass: produce((G,ctx) => {
            if (!G.match.length) return console.log('Tienes que echar idiota')
            ctx.events.endTurn()
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
                allowedMoves:['play','pass'],
                onPhaseBegin: produce((G, ctx)=>{
                    G.match = []
                    G.lastPlayer = null
                }),
                onTurnEnd: produce((G, ctx)=>{
                    if (G.podium.length ===ctx.numPlayers - 1){
                        G.podium.push(ctx.currentPlayer)
                        return ctx.events.endPhase('finish')
                    }
                }),
                onTurnBegin: produce ((G, ctx)=>{
                    // End turn if current is in poidum
                    if(G.podium.includes(ctx.currentPlayer)){
                        return ctx.events.endTurn()
                    }
                    if (ctx.currentPlayer === G.lastPlayer){
                        console.log('end phase')
                        ctx.events.endPhase('round')
                    }
                    // if last player is in podium, assign it to current
                    if (G.podium.includes(G.lastPlayer)){
                        G.lastPlayer = ctx.currentPlayer
                    }
                })
            }
        ]
    }
})

export default game
