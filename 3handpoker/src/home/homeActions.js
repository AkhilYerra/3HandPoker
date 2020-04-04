const constants = require('../common/constants')

export function addUserSuccess(userName, usersList) {
    return {
        type: constants.actions.ADD_USER_SUCCESS,
        userName: userName,
        userNameList : usersList
    }
}

export function addUserError(error) {
    return {
        type: constants.actions.ADD_USER_ERROR,
        error: error
    }
}

export function getUsersSuccess(host, userNameList){
    return{
        type: constants.actions.GET_USER_SUCCESS,
        userNameList: userNameList, 
        userName: host
    }
}