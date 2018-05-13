import React, { Component } from 'react'
import './HomeAlert.css'

class HomeAlert extends Component {

  render() {
    return (
      <div className="home-alert">

        <h1>How To Use This Apps?</h1>

        <p>1. Login at the right corner of the window</p>

        <p>2. If you don't have an account, please register yourself</p>

        <p>3. You can add your application url, account or email, and also password</p>

        <p>4. You can also edit and delete your application list</p>

        <p>5. If you have probles please contact administrator!</p>

      </div>
    );
  }
}

export default HomeAlert;