import React, { Component } from 'react'
import './TableManager.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../../stores/UserStore';

@inject('UserStore')
@observer class TableManager extends Component {
  
  render() {
    let getData = this.props.user.apps.map( (element, index) => 
      <tr key={ index }>
        <th> {index + 1} </th>
        <th> {element.app } </th>
        <th> {element.email} </th>
        <th> {element.password} </th>
        <th> {UserStore.getDate(element.createdAt)} </th>
        <th> {UserStore.getDate(element.updatedAt)} </th>
        <th> 
          <i className="fa fa-eye" onClick = {this.props.look.bind(this, element)}></i>
          <span> | </span> 
          <i className="fa fa-edit" onClick = {this.props.edit.bind(this, element)}></i>
          <span> | </span> 
          <i className="fa fa-trash" onClick = {this.props.delete.bind(this, element)}></i>
        </th>
      </tr>
    )
    return (
      <table>        
        <thead className="header-table">
          <tr>
            <th>No</th>
            <th>URL</th>
            <th>Email</th>
            <th>Password</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
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