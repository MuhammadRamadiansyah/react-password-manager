import React, { Component } from 'react';
import Home from './components/Home'
import { NavbarHeader } from './components/NavbarHeader'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarHeader />
        {/* <header className="App-header"> */}
          {/* <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1> */}
        {/* </header> */}
        <Home />
      </div>
    );
  }
}

export default App;
