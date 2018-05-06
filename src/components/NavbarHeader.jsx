import React, { Component } from 'react'
import './NavbarHeader.css'
import Modal from './general/Modal'
import ModalAddList from './general/ModalAddList'
import './general/Modal.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';

@inject('UserStore')
@observer class NavbarHeader extends Component {

  UNSAFE_componentWillMount () {
    if(localStorage.getItem('userKey')) {
      UserStore.getUsersData(localStorage.getItem('userKey'))
      UserStore.getAppsData(localStorage.getItem('userKey'))
    }
  }

  logout = () => {
    localStorage.removeItem('userKey')
    UserStore.isLogin = false
  }

  render () {

    let isLogin = 
      <div>
        <ModalAddList logout = { this.logout }/>
      </div>
    return (
      <nav className="container-navbar">
        <div className="grid-item grow"><h4> Pass Manager</h4></div>
        <div className="grid-item modal-nav">
          {
            UserStore.isLogin?
            isLogin : <Modal/>
          }     
        </div>
      </nav>
    )
  }
}

export default NavbarHeader