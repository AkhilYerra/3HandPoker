import {getAllPlayers} from './gameActions'

export function fetchAllPlayers(isHost, username, pusher) {
  return dispatch => {
      fetch('http://localhost:4000/allPlayers', 
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
          pusher.bind('getAllPlayers', function(data) {
            dispatch(getAllPlayers(isHost, username, data))
          });
          return null;
          // return res.userName;
      })
      .catch(error => {
        //   dispatch(addUserError(error));
      })
  }
}

export function shuffle(isHost, username, userNameList, pusher) {
  return dispatch => {
      fetch('http://localhost:4000/shuffle', 
      {
        method:'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userNameList),
        mode: 'no-cors' // 'cors' by default
      }
      )
      .then(res => {
          if(res.error) {
              throw(res.error);
          }pusher.bind('getAllPlayers', function(data) {
            dispatch(getAllPlayers(isHost, username, data))
          });
          return null;
      })
      .catch(error => {
      })
  }
}