export function addUser(userName) {
    return {
      type: 'ADD_USER',
      payload: {
          userName: userName
      }
    }
  }

export function changeToHost(selectValue){
    console.log("ACTION CALLED")
    return {
        type: 'CHANGE_TO_HOST',
        payload: {
          userType: 'Host',
          isHost: true
        }
      }
}
export function changeToUser(selectValue){
    return{
        type:"CHANGE_TO_USER",
        payload:{
            userType:'User',
            isHost: false
        }
    }
}
export function userEntered(){
    return{
        type:"ENTERED_USERNAME",
        payload:{
            hasEnteredUserName: true
        }
    }
}
export function isValidInput(validInputBool){
    return{
        type:"CHANGE_TO_USER",
        payload:{
            userType:'User',
            isHost: false
        }
    }
}