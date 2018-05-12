import React, { Component } from 'react';
import Home from './components/Home'
import NavbarHeader from './components/NavbarHeader'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarHeader/>
        <Home />
      </div>
    );
  }
}

export default App;
