import React, { Component } from 'react'
import './NavbarHeader.css'
import Modal from './general/Modal'
import './general/Modal.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';

@inject('UserStore')
@observer  class NavbarHeader extends Component {

  componentDidMount () {
    if(localStorage.getItem('user')) {
    }
  }

  logout = () => {
    localStorage.removeItem('user')
  }
  render () {

    let isLogin = 
      <div>
        <button type="button"> Add List </button> 
        <button type="button" 
                className="cancelbtn" 
                onClick={this.logout}
                style={{
                  margin: '0px 10px'
                }}> Logout </button> 
      </div>
    return (
      <nav className="container-navbar">
        <div className="grid-item grow"><h4> Pass Manager</h4></div>
        <div className="grid-item modal-nav">
          {
            localStorage.getItem('user')?
            isLogin : <Modal/>
          }     
        </div>
      </nav>
    )
  }
}

export default NavbarHeader