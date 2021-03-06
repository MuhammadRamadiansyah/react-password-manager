import React, { Component } from 'react'
import './NavbarHeader.css'
import Modal from './general/Modal'
import ModalAddList from './general/ModalAddList'
import SearchFeature from './general/SearchFeature'
import './general/Modal.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';
import swal from 'sweetalert'

@inject('UserStore')
@observer class NavbarHeader extends Component {

  UNSAFE_componentWillMount () {
    if(localStorage.getItem('userKey')) {
      UserStore.getUsersData(localStorage.getItem('userKey'))
      UserStore.getAppsData(localStorage.getItem('userKey'))
    }
  }

  logout = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Success logout!", {
          icon: "success",
        });
        localStorage.removeItem('userKey')
        UserStore.isLogin = false
      } else {
        swal("You are still login!");
      }
    })
    
  }

  submit = (e, payload) => {
    e.preventDefault()
    UserStore.searchData(payload)
  }

  render () {

    let isLogin = 
      <div>
        <ModalAddList logout = { this.logout }/>
      </div>
    return (
      <nav className="container-navbar">
        <div className="grid-item" 
             style={{
               padding: '8px'
             }}>Pass Manager Apps</div>
        <div className="grid-item search">
        {
            UserStore.isLogin?
            <SearchFeature submit={this.submit}/> : ''
        }  
        </div>   
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