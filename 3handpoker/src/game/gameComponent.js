import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { hasSeenCards, hasFoldedRound, hasBet, setHasWon } from './gameActions'
import { fetchAllPlayers, shuffle, fetchMakeMove, payWinner, determineWinner, getAllPusher, endGame, setWinnerIsTrue } from './gameService'
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
        //console.log("Game Component Props")
        //console.log(this.props);
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
        userNameList: [],
        userSeen: false,
        userFolded: false,
        userAmount: 0.0,
        betForRound: 0.0,
        counterBet: 1,
        gameStatus: {},
        potAmount: 0.00,
        hasWon: false,
        twoPeopleLeft: false,
        winnerDetails: {}

    };
    componentDidMount = async () => {
        await this.props.dispatch(getAllPusher(pusher));
        await this.props.dispatch(setHasWon(false));
        // await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher));
        if (this.props.isHost === true) {
            //console.log(this.state.userNameList)
            await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        } else {
            await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher))
        }

    }
    viewCards = async () => {
        await this.props.dispatch(hasSeenCards(true));
        //console.log(this.props.userSeen)
    }
    foldForGame = async () => {
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userSeen, true, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
        //console.log(this.props.userFolded)
    }
    makeMove = async () => {
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userSeen, this.props.userFolded, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
    }

    decrement = () => {
        //console.log(this.props.gameStatus)
        if (this.state.counterBet === 1) {

        } else if (this.state.counterBet === 2) {
            this.setState({ counterBet: 1 })
        } else if (this.state.counterBet === 4) {
            this.setState({ counterBet: 2 })
        } else if (this.state.counterBet === 8) {
            this.setState({ counterBet: 4 })
        }
    }

    increment = () => {
        if (this.state.counterBet === 1) {
            this.setState({ counterBet: 2 })
        } else if (this.state.counterBet === 2) {
            this.setState({ counterBet: 4 })
        } else if (this.state.counterBet === 4) {
            this.setState({ counterBet: 8 })
        } else if (this.state.counterBet === 8) {

        }
    }

    shuffleRound = async () => {
        console.log("Round has ended. Cards are being shuffled");
        await this.props.dispatch(hasSeenCards(false));
        await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        if (this.props.gameStatus.hasWinner === false) {
            this.setState({ hasWon: false });
        }
        this.setState({ twoPeopleLeft: false });

    }

    show = async () => {
        console.log(`${this.state.username} has asked opponent to show cards`);
        await this.props.dispatch(determineWinner(this.props.gameStatus.playersInRound, this.state.username, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], pusher))
        setTimeout(async function () {
            await this.props.dispatch(hasSeenCards(false));
            await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        }.bind(this), 5000);
    }

    componentDidUpdate = async () => {
        

        if (!_.isUndefined(this.props.gameStatus)) {
            if (this.props.gameStatus.playersRemaining === 1 && this.props.gameStatus.playersInRound[0] === this.state.username && this.props.hasWon === false) {
                console.log(`${this.state.username} has folded and therefore default win`);
                await setWinnerIsTrue(pusher);
                await this.props.dispatch(setHasWon(true))
                if (this.props.gameStatus.hasWinner === true && this.props.hasWon === true) {
                    await payWinner(this.state.username, this.props.potAmount);
                }
                setTimeout(async function () {
                    await this.props.dispatch(hasSeenCards(false));
                    await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
                }.bind(this), 5000);
            }
        }

    }

    endGame = async () => {
        await this.props.dispatch(endGame(pusher));
    }

    render() {
        if (!_.isUndefined(this.props.gameStatus) && this.props.gameStatus.gameEnded === true) {
            return <Redirect to={{
                pathname: `/endGame`,
            }} />
        }
        if (!_.isUndefined(this.props.otherPlayerList) && !_.isUndefined(this.state.userNameList)) {
            let arrayOfUsers = [];
            for (let i = 0; i < this.state.userNameList.length; i++) {
                if (!_.isUndefined(this.props.otherPlayerList[this.state.userNameList[i]])) {
                    arrayOfUsers.push(this.props.otherPlayerList[this.state.userNameList[i]]);
                }
            }
            var otherPlayer = arrayOfUsers.map(function (otherUserObject) {
                return <OtherUser key={`${otherUserObject.name}`} name={otherUserObject.name} hasSeen={otherUserObject.hasSeen} hasFolded={otherUserObject.hasFolded} amount={otherUserObject.amount['$numberDecimal']}></OtherUser>
            })

        }
        if (!_.isUndefined(this.props.userInfo)) {
            var cardsOfPlayer = this.props.userInfo.cards.map(function (card) {
                return { suite: card.suite, value: card.value }
            })
        }
        return (
            <div className='Game Screen'>
                <h6>Pot : </h6>{(!_.isUndefined(this.props.potAmount)) ? this.props.potAmount : null}
                {!_.isUndefined(this.props.winnerDetails) && this.props.gameStatus.hasWinner === true ? <Winner key={`${this.state.username}${this.props.gameStatus.winner}`} winnerDetails={this.props.winnerDetails}></Winner> : null}
                {(!_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersRemaining == 1) ? <h6>{this.props.gameStatus.playersInRound[0]} has Won!</h6> : null}
                {otherPlayer}
                {(!_.isUndefined(this.props.userInfo)) ?
                    <Player key={`${this.props.userInfo.name}`} name={this.props.userInfo.name} hasSeen={this.props.userInfo.hasSeen} hasFolded={this.props.userInfo.hasFolded} amount={this.props.userInfo.amount['$numberDecimal']}></Player> : null}
                {(!_.isUndefined(this.props.userInfo) && this.props.userInfo.hasSeen === true ) ?
                    cardsOfPlayer.map(card => {
                        return (
                            <Card key={`${card.suite}${card.value}`} suite={card.suite} value={card.value} />
                        );
                    }) : null}
                <button onClick={this.viewCards}>See Cards</button>
                <button onClick={this.decrement}>-</button>
                {this.state.counterBet}
                <button onClick={this.increment}>+</button>
                <button disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.makeMove}>Bet</button>
                <button disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.foldForGame}>Fold</button>
                {(!_.isUndefined(this.props.isHost) && this.props.isHost === true) ?
                    <button onClick={this.shuffleRound}>Shuffle</button> : null}
                {(!_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersRemaining == 2 && this.props.gameStatus.playersInRound.includes(this.state.username) && this.state.userFolded === false) ?
                    <button onClick={this.show}>Show</button> : null}
                {(!_.isUndefined(this.props.isHost) && this.props.isHost === true) ?
                    <button onClick={this.endGame}>End Game</button> : null}
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
        userNameList: state.userNameList,
        userSeen: state.userSeen,
        userFolded: state.userFolded,
        userAmount: state.userAmount,
        gameStatus: state.gameStatus,
        potAmount: state.potAmount,
        winnerDetails: state.winnerDetails,
        hasWon: state.hasWon
    }
}

export default connect(mapStateToProps)(Game)

const OtherUser = ({ name, hasSeen, hasFolded, amount }) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen === true ? 'hasSeen' : 'Blind'}
                {hasFolded === true ? 'Folded' : 'Playing'}
                {amount}
            </h6>
        </div>
    );
};
const Player = ({ name, hasSeen, hasFolded, amount }) => {
    return (
        <div>
            <h3>{name}</h3>
            <h6>
                {hasSeen === true ? 'hasSeen' : 'Blind'}
                {hasFolded === true ? 'Folded' : 'Playing'}
                {amount}
            </h6>
        </div>
    );
};
const Card = ({ suite, value }) => {
    let faceValue = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    return (
        <div>
            <h6>{suite} - {faceValue[value - 1]}</h6>
        </div>
    );
};

const Winner = ({ winnerDetails }) => {
    return (
        <p>
            {winnerDetails.winner} won!. <br></br>{winnerDetails.firstPersonDetails.username} had a {winnerDetails.firstPersonDetails.hand}
            with a {winnerDetails.firstPersonDetails.cards[0].value} of {winnerDetails.firstPersonDetails.cards[0].suite},
            {winnerDetails.firstPersonDetails.cards[1].value} of {winnerDetails.firstPersonDetails.cards[1].suite},
            {winnerDetails.firstPersonDetails.cards[2].value} of {winnerDetails.firstPersonDetails.cards[2].suite}.
            <br></br>
            {winnerDetails.secondPersonDetails.username} had a {winnerDetails.secondPersonDetails.hand}
            with a {winnerDetails.secondPersonDetails.cards[0].value} of {winnerDetails.secondPersonDetails.cards[0].suite},
            {winnerDetails.secondPersonDetails.cards[1].value} of {winnerDetails.secondPersonDetails.cards[1].suite},
            {winnerDetails.secondPersonDetails.cards[2].value} of {winnerDetails.secondPersonDetails.cards[2].suite}.
        </p>
    )
}