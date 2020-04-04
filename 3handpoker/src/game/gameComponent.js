import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { fetchAllPlayers, shuffle} from './gameService'
import Pusher from 'pusher-js';
import _ from 'lodash'

var pusher = new Pusher('4edf52a5d834ee8fe586', {
    cluster: 'us2',
    forceTLS: true
});
pusher.subscribe('3HandPoker');

class Game extends React.Component {
    constructor(props) {
        super(props);
        console.log("Game Component Props")
        console.log(this.props);
        this.state.username = this.props.username;
        this.state.isHost = this.props.isHost;
        this.state.userNameList = this.props.userNameList;
    }
    state = {
        username: '',
        isHost: false,
        gameExited: false,
        userInfo: {},
        otherPlayerList: {},
        userNameList : []
    };
    componentDidMount = () => {
        this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher));
        if(this.props.isHost === true){
            this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        }
    }

    render() {
        if(!_.isUndefined(this.props.otherPlayerList) && !_.isUndefined(this.state.userNameList)){
            let arrayOfUsers = [];
            for(let i =0; i < this.state.userNameList.length; i++){
                if(!_.isUndefined(this.props.otherPlayerList[this.state.userNameList[i]])){
                    arrayOfUsers.push(this.props.otherPlayerList[this.state.userNameList[i]]);
                }
            }
            if(this.props.isHost === false){
                arrayOfUsers.push(this.props.otherPlayerList.Host);
            }
            console.log(arrayOfUsers)
            var otherPlayer = arrayOfUsers.map(function (otherUserObject) {
                    return <OtherUser key={`${otherUserObject.name}`} name={otherUserObject.name} hasSeen={otherUserObject.hasSeen} hasFolded={otherUserObject.hasFolded}></OtherUser>
            })    
        }
        return (
            <div className='Game Screen'>
                <h2>POKER ROOM</h2>
                {otherPlayer}
                {}
                {(!_.isUndefined(this.props.userInfo))?
            <Player key={`${this.props.userInfo.name}`} name={this.props.userInfo.name} hasSeen={this.props.userInfo.hasSeen} hasFolded={this.props.userInfo.hasFolded}></Player>:null}
                {/* {cardsInHand} */}
                <button>See Cards</button>
                <button>Bet</button>
                <button>Fold</button>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        otherPlayerList: state.otherPlayerList,
        userInfo: state.userInfo,
        isHost: state.isHost,
        username: state.username,
        userNameList : state.userNameList
    }
}

export default connect(mapStateToProps)(Game)

const OtherUser = ({ name, hasSeen, hasFolded }) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen===true?'hasSeen':'Blind'}
                {hasFolded===true?'Folded':'Playing'}
</h6>
        </div>
    );
};
const Player = ({ name, hasSeen, hasFolded }) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen===true?'hasSeen':'Blind'}
                {hasFolded===true?'Folded':'Playing'}
</h6>
        </div>
    );
};
const Card = ({ suite, number }) => {
    return (
        <div>
            <h6>{suite} - {number}</h6>
        </div>
    );
};