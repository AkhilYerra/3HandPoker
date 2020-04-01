import {UPDATE_USER_LIST} from './waitingList/waitingListActions'
import {fetchAddedUser} from './home/homeService'
const constant = require('./common/constants');

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
    if(action.type === constant.actions.ADD_USER_SUCCESS){
        console.log("ADDED username in Reducer")
        return Object.assign({}, state,{
            userNameList: action.userName.arrayOfUsers,
            hasEnteredUserName: true, 
            hasGameStarted: false
        })
    }
    if(action.type === constant.actions.GET_USER_SUCCESS){
        console.log("RETRIEVED USER LIST in Reducer")
        console.log(action.userNameList);
        return Object.assign({}, state,{
            userNameList: action.userNameList.arrayOfUsers,
            hasEnteredHost: true,
            hasGameStarted: false
        })
    }
    if(action.type === constant.actions.START_GAME){
        console.log("Started Game in Reducer")
        return Object.assign({}, state,{
            hasGameStarted: true
        })
    }
    return state;
  }
  
  export default rootReducer;