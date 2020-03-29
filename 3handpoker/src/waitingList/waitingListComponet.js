import React from 'react';
import {beginGame} from '../actions'
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux'
import _ from 'lodash'
import {updateUserList} from '../waitingList/waitingListActions'
import Pusher from 'pusher-js';


var pusher = new Pusher('4edf52a5d834ee8fe586', {
  cluster: 'us2',
  forceTLS: true
});


class WaitingList extends React.Component {
    constructor(props) {
        super(props);
        console.log("AHOO")
        console.log(this.props);
        this.state.userNameList=  this.props.userNameList;
    }

    componentDidMount = () =>{
        
    }
    state = {
        isHost: false, 
        hasGameStarted: false,
        userNameList: []
    };
    enteredUserName = () => {
        this.props.dispatch(beginGame());
    }

    render() {
        if(this.props.hasGameStarted === true){
            return <Redirect to={`/game/${this.state.username}`}/>
        }
        if(!_.isUndefined(this.state.userNameList) && _.isUndefined(this.props.userNameList)){
            var namesList = this.state.userNameList.map(function(name){
                return <Name key={`${name}id`} nameOfUser={name}></Name>
            })    
        }
        if(!_.isUndefined(this.props.userNameList)){
            var namesList = this.props.userNameList.map(function(name){
                return <Name key={`${name}id`} nameOfUser={name}></Name>
            })    
        }
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
        userNameList : state.userNameList
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
