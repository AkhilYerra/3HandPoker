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
        console.log(action.userNameList.arrayOfUsers);
        return Object.assign({}, state,{
            userNameList: action.userNameList.arrayOfUsers,
            hasEnteredUserName: true, 
            hasGameStarted: false, 
            username: action.userName
        })
    }
    if(action.type === constant.actions.GET_USER_SUCCESS){
        console.log("RETRIEVED USER LIST in Reducer")
        console.log(action.userNameList.arrayOfUsers);
        return Object.assign({}, state,{
            userNameList: action.userNameList.arrayOfUsers,
            hasEnteredHost: true,
            hasGameStarted: false,
            username: action.userName
        })
    }
    if(action.type === constant.actions.START_GAME){
        console.log("Started Game in Reducer")
        return Object.assign({}, state,{
            hasGameStarted: true
        })
    }
    if(action.type === constant.actions.GET_ALL_PLAYERS){
        console.log("Got All Players in Reducer");
        let user = action.payload.username
        let listOfPlayers = action.payload.listOfAllPlayers.AllPlayers;
        let userInfo = listOfPlayers[user];
        delete listOfPlayers[user];
        return Object.assign({}, state,{
            isHost: action.payload.isHost,
            username : action.payload.username,
            otherPlayerList : listOfPlayers,
            userInfo: userInfo
        })
    }
    return state;
  }
  
  export default rootReducer;