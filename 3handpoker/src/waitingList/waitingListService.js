import {startGame} from './waitingListActions'
import {googleCloudURL} from '../common/constants'

export function fetchStartGame(pusher) {
  return dispatch => {
      fetch(`${googleCloudURL}/startGame`, 
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

export function populatePlayers(samplePlayer, pusher) {
    return dispatch => {
        fetch(`${googleCloudURL}/startGame/initiatePlayers`, 
        {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(samplePlayer),
            mode: 'no-cors' // 'cors' by default
          }
        )
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            return null;
            // return res.userName;
        })
        .catch(error => {
        })
    }
  }