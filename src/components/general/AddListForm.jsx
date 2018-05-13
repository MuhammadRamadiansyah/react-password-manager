import React, { Component } from 'react'
import './AddListForm.css'
import { inject } from 'mobx-react';
import UserStore from '../../stores/UserStore';
import swal from 'sweetalert'
import localStorageMock from '../../LocalStorageMock'

class AddListForm extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: '',
      app: '',
      isPassword: false
    }
  }

  UNSAFE_componentWillUpdate (nextProps, prevState) {
    if (nextProps.data) {
      if (nextProps.data.email !== '') {
        this.setState({
          email: nextProps.data.email,
          password: nextProps.data.realpsw,
          app: nextProps.data.app
        }, () => {
        })
        nextProps.data.email = ''
      }
    }
  }
  closeModal = () => {
    var modal = document.getElementById(`${this.props.title}ListModal`)
    // modal.style.display = "none"
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    })
    // document.getElementById("message").style.display = "none";
  }

  passwordValidation = () => {
    let letter,
        capital,
        number,
        length,
        special
      if (this.props.title !== 'edit') {
        // document.getElementById("message").style.display = "block";
        letter = document.getElementById("letter");
        capital = document.getElementById("capital");
        number = document.getElementById("number");
        length = document.getElementById("length")
        special = document.getElementById("special")
      } else {
        // document.getElementById("editmessage").style.display = "block";
        letter = document.getElementById("editletter");
        capital = document.getElementById("editcapital");
        number = document.getElementById("editnumber");
        length = document.getElementById("editlength")
        special = document.getElementById("editspecial")
      }
      
      let lowerCaseLetters = /[a-z]/g;
      if(this.state.password.match(lowerCaseLetters)) {  
        // letter.classList.remove("invalid");
        // letter.classList.add("valid");
      } else {
        // letter.classList.remove("valid");
        // letter.classList.add("invalid");
      }
      
      // Validate capital letters
      let upperCaseLetters = /[A-Z]/g;
      if(this.state.password.match(upperCaseLetters)) {  
        // capital.classList.remove("invalid");
        // capital.classList.add("valid");
      } else {
        // capital.classList.remove("valid");
        // capital.classList.add("invalid");
      }
  
      // Validate numbers
      let numbers = /[0-9]/g;
      if(this.state.password.match(numbers)) {  
        // number.classList.remove("invalid");
        // number.classList.add("valid");
      } else {
        // number.classList.remove("valid");
        // number.classList.add("invalid");
      }

      // eslint-disable-next-line
      let specials = /[\'^£$%&*()}{@#~?><>,|=_+!-]/g;
      if(this.state.password.match(specials)) {  
        // special.classList.remove("invalid");
        // special.classList.add("valid");
      } else {
        // special.classList.remove("valid");
        // special.classList.add("invalid");
      }
      
      // Validate length
      if(this.state.password.length >= 8) {
        // length.classList.remove("invalid");
        // length.classList.add("valid");
      } else {
        // length.classList.remove("valid");
        // length.classList.add("invalid");
      }
  }

  handleChangePassword = (e) => {
    this.setState({
      password: e.target.value
    }, () => {
      this.passwordValidation()
    })

  }

  handleChangeAppName = (e) => {
    this.setState({
      app: e.target.value
    })
    // document.getElementById("message").style.display = "none";
  }

  clearForm () {
    this.setState({
      email: '',
      password: '',
      app: '',
      isPassword: false,
    })
  }

  validatePassword = (password) => {
    let lowerCaseLetters = /[a-z]/g;
    let upperCaseLetters = /[A-Z]/g;
    let numbers = /[0-9]/g;
    // eslint-disable-next-line
    let specials = /[\'^£$%&*()}{@#~?><>,|=_+!-]/g;

    if (password.match(lowerCaseLetters) && password.match(upperCaseLetters) && password.match(numbers) && password.match(specials) && password.length >= 8) {
      this.setState({
        isPassword: true
      })
      return true
    } else {
      this.setState({
        isPassword: false
      })
      return false
    }
      
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.closeModal()
    this.clearForm()
    let payload = {
      email: this.state.email,
      password: this.state.password,
      app: this.state.app
    }
    // document.getElementById("message").style.display = "none";
    if (this.validatePassword(payload.password)) {
      if (this.props.title === 'edit') {
        await UserStore.editApp(localStorageMock.getItem('userKey'), this.props.data.key, payload)
      } else {
        await UserStore.registerApp(localStorageMock.getItem('userKey'), payload)
      }
    } else {
      swal("Oops!", "Password not too strong!", "error")
    }
    
  }

  render() {

    return (
      <div>
        <div className="modal-header">
          <h1> { this.props.title.toUpperCase() } LIST FORM</h1>
        </div>
        <form>
          <div className="container">
            <label htmlFor="appName"><b>App Name</b></label>
            <input type="text" id="appName" placeholder="Enter your apps link" onChange={ this.handleChangeAppName } name="app" required  value ={this.state.app}/>
            <label htmlFor="email"><b>Email</b></label>
            <input type="text" id="appEmail" placeholder="Enter Email" onChange={ this.handleChangeEmail } name="email" required  value ={this.state.email}/>
            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" id="appPassword" placeholder="Enter Password" onChange={ this.handleChangePassword } name="password" required value ={this.state.password}/>
            <div className="container actionButton">
              <button type="button" onClick={ this.closeModal } className="cancelbtn">Cancel</button>
              <button type="submit" onClick= { this.handleSubmit } >Submit</button>
            </div>
          </div>
        </form>
        {
          this.props.title !== 'edit'?
          <div id="message">
            <h3>Password must contain the following:</h3>
            <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
            <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
            <p id="number" className="invalid">A <b>number</b></p>
            <p id="length" className="invalid">Minimum <b>8 characters</b></p>
            <p id="special" className="invalid">A <b>special character</b></p>
          </div> : <div id="editmessage">
            <h3>Password must contain the following:</h3>
            <p id="editletter" className="invalid">A <b>lowercase</b> letter</p>
            <p id="editcapital" className="invalid">A <b>capital (uppercase)</b> letter</p>
            <p id="editnumber" className="invalid">A <b>number</b></p>
            <p id="editlength" className="invalid">Minimum <b>8 characters</b></p>
            <p id="editspecial" className="invalid">A <b>special character</b></p>
          </div>
        }
        
      </div>
    );
  }
}

export default AddListForm