import React, { Component } from 'react'
import './TableManager.css'

class TableManager extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <table>
        <thead className="header-table">
          <tr>
            <th>No</th>
            <th>Apps</th>
            <th>Email / Username</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
    );
  }
}

export default TableManager;