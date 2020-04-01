const constants = require('../common/constants')

export function startGame(){
    return{
        type: constants.actions.START_GAME
    }
}


export function usersStartGame(){
    return{
        type : constants.actions.START_GAME
    }

}