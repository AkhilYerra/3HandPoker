import React from 'react';

export default class WaitingList extends React.Component {
    state = {
        username: '',
        hasEnteredUserName: false,
    };
    
    handleChange = (event) =>{
        console.log(event.target.value)
        this.setState({username: event.target.value});
    }
    enteredUserName = (event) =>{
        console.log(this.state.hasEnteredUserName)
        this.setState({hasEnteredUserName: true});
        console.log(this.state.hasEnteredUserName)
    }

    render() {
        return (
            <div className='RegisterScreen'>
            <h3> We on the Waiting List</h3>
            <input onChange={this.handleChange} value={this.state.username}></input>
            <button onClick={this.enteredUserName}>Submit</button>
            </div>
        );
    }

    
   
}

