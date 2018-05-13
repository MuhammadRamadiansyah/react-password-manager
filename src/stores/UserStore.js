import { observable, computed } from 'mobx'
import {db, firebase} from '../firebase'
import swal from 'sweetalert'
import localStorageMock from '../LocalStorageMock'

class UserStore {
  @observable user = {
    email: '',
    apps: []
  }
  @observable userKey = ''
  @observable newEmail = ''
  @observable newPassword = ''
  
  @observable isLogin = false

  getUsersData = (key) => {
    return new Promise((resolve, reject) => {
      db.ref('users/' + key).on('value', (snapshot) => {
        this.user.email = snapshot.val().email
        this.isLogin = true
        resolve()
      })
    })
  }
  getAppsData = (key) => {

    return new Promise((resolve, reject) => {
      this.user.apps = []
      db.ref('users/' + key + '/apps').once('value', (snap) => {
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
        resolve()
        reject('error')
      })
    })
    
  }

  searchData = (payload) => {
    this.getAppsData (localStorage.getItem('userKey'))
    var regex = new RegExp(payload, "g")
    let searchArr = []
    this.user.apps.forEach(element => {
      if (element.app.match(regex)) {
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
    swal({
      title: "Good job!",
      text: "You are successfully register!",
      icon: "success",
    })
  }

  registerApp = (key, payload) => {

    return new Promise((resolve, reject) => {
      payload.createdAt =  firebase.database.ServerValue.TIMESTAMP
      payload.updatedAt = firebase.database.ServerValue.TIMESTAMP
      db.ref('users/' + key + '/apps').push(payload)
      this.getAppsData(key)
          .then(() => {
            resolve(payload)
            swal({
              title: "Good job!",
              text: "You are successfully add new app!",
              icon: "success",
            })
          })
          .catch(() => {
            console.log('err')
          })
    })
  }

  editApp = (key, keyApp, payload) => {
    return new Promise((resolve, reject) => {
      payload.updatedAt = firebase.database.ServerValue.TIMESTAMP
      db.ref('users/' + key + '/apps/' + keyApp).update(payload)
      swal({
        title: "Good job!",
        text: "You are successfully edit your apps!",
        icon: "success",
      })
      this.getAppsData(key)
          .then(() => {
            resolve()
          })
          .catch(() => {
            reject()
          })
    }) 
  }

  deleteApp = (key, appKey) => {
    return new Promise((resolve, reject) => {
      db.ref(`users/${key}/apps/${appKey}`).remove()
      this.getAppsData(key)
      resolve()
      reject()
    })
    
  }

  login = (email, password) => {
    return new Promise((resolve, reject) => {
      let loginCond = false
      db.ref('users').once('value', (snapshot) => {
        snapshot.forEach((element) => {
          let getUser = element.val()
          if (getUser.email === email && getUser.password === password) {
            localStorageMock.setItem('userKey', element.key)
            this.userKey = element.key
            this.getUsersData(localStorageMock.getItem('userKey'))
                .then( async () => {
                  await this.getAppsData(localStorageMock.getItem('userKey'))
                  swal({
                    title: "Good job!",
                    text: "You are successfully login!",
                    icon: "success",
                  })
                  loginCond = true
                  resolve()
                })
                .catch((err) => {
                  console.log('err')
                })
          } 
        })
        if(!loginCond) {
          swal("Oops!", "Username or password is wrong!", "error")
        }
      })
    })
  }

  lookPassword = (email, password, appKey) => {
    let loginCond = false
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
            loginCond = true
          }
        }
      })
      if(!loginCond) {
        swal("Oops!", "Username or password is wrong!", "error")
      }
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

  getDate = (date) => {
    let newDate = new Date(date)
    let monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let year = newDate.getFullYear()
    let month = monthArr[newDate.getMonth()]
    let day = newDate.getDate()
    newDate = `${month} ${day}, ${year}`
    return newDate
  }
}

export default new UserStore()