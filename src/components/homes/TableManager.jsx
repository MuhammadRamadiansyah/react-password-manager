import React, { Component } from 'react'
import './TableManager.css'

class TableManager extends Component {
  
  render() {
    let getData = this.props.user.apps.map( (element, index) => 
      <tr key={ index }>
        <th> {index + 1} </th>
        <th> {element.app } </th>
        <th> {element.email} </th>
        <th> {element.password} </th>
        <th> Actions </th>
      </tr>
    )
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
          { getData }
        </tbody>
    </table>
    );
  }
}

export default TableManager;