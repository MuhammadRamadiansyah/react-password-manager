import React from 'react'
import './NavbarHeader.css'
import Modal from './general/Modal'
import './general/Modal.css'

export const NavbarHeader = () => (
  <nav className="container-navbar">
    <div className="grid-item grow"><h4>React Password Manager</h4></div>
    <div className="grid-item modal-nav"><Modal/></div>
  </nav>
)
