import {getAllPlayers} from './gameActions'
import _ from 'lodash'

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
            console.log(data);
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
        method:'POST',
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
          }
          console.log(`The Shuffle has been called`)
          pusher.bind('getAllPlayers', function(data) {
            console.log(data);
            dispatch(getAllPlayers(isHost, username, data))
          });
          return '';
      })
      .catch(error => {
      })
  }
}

export function fetchMakeMove(username, userSeen, userFolded, counterBet, amount, isHost, pusher) {
  
  let body = {
    username:username,
    hasSeen:(userSeen===null || _.isUndefined(userSeen) ?false : userSeen),
    hasFolded:(userFolded===null || _.isUndefined(userFolded) ?false : userFolded),
    amount:(counterBet*0.25),
    userAmount:Number(amount)
  }
  console.log(body);
  return dispatch => {
      fetch('http://localhost:4000/makeMove', 
      {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body),
        mode: 'no-cors' // 'cors' by default
      }
      )
      .then(res => {
          if(res.error) {
              throw(res.error);
          }
          console.log(`The Shuffle has been called`)
          pusher.bind('getAllPlayers', function(data) {
            console.log(data);
            dispatch(getAllPlayers(isHost, username, data))
          });
          return '';
      })
      .catch(error => {
      })
  }
}