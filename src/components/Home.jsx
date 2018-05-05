import React, { Component } from 'react'
import TableManager from './homes/TableManager'
import './general/Button.css'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  
  render() {
    return (
      <div>
        <TableManager />
      </div>
    );
  }
}

export default Home;