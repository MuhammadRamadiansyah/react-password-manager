import React, { Component } from 'react'
import AddListForm from './AddListForm.jsx'
import './ModalAddList.css'

export default class Modal extends Component {

  componentDidMount() {
    var modal = document.getElementById('addListModal')
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      } 
    }
  }
  openModal = () => {
    // var modal = document.getElementById('addListModal')
    // modal.style.display = "block"
  }

  logout = () => {
    this.props.logout()
  }

  render () {
    return (
      <div>
        <button className="modalbtn" type="button" onClick={this.openModal}> Add List</button>
        <button type="button" 
                className="cancelbtn" 
                onClick={this.logout}
                style={{
                  margin: '0px 10px'
                }}> Logout </button> 
        <div id="addListModal" className="modal scale-up-center">
          <div className="modal-content">
            <AddListForm title="add"/>    
          </div>
        </div>
      </div>
    )
  }
}