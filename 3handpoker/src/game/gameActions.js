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

export function hasSeenCards(){
    return {
        type: constants.actions.CHANGE_TO_SEEN,
        hasSeen:true
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