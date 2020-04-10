import { getAllPlayers, updateGameStatus, payPlayer, getWinner } from './gameActions'
import _ from 'lodash'
const constant = require('../common/constants')


export function fetchAllPlayers(isHost, username, pusher) {
  return dispatch => {
    fetch('http://localhost:4000/allPlayers',
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
        console.log(`The Shuffle has been called`)
        pusher.bind('getAllPlayers', function (data) {
          console.log(data);
          dispatch(getAllPlayers(isHost, username, data))
        });
        pusher.bind('retrieveGameState', function (data) {
          console.log(data);
          dispatch(updateGameStatus(data))
        });
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
  console.log(body);
  return dispatch => {
    fetch('http://localhost:4000/makeMove',
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
        console.log(`The Shuffle has been called`)
        pusher.bind('getAllPlayers', function (data) {
          console.log(data);
          dispatch(getAllPlayers(isHost, username, data))
        });
        pusher.bind('retrieveGameState', function (data) {
          console.log(data);
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
  fetch('http://localhost:4000/payWinner',
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
  
  console.log(body)
  return dispatch => {
    fetch(`http://localhost:4000/getWinner/${playersInRound[0]}/${playersInRound[1]}?pressedShow=${username}`,
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
          console.log(data);
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
      console.log(data);
      dispatch(getWinner(data))
    });  
  }
}