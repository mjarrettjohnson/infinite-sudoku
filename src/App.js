import React, { Component } from 'react';
import { Game } from './components/game/game';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div class="container-fluid">
        <div class="row ">
          <Game />
          <Game />
          <Game />
        </div>
        <div class="row">
          <Game />
          <Game />
          <Game />
        </div>
      </div>
    );
  }
}

export default App;
