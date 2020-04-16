import { getAllPlayers, updateGameStatus, payPlayer, getWinner, setHasWon, getConsult } from './gameActions'
import _ from 'lodash'
import { store } from 'react-notifications-component';
import { googleCloudURL } from '../common/constants'
const constant = require('../common/constants')



export function fetchAllPlayers(isHost, username, pusher) {
  return dispatch => {
    fetch(`${googleCloudURL}/allPlayers`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('getAllPlayers', function (data) {
          //console.log(data);
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
  console.log(`isHost:${isHost}, username:${username}, users:${userNameList.length} shuffling now`)
  return dispatch => {
    fetch(`${googleCloudURL}/shuffle`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userNameList),
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        //console.log(`The Shuffle has been called`)
        pusher.bind('getAllPlayers', function (data) {
          console.log("PUSHER GETTING ALL PLAYERS");
          console.log(data);
          dispatch(getAllPlayers(isHost, username, data))
        });
        pusher.bind('retrieveGameState', function (data) {
          console.log("PUSHER GETTING GAME STATUS");
          console.log(data);
          dispatch(updateGameStatus(data))
        });
        dispatch(setHasWon(false))
        return '';
      })
      .catch(error => {
      })
  }
}

export function fetchMakeMove(username, userSeen, userFolded, counterBet, amount, isHost, pusher) {

  let body = {
    username: username,
    hasSeen: (userSeen === null || _.isUndefined(userSeen) ? false : userSeen),
    hasFolded: (userFolded === null || _.isUndefined(userFolded) ? false : userFolded),
    amount: (counterBet * 0.25),
    userAmount: Number(amount)
  }
  if (body.hasFolded === true) {
    body.amount = 0;
  }
  //console.log(body);
  return dispatch => {
    fetch(`${googleCloudURL}/makeMove`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        //console.log(`The Shuffle has been called`)
        pusher.bind('getAllPlayers', function (data) {
          //console.log(data);
          dispatch(getAllPlayers(isHost, username, data))
        });
        pusher.bind('retrieveGameState', function (data) {
          //console.log(data);
          dispatch(updateGameStatus(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}

export function payWinner(username, potAmount) {
  let sampleBody = {
    username: username,
    potAmount: potAmount
  }
  fetch(`${googleCloudURL}/payWinner`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleBody),
    }
  )
    .then(res => {
      if (res.error) {
        throw (res.error);
      }
      // dispatch(payPlayer(username, potAmount))
      return '';
    })
    .catch(error => {
    })
}

export function determineWinner(playersInRound, username, userBet, playerAmount, pusher){
  let body = {
    playerAmount: Number(playerAmount),
    potAmount: Number(userBet * 0.25)
  }
  
  //console.log(body)
  return dispatch => {
    fetch(`${googleCloudURL}/getWinner/${playersInRound[0]}/${playersInRound[1]}?pressedShow=${username}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('getWinner', function (data) {
          //console.log(data);
          dispatch(getWinner(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}

export function getAllPusher(pusher){
  return dispatch =>{
    pusher.bind('getWinner', function (data) {
      //console.log(data);
      dispatch(getWinner(data))
    });  
    pusher.bind('retrieveGameState', function (data) {
      //console.log(data);
      dispatch(updateGameStatus(data))
    });  
    pusher.bind('getConsult', function (data) {
      //console.log(data);
      dispatch(getConsult(data))
    });
  }
}

export function endGame(pusher){
  return dispatch => {
    fetch(`${googleCloudURL}/endGame`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('retrieveGameState', function (data) {
          //console.log(data);
          dispatch(updateGameStatus(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}

export function setWinnerIsTrue(pusher){
  return dispatch => {
    fetch(`${googleCloudURL}/fold`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('retrieveGameState', function (data) {
          //console.log(data);
          dispatch(updateGameStatus(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}

export function viewCards(username){
    fetch(`${googleCloudURL}/seeCards/${username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }

        return '';
      })
      .catch(error => {
      })
  }

export function consultWith(playerToConsult, username, amountBet, amountUserHas, pusher){
  let body = {
    pressedShow: username,
    amountPlayerHas: Number(amountUserHas),
    amountPlayerBet: Number(amountBet * 0.25)
  }
  //console.log(body)
  return dispatch => {
    fetch(`${googleCloudURL}/consult/${username}/${playerToConsult}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('getConsult', function (data) {
          dispatch(getConsult(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}

export function unConsult(consult, pusher){  
  //console.log(body)
  return dispatch => {
    fetch(`${googleCloudURL}/unConsult`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }
    )
      .then(res => {
        if (res.error) {
          throw (res.error);
        }
        pusher.bind('retrieveGameState', function (data) {
          //console.log(data);
          dispatch(unConsult(data))
        });
        return '';
      })
      .catch(error => {
      })
  }
}