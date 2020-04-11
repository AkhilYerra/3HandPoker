import {addUserSuccess, addUserError, getUsersSuccess} from './homeActions';
import {googleCloudURL} from '../common/constants'





export function fetchAddedUser(username, pusher) {
    return dispatch => {
        fetch(`${googleCloudURL}/addUser`, 
        {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                playerName: username,
              }),
            mode: 'no-cors' // 'cors' by default
          }
        )
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            pusher.bind('retrieveUserList', function(data) {
              dispatch(addUserSuccess(username, data))
            });
            return null;
            // return res.userName;
        })
        .catch(error => {
            dispatch(addUserError(error));
        })
    }
}

export function fetchUserList(username, pusher, buyInAmount) {
  return dispatch => {
      fetch(`${googleCloudURL}/users`, 
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
          //console.log(buyInAmount)
          pusher.bind('retrieveUserList', function(data) {
            dispatch(getUsersSuccess(username, data, buyInAmount))
          });
          return null;
          // return res.userName;
      })
      .catch(error => {
          dispatch(addUserError(error));
      })
  }
}