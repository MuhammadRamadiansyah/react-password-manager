import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';

@inject('UserStore')
@observer class LoginPage extends Component {
  
  render() {
    return (
      <h1>
        Halo { UserStore.appCount }
        HEY { JSON.stringify(UserStore.registeredApps)}
        <button onClick={ UserStore.registerApp.bind(this, 'aaapp') }> add app </button>
      </h1>
    );
  }
}

export default LoginPage;