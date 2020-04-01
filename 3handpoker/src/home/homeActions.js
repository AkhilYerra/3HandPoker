const constants = require('../common/constants')

export function addUserSuccess(userName) {
    return {
        type: constants.actions.ADD_USER_SUCCESS,
        userName: userName
    }
}

export function addUserError(error) {
    return {
        type: constants.actions.ADD_USER_ERROR,
        error: error
    }
}

export function getUsersSuccess(userNameList){
    return{
        type: constants.actions.GET_USER_SUCCESS,
        userNameList: userNameList
    }
}