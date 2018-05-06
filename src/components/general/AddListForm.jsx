import React, { Component } from 'react'
import './AddListForm.css'
import { inject } from 'mobx-react';
import UserStore from '../../stores/UserStore';

@inject('UserStore')
class AddListForm extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: '',
      app: ''
    }
  }

  closeModal () {
    var modal = document.getElementById('addListModal')
    modal.style.display = "none"
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
    document.getElementById("message").style.display = "none";
  }

  handleChangePassword = (e) => {
    this.setState({
      password: e.target.value
    }, () => {
      document.getElementById("message").style.display = "block";

      let letter = document.getElementById("letter");
      let capital = document.getElementById("capital");
      let number = document.getElementById("number");
      let length = document.getElementById("length")
      let special = document.getElementById("special")
  
      let lowerCaseLetters = /[a-z]/g;
      if(this.state.password.match(lowerCaseLetters)) {  
        letter.classList.remove("invalid");
        letter.classList.add("valid");
      } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
      }
      
      // Validate capital letters
      let upperCaseLetters = /[A-Z]/g;
      if(this.state.password.match(upperCaseLetters)) {  
        capital.classList.remove("invalid");
        capital.classList.add("valid");
      } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
      }
  
      // Validate numbers
      let numbers = /[0-9]/g;
      if(this.state.password.match(numbers)) {  
        number.classList.remove("invalid");
        number.classList.add("valid");
      } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
      }

      // eslint-disable-next-line
      let specials = /[\'^£$%&*()}{@#~?><>,|=_+!-]/g;
      if(this.state.password.match(specials)) {  
        special.classList.remove("invalid");
        special.classList.add("valid");
      } else {
        special.classList.remove("valid");
        special.classList.add("invalid");
      }
      
      // Validate length
      if(this.state.password.length >= 8) {
        length.classList.remove("invalid");
        length.classList.add("valid");
      } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
      }
    })
    
  }

  handleChangeAppName = (e) => {
    this.setState({
      app: e.target.value
    })
    document.getElementById("message").style.display = "none";
  }

  clearForm () {
    this.setState({
      email: '',
      password: '',
      app: ''
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.closeModal()
    this.clearForm()
    let payload = {
      email: this.state.email,
      password: this.state.password,
      app: this.state.app
    }
    UserStore.registerApp(localStorage.getItem('userKey'), payload)
  }

  render() {
    return (
      <div>
        <div className="modal-header">
          <h1> Add List Form </h1>
        </div>
        <form>
          <div className="container">
            <label htmlFor="appName"><b>App Name</b></label>
            <input type="text" placeholder="Enter your apps link" onChange={ this.handleChangeAppName } name="app" required  value ={this.state.app}/>
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
        <div id="message">
          <h3>Password must contain the following:</h3>
          <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
          <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
          <p id="number" className="invalid">A <b>number</b></p>
          <p id="length" className="invalid">Minimum <b>8 characters</b></p>
          <p id="special" className="invalid">A <b>special character</b></p>
        </div>
      </div>
    );
  }
}

export default AddListForm