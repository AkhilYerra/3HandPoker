import React from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'

class Game extends React.Component {
    state = {
        username: '',
        userNameList: ['Akhil', 'Manning', 'Lebron'],
        otherPlayerSample: {
            nameOfUser: 'Akhil',
            amountBet: 0.25,
            blindOrSeen: 'Seen',
            hasFolded: false
        },
        cards: [
            {
                suite: 'Heart',
                number:'5'
            },
            {
                suite: 'Spades',
                number:'3'
            },
            {
                suite: 'Diamond',
                number:'7'
            }
        ],
        isHost: false,
        gameExited: false,
    };

    render() {
        var cardsInHand = this.state.cards.map(function(card){
            return <Card key={`${card.suite}${card.number}`} suite={card.suite} number={card.number}></Card>
        })
        console.log(cardsInHand)
        return (
            <div className='Game Screen'>
                <h2>POKER ROOM</h2>
                <OtherUser nameOfUser={this.state.otherPlayerSample.nameOfUser}
                    amountBet={this.state.otherPlayerSample.amountBet}
                    blindOrSeen={this.state.otherPlayerSample.blindOrSeen}
                    hasFolded={this.state.otherPlayerSample.hasFolded}
                ></OtherUser>
                <Player userName={this.state.userName}></Player>
        {cardsInHand}
        <button>See Cards</button>
        <button>Bet</button>
        <button>Fold</button>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        username: state.username,
        hasEnteredUserName: state.hasEnteredUserName
    }
}

export default connect(mapStateToProps)(Game)

const OtherUser = ({ nameOfUser, amountBet, blindOrSeen, hasFolded }) => {
    return (
        <div>
            <h3>{nameOfUser}</h3>
            <h6>{amountBet}
                <br></br>{blindOrSeen}
                <br></br>{hasFolded}</h6>
        </div>
    );
};
const Player = ({ nameOfUser, amountBet, blindOrSeen, hasFolded }) => {
    return (
        <div>
            <h3>{nameOfUser}</h3>
            <h6>{amountBet}
                <br></br>{blindOrSeen}
                <br></br>{hasFolded}</h6>
        </div>
    );
};
const Card = ({ suite, number}) => {
    return (
        <div>
            <h6>{suite} - {number}</h6>
        </div>
    );
};