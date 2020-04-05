import React from 'react';
import {startGame} from './waitingListActions'
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux'
import _ from 'lodash'
import Pusher from 'pusher-js';
import {fetchStartGame, populatePlayers} from './waitingListService'

var pusher = new Pusher('4edf52a5d834ee8fe586', {
  cluster: 'us2',
  forceTLS: true
});
pusher.subscribe('3HandPoker');

class WaitingList extends React.Component {
    constructor(props) {
        super(props);
        // console.log("AHOO")
        // console.log(this.props);
        this.state.isHost = this.props.isHost;
        this.state.buyInAmount = this.props.buyInAmount;
        this.state.hasGameStarted = this.props.hasGameStarted;
        this.state.username = this.props.username;
    }

    state = {
        isHost: false, 
        hasGameStarted: false,
        userNameList: [],
        buyInAmount: 0,
        username: ''
    };

    componentDidMount = () =>{
        if(this.state.isHost === false){
            pusher.bind('startGame', function(data) {
                this.setState({hasGameStarted : data.hasGameStarted});
              }.bind(this)
              )
              ;    
        }

    }

    startGameOnClick = () => {
            for(let i = 0; i < this.props.userNameList.length; i++){
                console.log(this.state.buyInAmount)
                //TODO:Change this from 15 to a dynamic value
                let samplePlayer = {
                    playerName : this.props.userNameList[i],
                    amount:15.00,
                }
                this.props.dispatch(populatePlayers(samplePlayer, pusher));
            }
        this.props.dispatch(fetchStartGame(pusher));
    }

    render() {
        if(this.props.hasGameStarted === true || this.state.hasGameStarted){
            return <Redirect to={{
                pathname: `/game/${this.state.username}`,
                state: { username: this.state.username,
                    isHost: this.props.isHost, 
                }
            }}/>
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
            {(!_.isUndefined(this.state.isHost) && this.state.isHost === true) ? <button onClick={this.startGameOnClick}>Start Game</button> : null}
            </div>
        );
    }
    
}

function mapStateToProps(state){
    return{
        hasGameStarted: state.hasGameStarted, 
        userNameList : state.userNameList, 
        isHost : state.isHost,
        username : state.username
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
