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
            userNameList: action.userNameList.arrayOfUsers,
            hasEnteredUserName: true, 
            hasGameStarted: false, 
            username: action.userName
        })
    }
    if(action.type === constant.actions.GET_USER_SUCCESS){
        console.log("RETRIEVED USER LIST in Reducer")
        console.log(action.buyInAmount);
        return Object.assign({}, state,{
            userNameList: action.userNameList.arrayOfUsers,
            hasEnteredHost: true,
            hasGameStarted: false,
            username: action.userName,
            buyInAmount : action.buyInAmount
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
        console.log(action.payload);
        let user = action.payload.username
        console.log(user);
        let listOfPlayers = Object.assign({}, action.payload.listOfAllPlayers.AllPlayers);
        console.log(listOfPlayers);
        let userInfo = listOfPlayers[user];
        console.log(userInfo);
        delete listOfPlayers[user];
        console.log(listOfPlayers)
        return Object.assign({}, state,{
            isHost: action.payload.isHost,
            username : action.payload.username,
            otherPlayerList : listOfPlayers,
            userInfo: userInfo
        })
    }
    if(action.type === constant.actions.CHANGE_TO_SEEN){
        return Object.assign({}, state,{
            userSeen : action.hasSeen,
        })
    }
    if(action.type === constant.actions.CHANGE_TO_FOLDED){
        return Object.assign({}, state,{
            userFolded : action.userFolded,
        })
    }
    if(action.type === constant.actions.CHANGE_BET_AMOUNT){
        let amountLeft = action.userAmount - (action.amountBet*0.25)
        console.log(amountLeft)
        return Object.assign({}, state,{
            userAmount : amountLeft,
        })
    }
    return state;
  }
  
  export default rootReducer;