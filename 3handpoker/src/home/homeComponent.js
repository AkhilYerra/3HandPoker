import React from 'react';
import { Link, Redirect } from "react-router-dom";
import _ from 'lodash'

export default class Home extends React.Component {
    state = {
        username: '',
        isHost: false,
        buyInAmount: 0,
        invalidInput: true, 
        hasEnteredUserName : false
    };

    handleChange = (event) => {
        console.log(event.target.value.length);
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
            this.setState({ isHost: true });
        } else {
            this.setState({ isHost: false });
        }
            this.setState({invalidInput : true});
    }

    enteredUserName = (event) => {
        console.log("ADJAOD")
        this.setState({ hasEnteredUserName: true });
        
    }



    render() {
        if(this.state.hasEnteredUserName === true){
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
                <button disabled={this.state.invalidInput} onClick={this.enteredUserName}>Submit</button>
            </div>
        );
    }



}

