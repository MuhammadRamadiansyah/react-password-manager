import React, { Component } from 'react'
import './Modal.css'
import RegisterForm from './RegisterForm'

export default class Modal extends Component {

  componentDidMount() {
    var modal = document.getElementById('myModal')
    window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = "none";
      }
    }
  }
  openModal = () => {
    var modal = document.getElementById('myModal')
    modal.style.display = "block"
  }

  closeModal () {
    var modal = document.getElementById('myModal')
    modal.style.display = "none"
  }

  render () {
    return (
      <div>
        <button className="modalbtn" type="button" onClick={this.openModal}>Register</button>
        <button className="modalbtn" type="button" onClick={this.openModal}>Login</button>
        <div id="myModal" className="modal scale-up-center">
          <div className="modal-content">
            <RegisterForm />    
          </div>
        </div>
      </div>
    )
  }
}