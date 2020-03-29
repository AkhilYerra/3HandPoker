import React from 'react';
import { Link, Redirect } from "react-router-dom";
import _ from 'lodash'
import {connect} from 'react-redux'
import {addUser, changeToHost, changeToUser,userEntered} from '../actions'
import {addUserSuccess} from './homeActions'
import {fetchAddedUser} from '../home/homeService'
import Pusher from 'pusher-js';
var pusher = new Pusher('4edf52a5d834ee8fe586', {
    cluster: 'us2',
    forceTLS: true
  });
  
class Home extends React.Component {
    state = {
        username: '',
        isHost: false,
        buyInAmount: 0,
        hasEnteredUserName : false,
        userNameList: []
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
        if(event.target.value > 0 && this.state.isHost === true){
            this.setState({invalidInput : false});
        }else{
            this.setState({invalidInput : true});
        }
    }
    changeUserType = (event) => {
        if (event.target.value === true || _.toUpper(event.target.value) === 'TRUE') {
            this.props.dispatch(changeToHost());
        } else {
            this.props.dispatch(changeToUser());
        }
    }

    testButton = (event) =>{
        this.props.dispatch(fetchAddedUser(this.state.username, pusher));
    }

    enteredUserName = (event) => {
        this.props.dispatch(fetchAddedUser(this.state.username, pusher));
        // this.props.dispatch(userEntered());   
    }


    render() {
        if(this.props.hasEnteredUserName === true){
            console.log(this.props.userNameList);
            return <Redirect to={{
                pathname: `waiting/${this.state.username}`,
                state: { userNameList: this.props.userNameList }
            }}/>
        }
        return (
            <div className='RegisterScreen'>
                <h3> Please Enter Your Name and Buy In Amount</h3>
                <select id="userType" onChange={this.changeUserType}>
                    <option value="false">Choose Your Own Name</option>
                    <option value="true">Host</option>
                </select>
                {this.state.isHost ? <input id='buyInAmountInput' type='number' onChange={this.handleAmountChange} value={this.state.username} placeholder="5"></input>
                : <input id='userNameInput' onChange={this.handleChange} value={this.state.username} placeholder="Akhil"></input>}
                <button onClick={this.enteredUserName}>Submit</button>
            </div>
        );
    }

}

function mapStateToProps(state){
    return{
        username: state.username,
        hasEnteredUserName: state.hasEnteredUserName,
        userNameList: state.userNameList,
        isHost : state.isHost
        
    }
}

export default connect(mapStateToProps)(Home)
