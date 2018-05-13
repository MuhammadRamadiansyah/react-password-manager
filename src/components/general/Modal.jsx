import React, { Component } from 'react'
import './Modal.css'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { inject } from 'mobx-react';

inject('UserStore')
export default class Modal extends Component {

  // componentDidMount() {
  //   var modal = document.getElementById('myModal')
  //   var loginModal = document.getElementById('loginModal')
  //   window.onclick = function(event) {
  //     if (event.target === modal) {
  //       // modal.style.display = "none";
  //     } else if (event.target === loginModal) {
  //       // loginModal.style.display = "none";
  //     }
  //   }
  // }
  openModal = () => {
    // var modal = document.getElementById('myModal')
    // modal.style.display = "block"
  }

  openLoginModal = () => {
    var modal = document.getElementById('loginModal')
    // modal.style.display = "block"
  }

  render () {
    return (
      <div>
        <button className="modalbtn" id="openRegister" type="button" onClick={this.openModal}>Register</button>
        <button className="modalbtn" id="openLogin" type="button" onClick={this.openLoginModal}>Login</button>
        <div id="myModal" className="modal scale-up-center">
          <div className="modal-content">
            <RegisterForm />    
          </div>
        </div>
        <div id="loginModal" className="modal scale-up-center">
          <div className="modal-content">
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }
}