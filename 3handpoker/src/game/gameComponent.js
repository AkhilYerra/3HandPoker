import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import {hasSeenCards, hasFoldedRound, hasBet} from './gameActions'
import { fetchAllPlayers, shuffle, fetchMakeMove} from './gameService'
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
        userNameList : [],
        userSeen: false, 
        userFolded: false,
        userAmount: 0.0, 
        betForRound:0.0 ,
        counterBet : 1,

    };
    componentDidMount = async () => {
        // await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher));
        if(this.props.isHost === true){
            console.log(this.state.userNameList)
            await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        }else{
            await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher))
        }
        
    }
    viewCards = async () =>{
        await this.props.dispatch(hasSeenCards());
        console.log(this.props.userSeen)
    }
    foldForGame = async () =>{
        await this.props.dispatch(hasFoldedRound());
        console.log(this.props.userFolded)
    }
    makeMove = async () =>{
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userSeen, this.props.userFolded, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
    }

    decrement = () =>{
        if(this.state.counterBet === 1){

        }else if(this.state.counterBet === 2){
            this.setState({counterBet : 1})
        }else if(this.state.counterBet === 4){
            this.setState({counterBet : 2})
        }else if(this.state.counterBet === 8){
            this.setState({counterBet : 4})
        }
    }

    increment = () =>{
        if(this.state.counterBet === 1){
            this.setState({counterBet : 2})
        }else if(this.state.counterBet === 2){
            this.setState({counterBet : 4})
        }else if(this.state.counterBet === 4){
            this.setState({counterBet : 8})
        }else if(this.state.counterBet === 8){
            
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
            // if(this.props.isHost === false){
            //     arrayOfUsers.push(this.props.otherPlayerList.Host);
            // }
            var otherPlayer = arrayOfUsers.map(function (otherUserObject) {
                    return <OtherUser key={`${otherUserObject.name}`} name={otherUserObject.name} hasSeen={otherUserObject.hasSeen} hasFolded={otherUserObject.hasFolded} amount={otherUserObject.amount['$numberDecimal']}></OtherUser>
            })
                  
        }
        if(!_.isUndefined(this.props.userInfo)){
            var cardsOfPlayer = this.props.userInfo.cards.map(function(card){
                return {suite:card.suite, value:card.value}
            })
        }
        return (
            <div className='Game Screen'>
                <h2>POKER ROOM</h2>
                {otherPlayer}
                {(!_.isUndefined(this.props.userInfo))?
            <Player key={`${this.props.userInfo.name}`} name={this.props.userInfo.name} hasSeen={this.props.userInfo.hasSeen} hasFolded={this.props.userInfo.hasFolded} amount={this.props.userInfo.amount['$numberDecimal']}></Player>:null}
                {(!_.isUndefined(this.props.userSeen) && this.props.userSeen === true)?
            cardsOfPlayer.map(card => {
                return (
                  <Card key={`${card.suite}${card.value}`} suite={card.suite} value={card.value} />
                );
              }):null}
                <button onClick={this.viewCards}>See Cards</button>
                <button onClick={this.decrement}>-</button>
                {this.state.counterBet}
                <button onClick={this.increment}>+</button>
                <button disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn)} onClick={this.makeMove}>Bet</button>
                <button onClick={this.foldForGame}>Fold</button>
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
        userNameList : state.userNameList,
        userSeen: state.userSeen, 
        userFolded: state.userFolded, 
        userAmount: state.userAmount
    }
}

export default connect(mapStateToProps)(Game)

const OtherUser = ({ name, hasSeen, hasFolded, amount}) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen===true?'hasSeen':'Blind'}
                {hasFolded===true?'Folded':'Playing'}
                {amount}
</h6>
        </div>
    );
};
const Player = ({ name, hasSeen, hasFolded, amount}) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen===true?'hasSeen':'Blind'}
                {hasFolded===true?'Folded':'Playing'}
                {amount}
</h6>
        </div>
    );
};
const Card = ({ suite, value }) => {
    let faceValue = ['A','2','3','4','5','6','7','8','9','10','J','Q','K', 'A']

    return (
        <div>
            <h6>{suite} - {faceValue[value-1]}</h6>
        </div>
    );
};