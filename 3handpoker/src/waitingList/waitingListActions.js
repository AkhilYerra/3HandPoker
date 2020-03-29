export const UPDATE_USER_LIST = 'UPDATE_USER_LIST'

export function updateUserList(listOfUsers) {
    return {
        type: UPDATE_USER_LIST,
        userNameList: listOfUsers
    }
}
