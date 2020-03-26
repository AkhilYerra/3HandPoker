import React from 'react';
import {beginGame} from '../actions'
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux'

class WaitingList extends React.Component {
    state = {
        username: 'Akhil',
        userNameList: ['Akhil', 'Manning', 'Lebron'],
        isHost: false, 
        hasGameStarted: false
    };
    
    enteredUserName = () => {
        this.props.dispatch(beginGame());
    }

    render() {
        if(this.props.hasGameStarted === true){
            return <Redirect to={`/game/${this.state.username}`}/>
        }
        var namesList = this.state.userNameList.map(function(name){
            return <Name key={`${name}id`} nameOfUser={name}></Name>
        })
        return (
            <div className='RegisterScreen'>
            <h3>{this.state.isHost===true? 'Once Ready Please Start Game' : 'Please Wait For Host to Start the Game'}</h3>
            <Name nameOfUser={namesList}></Name>
            <button onClick={this.enteredUserName}>Start Game</button>
            </div>
        );
    }
    
}

function mapStateToProps(state){
    return{
        hasGameStarted: state.hasGameStarted, 
    }
}

export default connect(mapStateToProps)(WaitingList)


const Name = ({ nameOfUser}) => {
    return (
      <div>
          <h3>{nameOfUser}</h3>
      </div>
    );
  };
