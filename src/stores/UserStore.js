import { observable, action, computed } from 'mobx'

class UserStore {
  // to be implemented later on
  @observable registeredApps = []

  @action
  registerApp = app  => {
    this.registeredApps.push(app);
  };

  @computed
  get appCount() {
    return this.registeredApps.length;
  }
}


export default new UserStore()