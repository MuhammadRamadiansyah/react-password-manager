import React, { Component } from 'react'
import './LoginForm.css'
import { inject } from 'mobx-react';
import UserStore from '../../stores/UserStore';

@inject('UserStore')
class LoginForm extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }
  closeModal () {
    var modal = document.getElementById('loginModal')
    modal.style.display = "none"
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
    document.getElementById("message").style.display = "none";
  }

  handleChangePassword =(e) => {
    this.setState({
      password: e.target.value
    })
  }

  clearForm () {
    this.setState({
      email: '',
      password: ''
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.closeModal()
    this.clearForm()
    UserStore.login(this.state.email, this.state.password)
  }

  render() {
    return (
      <div>
        <div className="modal-header">
          <h1> Login Form </h1>
        </div>
        <form>
          <div className="container">
            <label htmlFor="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" onChange={ this.handleChangeEmail } name="email" required  value ={this.state.email}/>
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" onChange={ this.handleChangePassword } name="password" required value ={this.state.password}/>
            <div className="container actionButton">
              <button type="button" onClick={ this.closeModal } className="cancelbtn">Cancel</button>
              <button type="submit" onClick= { this.handleSubmit } >Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm