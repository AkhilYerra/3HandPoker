import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { hasSeenCards, hasFoldedRound, hasBet, setHasWon, updateConsult } from './gameActions'
import { fetchAllPlayers, shuffle, fetchMakeMove, payWinner, determineWinner, getAllPusher, endGame, setWinnerIsTrue, viewCards, unConsult, consultWith } from './gameService'
import Pusher from 'pusher-js';
import _ from 'lodash'
import { Modal, Button, ButtonGroup} from 'react-bootstrap';
import ReactNotification from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import './gameComponent.css';

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
        winnerDetails: {},
        consultList: [],
        showingConsultWindow: false,
        consultDetails: {}
    };
    componentDidMount = async () => {
        await this.props.dispatch(getAllPusher(pusher));
        this.setState({ hasWon: false });
        // await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher));
        if (this.props.isHost === true) {
            //console.log(this.state.userNameList)
            await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        } else {
            await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher))
        }

    }
    viewCards = async () => {
        await viewCards(this.state.username);
        //console.log(this.props.userSeen)
    }
    foldForGame = async () => {
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userInfo.hasSeen, true, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
        //console.log(this.props.userFolded)
    }

    foldAndEndRound = async () => {
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userInfo.hasSeen, true, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
        let losingUser = this.state.username;
        let winningUser = '';
        if (this.props.gameStatus.playersRemaining === 1) {
            winningUser = this.props.gameStatus.playersInRound[0];
        } else {
            let indexOfLose = this.props.gameStatus.playersInRound.indexOf(losingUser);
            if (indexOfLose === 1) {
                winningUser = this.props.gameStatus.playersInRound[0];
            } else {
                winningUser = this.props.gameStatus.playersInRound[1]
            }
        }
        console.log(this.props.potAmount);
        await payWinner(winningUser, this.props.potAmount);
        setTimeout(async function () {
            await this.props.dispatch(shuffle(this.props.isHost, this.state.username, this.state.userNameList, pusher));
        }.bind(this), 5000);

    }
    makeMove = async () => {
        await this.props.dispatch(fetchMakeMove(this.state.username, this.props.userInfo.hasSeen, this.props.userFolded, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], this.props.isHost, pusher));
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
        this.setState({ hasWon: false });
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


    endGame = async () => {
        await this.props.dispatch(endGame(pusher));
    }

    consult = async (consult) => {
        console.log(`consult with ${consult}`)
        await this.props.dispatch(consultWith(consult, this.state.username, this.state.counterBet, this.props.userInfo.amount['$numberDecimal'], pusher));
        this.setState({ showingConsultWindow: false })
        setTimeout(async function () {
            await this.props.dispatch(unConsult(false));
            await this.props.dispatch(fetchAllPlayers(this.state.isHost, this.state.username, pusher))
        }.bind(this), 5000);
    }

    showConsultWindow = async () => {
        this.setState({ showingConsultWindow: true })
    }

    hideConsultWindow = async () => {
        this.setState({ showingConsultWindow: false })

    }

    returnSuite = (suite) =>{
        if(_.toUpper(suite) === 'SPADE'){
            return '♠️'
        }
        if(_.toUpper(suite) === 'DIAMOND'){
            return '♦️'
        }
        if(_.toUpper(suite) === 'CLOVER'){
            return '♣️'
        }
        if(_.toUpper(suite) === 'HEART'){
            return '♥️'
        }
    }
    returnfaceValue = (number) =>{
        let faceValue = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        return faceValue[number -1];
    }
    componentDidUpdate(prevProps) {
        if (this.props.consultDetails !== prevProps.consultDetails){
            if(!_.isUndefined(this.props.consultDetails) && this.props.consultDetails.consultant !== this.state.username && this.props.consultDetails.consulter !== this.state.username){
                console.log("IN FIRST LOOP")
                store.addNotification({
                    title: `Consult`,
                    message: `${this.props.consultDetails.consulter} consulted ${this.props.consultDetails.consultant} and ${this.props.consultDetails.consultWinner} has won.`,
                    type: "default",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                  });
            }
            if(!_.isUndefined(this.props.consultDetails) && this.props.consultDetails.consultant === this.state.username){
                console.log("IN SECOND LOOP")
                let notificationType = 'danger';
                let message = `${this.props.consultDetails.consulter} had a ${this.props.consultDetails.firstPersonDetails.hand} which is BETTER than what you have and therefore you automatically drop.`;

                if(this.state.username === this.props.consultDetails.consultWinner){
                    notificationType = 'success'
                    message = `${this.props.consultDetails.consulter} had a ${this.props.consultDetails.firstPersonDetails.hand} which is WORSE than what you have and therefore ${this.props.consultDetails.consulter} automatically drops.`
                }
                store.addNotification({
                    title: `Consult`,
                    message: message,
                    type: notificationType,
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                  });
            }
            if(!_.isUndefined(this.props.consultDetails) && this.props.consultDetails.consulter === this.state.username){
                console.log("IN THIRD LOOP")
                let notificationType = 'danger';
                let message = `${this.props.consultDetails.consultant} had a ${this.props.consultDetails.secondPersonDetails.hand}. So you automatically drop.`;

                if(this.state.username === this.props.consultDetails.consultWinner){
                    notificationType = 'success'
                    message = `You have a better hand than ${this.props.consultDetails.consultant} so therefore ${this.props.consultDetails.consultant} automatically drops.`
                }
                store.addNotification({
                    title: `Consult`,
                    message: message,
                    type: notificationType,
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                  });
            }
        }

        if(this.props.winnerDetails !== prevProps.winnerDetails){
            store.addNotification({
                title: `Winner`,
                message: `${this.props.winnerDetails.winner} won!. \n ${this.props.winnerDetails.firstPersonDetails.username} had a ${this.props.winnerDetails.firstPersonDetails.hand}
                ${this.returnSuite(this.props.winnerDetails.firstPersonDetails.cards[0].suite)}${this.returnfaceValue(this.props.winnerDetails.firstPersonDetails.cards[0].value)},
                ${this.returnSuite(this.props.winnerDetails.firstPersonDetails.cards[1].suite)}${this.returnfaceValue(this.props.winnerDetails.firstPersonDetails.cards[1].value)},
                ${this.returnSuite(this.props.winnerDetails.firstPersonDetails.cards[2].suite)}${this.returnfaceValue(this.props.winnerDetails.firstPersonDetails.cards[2].value)}\n
                \n ${this.props.winnerDetails.secondPersonDetails.username} had a ${this.props.winnerDetails.secondPersonDetails.hand}
                ${this.returnSuite(this.props.winnerDetails.secondPersonDetails.cards[0].suite)}${this.returnfaceValue(this.props.winnerDetails.secondPersonDetails.cards[0].value)},
                ${this.returnSuite(this.props.winnerDetails.secondPersonDetails.cards[1].suite)}${this.returnfaceValue(this.props.winnerDetails.secondPersonDetails.cards[1].value)},
                ${this.returnSuite(this.props.winnerDetails.secondPersonDetails.cards[2].suite)}${this.returnfaceValue(this.props.winnerDetails.secondPersonDetails.cards[2].value)}\n
                `,
                type: "info",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
              });
        }

        if(!_.isUndefined(this.props.gameStatus) && !_.isUndefined(prevProps.gameStatus)){
            if(this.props.gameStatus.playersRemaining !== prevProps.gameStatus.playersRemaining){
                if(this.props.gameStatus.playersRemaining === 1 && this.props.gameStatus.playersInRound.length === 1){
                    store.addNotification({
                        title: `Winner`,
                        message: `${this.props.gameStatus.playersInRound[0]} has won!`,
                        type: "info",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                      });
                }

            }
        }
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
                return <OtherUser key={`${otherUserObject.name}`} name={otherUserObject.name} hasSeen={otherUserObject.hasSeen} hasFolded={otherUserObject.hasFolded} amount={otherUserObject.amount['$numberDecimal']} yourTurn={otherUserObject.isYourTurn}></OtherUser>
            })

        }
        if (!_.isUndefined(this.props.userInfo)) {
            var cardsOfPlayer = this.props.userInfo.cards.map(function (card) {
                return { suite: card.suite, value: card.value }
            })
        }
        return (
            <div className='Game Screen'>
                <ReactNotification />
                <h6>Pot : </h6>{(!_.isUndefined(this.props.potAmount)) ? this.props.potAmount : null}
                <div>
                {otherPlayer}
                </div>
                {(!_.isUndefined(this.props.userInfo)) ?
                    <Player key={`${this.props.userInfo.name}`} name={this.props.userInfo.name} hasSeen={this.props.userInfo.hasSeen} hasFolded={this.props.userInfo.hasFolded} amount={this.props.userInfo.amount['$numberDecimal']} yourTurn={this.props.userInfo.isYourTurn}></Player> : null}
                {(!_.isUndefined(this.props.userInfo) && this.props.userInfo.hasSeen === true) ?
                    cardsOfPlayer.map(card => {
                        return (
                            <Card key={`${card.suite}${card.value}`} suite={card.suite} value={card.value} />
                        );
                    }) : null}
                <ButtonGroup className="SeeCardsButtonGroup">
                <Button variant="primary" disabled={!(!_.isUndefined(this.props.userInfo) && !this.props.userInfo.hasSeen)} onClick={this.viewCards}>See Cards</Button>
                </ButtonGroup>
                <br></br>
                <ButtonGroup className="BetButtonGroup" aria-label="Basic example">
                <Button className="counterBetField" variant="danger" onClick={this.decrement}>-</Button>
                <div className="counterBetField counterBetInput">
                {this.state.counterBet}
                </div>
                <Button className="counterBetField" variant="success" onClick={this.increment}>+</Button>
                <Button className="counterBetField" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.makeMove}>Bet</Button>
                {!_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersInRound.length > 2 ?
                    <Button className="counterBetField" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn)
                        && this.state.userFolded === false} onClick={this.showConsultWindow}>Consult</Button> : null}
                {(!_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersRemaining == 2 && this.props.gameStatus.playersInRound.includes(this.state.username) && this.state.userFolded === false) ?
                    <Button className="counterBetField" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.show}>Show</Button> : null}
                </ButtonGroup>
                <br></br>
                <Modal show={this.state.showingConsultWindow} onHide={this.hideConsultWindow}>
                    <Modal.Header closebutton>
                        <Modal.Title>List Of Users to Consult</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {!_.isUndefined(this.props.gameStatus) ?
                    this.props.gameStatus.seenPlayersInRound.map(seenPlayer => {
                        if(seenPlayer != this.state.username){
                            return (
                                <div key={`Consult${seenPlayer}`} onClick={() => this.consult(seenPlayer)}> {seenPlayer}</div>
                            );    
                        }
                    }):null}
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
                <ButtonGroup className="AdminButtonGroup" aria-label="Basic example">
                {(!_.isUndefined(this.props.userInfo) && this.state.userFolded === false && !_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersRemaining > 2) ?
                    <Button className="AdminButtons" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.foldForGame}>Fold</Button> : null}
                {(!_.isUndefined(this.props.userInfo) && this.state.userFolded === false && !_.isUndefined(this.props.gameStatus) && this.props.gameStatus.playersRemaining == 2 && this.props.gameStatus.playersInRound.includes(this.state.username)) ?
                    <Button className="AdminButtons" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.foldAndEndRound}>FoldEnd</Button> : null}
                {(!_.isUndefined(this.props.isHost) && this.props.isHost === true) ?
                    <Button className="AdminButtons" variant="dark" disabled={!(!_.isUndefined(this.props.userInfo) && this.props.userInfo.isYourTurn) && this.state.userFolded === false} onClick={this.shuffleRound}>Shuffle</Button> : null}
                {(!_.isUndefined(this.props.isHost) && this.props.isHost === true) ?
                    <Button className="AdminButtons" variant="dark"onClick={this.endGame}>End Game</Button> : null}
                </ButtonGroup>
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
        hasWon: state.hasWon,
        consultList: state.consultList,
        consultDetails: state.consultDetails
    }
}

export default connect(mapStateToProps)(Game)

const OtherUser = ({ name, hasSeen, hasFolded, amount, yourTurn }) => {
    return (
        <div xs={10} sm={6} md={4} lg={3} xl={3}>
            <h3 style={yourTurn === true ? { color: 'green' } : null}>{name}{hasSeen === true ? '👀' : '😎'}{hasFolded === true ? '🚫' : '🃏'}</h3>
            <h6>
                {amount}
            </h6>
        </div>
    );
};
const Player = ({ name, hasSeen, hasFolded, amount, yourTurn }) => {
    return (
        <div xs={12} sm={12} md={12} lg={12} xl={12}>
            <h3 style={yourTurn === true ? { color: 'green' } : null}>{name}{hasSeen === true ? '👀' : '😎'}{hasFolded === true ? '🚫' : '🃏'}</h3>
            <h6>
                {amount}
            </h6>
        </div>
    );
};
const Card = ({ suite, value }) => {
    let faceValue = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    return (
        <div>
            <h4>
                {_.toUpper(suite) === 'SPADE' ? '♠️' : null}
                {_.toUpper(suite) === 'DIAMOND' ? '♦️' : null}
                {_.toUpper(suite) === 'CLOVER' ? '♣️' : null}
                {_.toUpper(suite) === 'HEART' ? '♥️' : null}
                {faceValue[value - 1]}</h4>
        </div>
    );
};

const Winner = ({ winnerDetails }) => {
    return (
        <p>
            {winnerDetails.winner} won!. <br></br>{winnerDetails.firstPersonDetails.username} had a {winnerDetails.firstPersonDetails.hand}
            <Card key={`${winnerDetails.firstPersonDetails.username}1`} suite={winnerDetails.firstPersonDetails.cards[0].suite} value={winnerDetails.firstPersonDetails.cards[0].value} />
            <Card key={`${winnerDetails.firstPersonDetails.username}2`} suite={winnerDetails.firstPersonDetails.cards[1].suite} value={winnerDetails.firstPersonDetails.cards[1].value} />
            <Card key={`${winnerDetails.firstPersonDetails.username}3`} suite={winnerDetails.firstPersonDetails.cards[2].suite} value={winnerDetails.firstPersonDetails.cards[2].value} />

            {winnerDetails.secondPersonDetails.username} had a {winnerDetails.secondPersonDetails.hand}
            <Card key={`${winnerDetails.secondPersonDetails.username}1`} suite={winnerDetails.secondPersonDetails.cards[0].suite} value={winnerDetails.secondPersonDetails.cards[0].value} />
            <Card key={`${winnerDetails.secondPersonDetails.username}2`} suite={winnerDetails.secondPersonDetails.cards[1].suite} value={winnerDetails.secondPersonDetails.cards[1].value} />
            <Card key={`${winnerDetails.secondPersonDetails.username}3`} suite={winnerDetails.secondPersonDetails.cards[2].suite} value={winnerDetails.secondPersonDetails.cards[2].value} />

        </p>
    )
}

const ConsultDetails = ({ consultDetails }) => {

    return (
        <div>
            {consultDetails.consulter} consulted {consultDetails.consultant} and {consultDetails.consultWinner} has won.`
        </div>

    )
}

const ConsultantDetails = ({ consultDetails, username }) => {
    console.log(consultDetails);
    let winnerOfConsult = false;
    if (username === consultDetails.consultWinner) {
        winnerOfConsult = true;
    }
    return (
        <div>
            {winnerOfConsult === true ?
                `${consultDetails.consulter} had a ${consultDetails.firstPersonDetails.hand} which is BETTER than what you have and therefore you automatically drop.` :
                `${consultDetails.consulter} had a ${consultDetails.firstPersonDetails.hand} which is WORSE than what you have and therefore ${consultDetails.consulter} automatically drops.`}
        </div>

    )
}
const ConsulterDetails = ({ consultDetails, username }) => {
    console.log(consultDetails);
    let winnerOfConsult = false;
    if (username === consultDetails.consultWinner) {
        winnerOfConsult = true;
    }
    return (
            <div>
                {winnerOfConsult === true ?
                    `You Won the Consult against ${consultDetails.consultant}` :
                    `${consultDetails.consultant} had a ${consultDetails.secondPersonDetails.hand} which is BETTER than what you have and therefore ${consultDetails.consulter} automatically drops.`}
         </div>
    )
}
