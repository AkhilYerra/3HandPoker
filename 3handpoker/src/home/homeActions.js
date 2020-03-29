export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_ERROR = 'ADD_USER_ERROR';

export function addUserSuccess(userName) {
    return {
        type: ADD_USER_SUCCESS,
        userName: userName
    }
}

export function addUserError(error) {
    return {
        type: ADD_USER_ERROR,
        error: error
    }
}
