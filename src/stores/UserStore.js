import { observable, action, computed } from 'mobx'
import {db} from '../firebase'

class UserStore {
  // to be implemented later on
  @observable user = {
    email: '',
    apps: []
  }

  @observable isLogin = false

  getUsersData = (key) => {
    db.ref('users/' + key).on('value', (snapshot) => {
      this.user.email = snapshot.val().email
      this.isLogin = true
    })
  }

  getAppsData = (key) => {
    db.ref('users/' + key + '/apps').once('value', (snap) => {
      snap.forEach(element => {
        this.user.apps.push(element.val())
      })
    })
  }

  register = (email, password) => {
    db.ref('users').push({
      email,
      password,
    })
  }

  @action
  registerApp = (key, payload) => {
    db.ref('users/' + key + '/apps').push(payload)
  }

  login = (email, password) => {
    db.ref('users').once('value', (snapshot) => {
      snapshot.forEach(element => {
        let getUser = element.val()
        if (getUser.email === email && getUser.password === password) {
          localStorage.setItem('userKey', element.key)
          this.getUsersData(localStorage.getItem('userKey'))
        }
      })
    })
  }

  @computed
  get appCount() {
    return this.registeredApps.length;
  }
}

export default new UserStore()