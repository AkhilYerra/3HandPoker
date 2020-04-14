const constants = require('../common/constants')

export function getAllPlayers(isHost, username, data){
    return{
        type: constants.actions.GET_ALL_PLAYERS,
        payload: {
            isHost: isHost,
            username: username,
            listOfAllPlayers: data
          }
    }
}

export function hasSeenCards(hasSeenStatus){
    return {
        type: constants.actions.CHANGE_TO_SEEN,
        hasSeen:hasSeenStatus
      }
}

export function hasFoldedRound(){
    return {
        type: constants.actions.CHANGE_TO_FOLDED,
        userFolded:true
      }
}

export function hasBet(amountBet, userAmount){
    return {
        type: constants.actions.CHANGE_BET_AMOUNT,
        amountBet:amountBet,
        userAmount : userAmount
      }
}

export function updateGameStatus(gameStatus){
    return{
        type: constants.actions.UPDATE_GAME_STATUS,
        gameStatus: gameStatus
    }
}

export function payPlayer(username, potAmount){
    return{
        type: constants.actions.PAY_WINNER
    }
}

export function getWinner(data){
    return{
        type: constants.actions.GET_WINNER,
        winnerData: data
    }
}

export function setHasWon(hasWon){
    return{
        type: constants.actions.SET_HAS_WON,
        hasWon: hasWon
    }
}

export function updateConsult(consultList){
    return{
        type: constants.actions.REVISE_CONSULT_LIST, 
        consultList : consultList
    }
}

export function getConsult(data){
    return{
        type: constants.actions.GET_CONSULT,
        consultDetails: data
    }
}

export function unConsult(data){
    return{
        type: constants.actions.UNCONSULT,
        gameStatus: data
    }
}