import React, { Component } from 'react'
import './RegisterForm.css'
import UserStore from '../../stores/UserStore';

class RegisterForm extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: ''
    }
  }

  closeModal () {
    var modal = document.getElementById('myModal')
    modal.style.display = "none"
  }

  handleChangeEmail = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      UserStore.newEmail = this.state.email
    })
    document.getElementById("message").style.display = "none";
  }

  handleChangePassword =(e) => {
    this.setState({
      password: e.target.value
    }, () => {
      UserStore.newPassword = this.state.password
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
    UserStore.register(this.state.email, this.state.password)
  }

  render() {
    return (
      <div>
        <div className="modal-header">
          <h1> Register Form </h1>
        </div>
        <form>
          <div className="container">
            <label htmlFor="email"><b>Email</b></label>
            <input type="text" id="newEmail" placeholder="Enter Email" onChange={ this.handleChangeEmail } name="email" required  value ={this.state.email}/>
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" id="newPassword" placeholder="Enter Password" onChange={ this.handleChangePassword } name="password" required value ={this.state.password}/>
            <div className="container actionButton">
              <button type="button" id="cancelBtn" onClick={ this.closeModal } className="cancelbtn">Cancel</button>
              <button type="submit" id="submitBtn" onClick= { this.handleSubmit } >Submit</button>
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

export default RegisterForm