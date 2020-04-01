import {startGame} from './waitingListActions'

export function fetchStartGame(pusher) {
  return dispatch => {
      fetch('http://localhost:4000/startGame', 
      {
          method:'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          mode: 'no-cors' // 'cors' by default
        }
      )
      .then(res => {
          if(res.error) {
              throw(res.error);
          }
          pusher.bind('startGame', function(data) {
            dispatch(startGame(data))
          });
          return null;
          // return res.userName;
      })
      .catch(error => {
        //   dispatch(addUserError(error));
      })
  }
}