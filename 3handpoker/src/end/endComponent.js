import React from 'react';
import { Link, Redirect } from "react-router-dom";
import _ from 'lodash'
import {connect} from 'react-redux'
  
class End extends React.Component {
    state = {
        username: '',
        isHost: false,
        buyInAmount: 15.0,
        hasEnteredUserName : false,
        hasEnteredHost: false,
        hasGameStarted: false, 
        userNameList : []
    };

    render() {
        return (
            <div className='EndScreen'>
                <h3> Game Has Ended</h3>
            </div>
        );
    }

}

function mapStateToProps(state){
    return{
    }
}

export default connect(mapStateToProps)(End)
