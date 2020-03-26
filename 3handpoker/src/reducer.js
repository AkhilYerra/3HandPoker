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
    if(action.type === 'ADD_USERNAME'){
        console.log("ADDED username in Reducer")
        return Object.assign({}, state,{
            userName: action.payload.userName
        })
    }
    if(action.type === 'ENTERED_USERNAME'){
        console.log("Submitted username in Reducer")
        return Object.assign({}, state,{
            hasEnteredUserName: true
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