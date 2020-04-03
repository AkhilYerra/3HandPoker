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
