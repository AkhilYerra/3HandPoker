import {ADD_USER_ERROR, ADD_USER_SUCCESS} from './home/homeActions';
import {UPDATE_USER_LIST} from './waitingList/waitingListActions'
import {fetchAddedUser} from './home/homeService'
const initialState = {
    isHost: false,
    userName: ''
  };
  
  function rootReducer(state = initialState, action) {
    if (action.type === 'CHANGE_TO_HOST') {
        console.log("Changed to Host In Reducer")
        return Object.assign({}, state, {
            isHost: true
          });
    }
    if (action.type === 'CHANGE_TO_USER') {
        console.log("Changed To User in Reducer")
        return Object.assign({}, state, {
            isHost: false
          });
    }
    if(action.type === ADD_USER_SUCCESS){
        console.log("ADDED username in Reducer")
        fetchAddedUser(action.userName)
        console.log(action.userName.arrayOfUsers);
        return Object.assign({}, state,{
            userNameList: action.userName.arrayOfUsers,
            hasEnteredUserName: true
        })
    }
    if(action.type === 'ENTERED_USERNAME'){
        console.log("Submitted username in Reducer")
        return Object.assign({}, state,{
            hasEnteredUserName: true
        })
    }
    if(action.type === UPDATE_USER_LIST){
        console.log("Updated User List")
        return Object.assign({}, state,{
            userNameList: action.userName
        })
    }
    if(action.type === 'START_GAME'){
        console.log("Started Game in Reducer")
        return Object.assign({}, state,{
            hasGameStarted: true
        })
    }
    return state;
  }
  
  export default rootReducer;