import React, { Component } from 'react'
import TableManager from './homes/TableManager'
import './general/Button.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';
import AddListForm from './general/AddListForm.jsx'
import './general/ModalAddList.css'
import LoginForm from './general/LoginForm.jsx'
import swal from 'sweetalert'

@inject('UserStore')
@observer class Home extends Component {
  constructor () {
    super()
    this.state = {
      email: '',
      password: '',
      app: '',
      key: ''
    }
  }
  
  componentDidMount() {
    var modal = document.getElementById('editListModal')
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      } 
    }
  }
  
  deleteApp = (app) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("Poof! Your file has been deleted!", {
          icon: "success",
        });
        UserStore.deleteApp(localStorage.getItem('userKey'), app['.key'])
      } else {
        swal("Your file is safe!");
      }
    })
  }

  editApp = (app) => {
    this.setState({
      email: app.email,
      password: app.password,
      app: app.app,
      key: app['.key'],
      realpsw: app.realPassword
    })
    var editModal = document.getElementById('editListModal')
    editModal.style.display = "block"
  }

  lookPassword = (app) => {
    let lowerCaseLetters = /[a-z]/g
    this.setState({
      email: app.email,
      password: app.password,
      app: app.app,
      key: app['.key']
    })
    if (!app.password.match(lowerCaseLetters)) {
      var loginModal = document.getElementById('loginModal')
      loginModal.style.display = "block"
    } else {
      UserStore.hiddenPassword(app)
    }
  }

  render() {
    return (
      <div>
         {
          UserStore.isLogin?
          <TableManager { ...UserStore } delete={ this.deleteApp } edit= {this.editApp} look = {this.lookPassword}/> : <h1>harus login dulu</h1>
        }
        <div id="editListModal" className="modal scale-up-center">
          <div className="modal-content">
            <AddListForm title="edit" data={this.state}/>    
          </div>
        </div>
        <div id="loginModal" className="modal scale-up-center">
          <div className="modal-content">
            <LoginForm title="look" data={this.state}/>
          </div>
        </div>     
      </div>
    );
  }
}

export default Home;