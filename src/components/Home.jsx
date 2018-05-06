import React, { Component } from 'react'
import TableManager from './homes/TableManager'
import './general/Button.css'
import { inject, observer } from 'mobx-react';
import UserStore from '../stores/UserStore';

@inject('UserStore')
@observer class Home extends Component {
  
  render() {
    return (
      <div>
         {
            UserStore.isLogin?
            <TableManager { ...UserStore } /> : <h1>harus login dulu</h1>
          }     
      </div>
    );
  }
}

export default Home;