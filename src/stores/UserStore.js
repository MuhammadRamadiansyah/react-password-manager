import { observable, computed } from 'mobx'
import {db} from '../firebase'

class UserStore {
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
    this.user.apps = []
    db.ref('users/' + key + '/apps').on('value', (snap) => {
      snap.forEach(element => {
        let getApp = element.val()
        getApp['.key'] = element.key
        let hiddenPsw = ''
        for (let i = 0; i < getApp.password.length; i++) {
          hiddenPsw += '*'
        }
        getApp.realPassword = getApp.password
        getApp.password = hiddenPsw
        this.user.apps.push(getApp)
      })
    })
  }

  searchData = (payload) => {
    this.getAppsData (localStorage.getItem('userKey'))
    var regex = new RegExp(payload, "g")
    let searchArr = []
    this.user.apps.forEach(element => {
      if (element.app.match(regex) || element.email.match(regex) || element.realPassword.match(regex)) {
        searchArr.push(element)
      }
    })
    this.user.apps = searchArr
  }
  register = (email, password) => {
    db.ref('users').push({
      email,
      password,
    })
  }

  registerApp = (key, payload) => {
    db.ref('users/' + key + '/apps').push(payload)
    this.getAppsData(key)
  }

  editApp = (key, keyApp, payload) => {
    db.ref('users/' + key + '/apps/' + keyApp).update(payload)
    this.getAppsData(key)
  }

  deleteApp = (key, appKey) => {
    db.ref(`users/${key}/apps/${appKey}`).remove()
    this.getAppsData(key)
  }

  login = (email, password) => {
    db.ref('users').once('value', (snapshot) => {
      snapshot.forEach(element => {
        let getUser = element.val()
        if (getUser.email === email && getUser.password === password) {
          localStorage.setItem('userKey', element.key)
          this.getUsersData(localStorage.getItem('userKey'))
          this.getAppsData(localStorage.getItem('userKey'))
        }
      })
    })
  }

  lookPassword = (email, password, appKey) => {
    db.ref('users').once('value', (snapshot) => {
      snapshot.forEach(element => {
        let getUser = element.val()
        if (getUser.email === email && getUser.password === password) {
          if (getUser.apps[appKey]) {
            let index = this.user.apps.findIndex(app => app['.key'] === appKey)
            let newData = getUser.apps[appKey]
            newData['.key'] = appKey
            newData.realPassword = getUser.apps[appKey].password
            this.user.apps.splice(index, 1, getUser.apps[appKey])
          }
        }
      })
    })
  }

  hiddenPassword = (data) => {
    let index = this.user.apps.findIndex(app => app['.key'] === data['.key'])
    let hiddenPsw = ''
    for (let i = 0; i < data.password.length; i++) {
      hiddenPsw += '*'
    }
    data.password = hiddenPsw
    this.user.apps.splice(index, 1, data)
  }

  @computed
  get appCount() {
    return this.registeredApps.length;
  }
}

export default new UserStore()