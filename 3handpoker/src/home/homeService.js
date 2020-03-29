import {addUserSuccess, addUserError} from './homeActions';






export function fetchAddedUser(username, pusher) {
    return dispatch => {
        fetch('http://localhost:4000/addUser', 
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
            console.log(res);
            var channel = pusher.subscribe('3HandPoker');
            channel.bind('addPlayerToMongo', function(data) {
              console.log(JSON.stringify(data));
              dispatch(addUserSuccess(data))
            });
            return null;
            // return res.userName;
        })
        .catch(error => {
            dispatch(addUserError(error));
        })
    }
}
