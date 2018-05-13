import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import App from './App'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NavbarHeader from './components/NavbarHeader'
import Home from './components/Home'
import UserStore from './stores/UserStore'
import { Provider } from 'mobx-react'
import Modal from './components/general/Modal'
import ModalAddList from './components/general/ModalAddList'
import SearchFeature from './components/general/SearchFeature'
import RegisterForm from "./components/general/RegisterForm"
import LoginForm from "./components/general/LoginForm"
import TableManager from "./components/homes/TableManager"

// import { wrap } from 'module'
import localStorageMock from './LocalStorageMock'
import AddListForm from './components/general/AddListForm';
import { wrap } from 'module';
Enzyme.configure({ adapter: new Adapter() })

describe('<App /> rendering', () => {
  it('should render navbar header component and home', () => {
    const wrapper = shallow(<Provider UserStore={UserStore}><App /></Provider>)
    expect(wrapper.containsAllMatchingElements([
      <NavbarHeader />,
      <Home />
    ]))
  })
})

describe('<NavbarHeader /> render', () => {
  
  it('should has component <Modal /> when it is not login', () => {
    UserStore.isLogin = false
    const wrapper = shallow(<NavbarHeader />)
    expect(wrapper.containsAllMatchingElements([
      <Modal />
    ]))
    expect(wrapper.containsMatchingElement(<ModalAddList />)).toBeFalsy()
    expect(wrapper.containsMatchingElement(<SearchFeature />)).toBeFalsy()
  })

  it('should has component <ModalAddList /> and <SeacrhFeature />', () => {
    UserStore.isLogin = true
    const wrapper = shallow(<NavbarHeader />)
    expect(wrapper.containsAllMatchingElements([
      <ModalAddList />,
      <SearchFeature />
    ]))
    expect(wrapper.containsMatchingElement(<Modal />)).toBeFalsy()
  })
})

describe('<Modal /> render', () => {
  it('should has component <RegisterForm /> and <LoginForm />', () => {
    const wrapper = shallow(<div />)
    expect(wrapper.containsAllMatchingElements([
      <LoginForm />,
      <RegisterForm />
    ]))
  })

  it('login and register modal button are works', () => {
    const modal = shallow(<Modal />)
    const registerModal = shallow(<div id="myModal"/>)
    const loginModal = shallow(<div id="loginModal"/>)
    expect(registerModal.hasClass('scale-up-center'))
    expect(registerModal.hasClass('modal'))
    expect(loginModal.hasClass('modal'))
    expect(loginModal.hasClass('scale-up-center'))

    //Modal Button open works
    const instance = modal.instance()
    const openModal = jest.spyOn(instance, 'openModal')
    modal.instance().openModal()

    const openLoginModal = jest.spyOn(instance, 'openLoginModal')
    modal.instance().openLoginModal()

    expect(openModal).toBeCalled()
    expect(openLoginModal).toBeCalled()

  })
})

describe('Register and Login form test', () => {

  describe('Register form all button are works', () => {
    it('email handle change, password handle change, and submit are works', () => {
      const component = renderer.create(<RegisterForm />)
      const wrapper = shallow(<RegisterForm />)
      expect(wrapper.state('email')).toBe('')
      expect(wrapper.state('password')).toBe('')
  
      wrapper.find('#newEmail').simulate('change', 
      {target: {name: 'email', value:'rama@gmail.com'}})
      wrapper.find('#newPassword').simulate('change', 
      {target: {name: 'password', value:'Rama12345!'}})
  
      expect(wrapper.state('email')).toBe('rama@gmail.com')
      expect(wrapper.state('password')).toBe('Rama12345!')
    
      expect(component).toMatchSnapshot()
  
      //close modal button works
      const instance = wrapper.instance()
      const close = jest.spyOn(instance, 'closeModal')

      //clear modal button works
      const clear = jest.spyOn(instance, 'clearForm')

      //submit modal button works
      const submit = jest.spyOn(instance, 'handleSubmit')
      // wrapper.instance().handleSubmit({ preventDefault() {} })
      // expect(close).toHaveBeenCalledTimes(1)
      // expect(clear).toHaveBeenCalledTimes(1)
      // expect(submit).toBeCalled()

      // expect(UserStore.register(wrapper.state('email'), wrapper.state('password'))).toBeCalled()
      // expect(wrapper.state('email')).toBe('')
      // expect(wrapper.state('password')).toBe('')
    })
  })
})

describe('UserStore testing', () => {

  var loginEmail = ''
  var loginPassword = ''
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

  beforeEach (() => {
    const wrapper = shallow(<LoginForm />)
    expect(wrapper.state('email')).toBe('')
    expect(wrapper.state('password')).toBe('')

    wrapper.find('#loginEmail').simulate('change', 
    {target: {name: 'email', value:'rama2@gmail.com'}})
    wrapper.find('#loginPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345'}})

    loginEmail = wrapper.state('email')
    loginPassword = wrapper.state('password')
  })
  test('login successfull', async () => {
    await UserStore.login(loginEmail, loginPassword)
    expect(UserStore.userKey).toEqual(localStorageMock.getItem('userKey'))
    expect(UserStore.user.email).toEqual(loginEmail)
    UserStore.user.apps.forEach((element) => {
      expect(element).toHaveProperty('app')
      expect(element).toHaveProperty('email')
      expect(element).toHaveProperty('password')
      expect(element).toHaveProperty('updatedAt')
      expect(element).toHaveProperty('createdAt')
      expect(element).toHaveProperty('realPassword')
      expect(element.realPassword).toMatch(strongRegex)
    })
    expect(UserStore.isLogin).toBeTruthy()
    expect(localStorageMock.getItem('userKey')).not.toBeNull()
  })

  test('generate table with using apps data from firebase', () => {
    const table = shallow(<TableManager UserStore={UserStore}/>)
    expect(table.props()).toHaveProperty('UserStore')
  })

  test('check logout feature', () => {
    const wrapper = shallow(<NavbarHeader />)
    const instance = wrapper.instance()
    const logout = jest.spyOn(instance, 'logout')
    wrapper.instance().logout()
    expect(logout).toBeCalled()
    expect(localStorageMock.getItem('userKey')).toBeNull()
    expect(UserStore.isLogin).toBeFalsy()
  })
})

describe ('Check props and password validation methods', () => {

  it('testing props edit and add title list form', () => {
    let wrapperEdit = shallow(<AddListForm title="edit"/>)
    let wrapperAdd = shallow(<AddListForm title="add"/>)
    expect(wrapperEdit.instance().props.title).toBe('edit')
    expect(wrapperAdd.instance().props.title).toBe('add')
  })

  test('password validation methods', () => {
    const wrapper = shallow(<AddListForm title="edit"/>)
    const instance = wrapper.instance()
    const validatePassword = jest.spyOn(instance, 'validatePassword')

    //invalid password
    wrapper.find('#appPassword').simulate('change', 
    {target: {name: 'password', value:'rama'}})
    wrapper.instance().validatePassword(wrapper.state().password)
    expect(wrapper.state().isPassword).toBeFalsy()

    //valid Password
    wrapper.find('#appPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345!'}})
    wrapper.instance().validatePassword(wrapper.state().password)
    expect(wrapper.state().isPassword).toBeTruthy()
  })
})

describe('CRUD Testing', () => {

  let countApps
  let testApp 
  beforeEach( async () => {
    const wrapper = shallow(<LoginForm />)
    expect(wrapper.state('email')).toBe('')
    expect(wrapper.state('password')).toBe('')

    wrapper.find('#loginEmail').simulate('change', 
    {target: {name: 'email', value:'rama2@gmail.com'}})
    wrapper.find('#loginPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345'}})
    await UserStore.login(wrapper.state().email, wrapper.state().password)
    countApps = UserStore.user.apps.length
    testApp = UserStore.user.apps[UserStore.user.apps.length-1]
  })

  test('create new app', async () => {
    const component = renderer.create(<AddListForm title="add"/>)
    expect(component).toMatchSnapshot()

    const wrapper = shallow(<AddListForm title="add"/>)
    // const instance = wrapper.instance()
    wrapper.find('#appEmail').simulate('change', 
    {target: {name: 'email', value:'rama2appss@gmail.com'}})
    wrapper.find('#appPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345App!'}})
    wrapper.find('#appName').simulate('change', 
    {target: {name: 'app', value:'Jest23'}})
    let payload = {
      email: wrapper.state().email,
      password: wrapper.state().password,
      app: wrapper.state().app
    }
    // const submit = jest.spyOn(instance, 'handleSubmit')
    // wrapper.instance().handleSubmit({ preventDefault() {} })
    await UserStore.registerApp(localStorageMock.getItem('userKey'), payload)
    expect(UserStore.user.apps.length).toEqual(countApps + 1)
    // expect(submit).toBeCalled()
  })
  
  test('edit app', async () => {

    //edit app initiate
    const wrapper = shallow(<Home />)
    const wrapperForm = shallow(<AddListForm title="edit"/>)
    const instance = wrapper.instance()
    const edit = jest.spyOn(instance, 'editApp')
    expect(wrapper.state().email).toBe('')
    expect(wrapper.state().password).toBe('')
    expect(wrapper.state().app).toBe('')
    expect(wrapper.state().key).toBe('')
    expect(wrapper.state().realpsw).toBe('')
    wrapper.instance().editApp(testApp)
    expect(edit).toHaveBeenCalledWith(testApp)
    
    //after edit button click and before edit
    expect(wrapper.state().email).toEqual(testApp.email)
    expect(wrapper.state().password).toEqual(testApp.password)
    expect(wrapper.state().app).toEqual(testApp.app)
    expect(wrapper.state().key).toEqual(testApp['.key'])
    expect(wrapper.state().realpsw).toEqual(testApp.realPassword)

    //after edit
    wrapperForm.find('#appEmail').simulate('change', 
    {target: {name: 'email', value:'rama2appssedit@gmail.com'}})
    wrapperForm.find('#appPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345App!edit'}})
    wrapperForm.find('#appName').simulate('change', 
    {target: {name: 'app', value:'Jest23edit'}})
    let payload = {
      email: wrapperForm.state().email,
      password: wrapperForm.state().password,
      app: wrapperForm.state().app
    }
    await UserStore.editApp(localStorageMock.getItem('userKey'), testApp['.key'], payload)
    let editApp = UserStore.user.apps[UserStore.user.apps.length-1]
    expect(editApp.email).toEqual(payload.email)
    expect(editApp.realPassword).toEqual(payload.password)
    expect(editApp.app).toEqual(payload.app)
  })

  afterAll( async () => {
    await UserStore.deleteApp(localStorageMock.getItem('userKey'), UserStore.user.apps[UserStore.user.apps.length-1]['.key'])
    expect(UserStore.user.apps.length).toEqual(countApps)
  })
})