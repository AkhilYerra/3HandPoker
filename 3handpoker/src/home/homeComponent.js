import React from 'react';
import { Link, Redirect } from "react-router-dom";
import _ from 'lodash'
import {connect} from 'react-redux'
import {addUser, changeToHost, changeToUser,userEntered} from '../actions'

class Home extends React.Component {
    state = {
        username: '',
        isHost: false,
        buyInAmount: 0,
        hasEnteredUserName : false
    };
    changeUserType = (event) => {
        if (event.target.value === true || _.toUpper(event.target.value) === 'TRUE') {
            this.props.dispatch(changeToHost());
        } else {
            this.props.dispatch(changeToUser());
        }
    }

    enteredUserName = (event) => {
        this.props.dispatch(addUser(event.target.value));
        this.props.dispatch(userEntered());        
    }


    render() {
        if(this.props.hasEnteredUserName === true){
            return <Redirect to={`waiting/username/${this.state.username}`}/>
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
        hasEnteredUserName: state.hasEnteredUserName
    }
}

export default connect(mapStateToProps)(Home)
