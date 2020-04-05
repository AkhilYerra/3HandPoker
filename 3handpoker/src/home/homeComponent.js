import React from 'react';
import { Link, Redirect } from "react-router-dom";
import _ from 'lodash'
import {connect} from 'react-redux'
import {addUser, changeToHost, changeToUser,userEntered} from '../actions'
import {addUserSuccess} from './homeActions'
import {fetchAddedUser, fetchUserList} from '../home/homeService'
import Pusher from 'pusher-js';
var pusher = new Pusher('4edf52a5d834ee8fe586', {
    cluster: 'us2',
    forceTLS: true
  });
  pusher.subscribe('3HandPoker');
  
class Home extends React.Component {
    state = {
        username: '',
        isHost: false,
        buyInAmount: 15.0,
        hasEnteredUserName : false,
        hasEnteredHost: false,
        hasGameStarted: false, 
        userNameList : []
    };
    handleChange = (event) => {
        if(event.target.value.length > 0 && this.state.isHost === false){
            this.setState({invalidInput : false});
        }else{
            this.setState({invalidInput : true});
        }
        this.setState({ username: event.target.value });
    }
    handleAmountChange = (event) =>{
        this.setState({ username: event.target.value });
    }
    changeUserType = (event) => {
        if (event.target.value === true || _.toUpper(event.target.value) === 'TRUE') {
            this.props.dispatch(changeToHost());
        } else {
            this.props.dispatch(changeToUser());
        }
    }

    enteredBuyInAmount = (event) =>{
        console.log(event.target.value)
        this.props.dispatch(fetchAddedUser('Admin', pusher));
        this.setState({buyInAmount : 15.0})
        this.props.dispatch(fetchUserList('Admin', pusher, 15.0));
    }

    enteredUserName = (event) => {
        this.props.dispatch(fetchAddedUser(this.state.username, pusher));
        // this.props.dispatch(userEntered());   
    }

    render() {
        if(this.props.hasEnteredUserName === true || this.props.hasEnteredHost === true){
            return <Redirect to={{
                pathname: `waiting/${this.state.username}`,
                state: {
                    isHost: this.props.isHost, 
                    buyInAmount: this.state.buyInAmount, 
                    hasGameStarted: false,
                    username: this.props.username, 
                    userNameList : this.props.userNameList
                }
            }}/>
        }
        return (
            <div className='RegisterScreen'>
                <h3> Please Enter Your Name and Buy In Amount</h3>
                <select id="userType" onChange={this.changeUserType}>
                    <option value="false">Choose Your Own Name</option>
                    <option value="true">Host</option>
                </select>
                {(this.state.isHost || this.props.isHost)? <input id='buyInAmountInput' type='number' onChange={this.handleAmountChange} value={this.state.username} placeholder="5"></input>
                : <input id='userNameInput' onChange={this.handleChange} value={this.state.username} placeholder="Akhil"></input>}
                {(this.state.isHost || this.props.isHost)? <button onClick={this.enteredBuyInAmount}>Submit Amount</button>
                : <button onClick={this.enteredUserName}>Submit</button>}
                
            </div>
        );
    }

}

function mapStateToProps(state){
    return{
        username: state.username,
        hasEnteredUserName: state.hasEnteredUserName,
        isHost : state.isHost,
        hasEnteredHost: state.hasEnteredHost,
        hasGameStarted: state.hasGameStarted,
        userNameList : state.userNameList, 
        buyInAmount: state.buyInAmount
    }
}

export default connect(mapStateToProps)(Home)
