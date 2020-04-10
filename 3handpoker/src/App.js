import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './home/homeComponent';
import WaitingList from './waitingList/waitingListComponet'
import Game from './game/gameComponent';
import EndGame from './end/endComponent'
import {Provider} from 'react-redux'

class App extends React.Component {
  state = {
    username: 'djkds'
  };

  render() {

    return (
      <div>
        <h1>3 Hand Poker</h1>
        <BrowserRouter>
          <Route exact path="/"
            component={Home} />
          <Route path="/waiting/:userName"
            component={WaitingList} />
            <Route path="/game/:userName"
            component={Game} />
            <Route path="/endGame"
            component={EndGame} />
        </BrowserRouter>
      </div>
    );
  }

  enterGame(username) {
    this.setState({
      username: username
    });
  }

}

export default App;