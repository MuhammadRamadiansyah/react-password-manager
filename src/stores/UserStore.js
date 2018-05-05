import { observable, action, computed } from 'mobx'
import {db} from '../firebase'

class UserStore {
  // to be implemented later on
  @observable registeredApps = []
  @observable user = {}

  @action
  registerApp = app  => {
    this.registeredApps.push(app);
  };

  getUsersData = () => {
    db.ref('users').on('value', function (snapshot) {
      console.log(snapshot.val())
    })
  }

  register = (email, password) => {
    db.ref('users').push({
      email,
      password,
      apps: []
    })
  }

  login = (email, password) => {
    db.ref('users').once('value', function (snapshot) {
      snapshot.forEach(element => {
        let getUser = element.val()
        if (getUser.email === email && getUser.password === password) {
          localStorage.setItem('user', email)
          this.user = email
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