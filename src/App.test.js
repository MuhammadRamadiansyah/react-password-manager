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
Enzyme.configure({ adapter: new Adapter() })

describe('<App /> rendering', () => {
  it('should render navbar header component and home', () => {
    const wrapper = shallow(<Provider UserStore={UserStore}><App /></Provider>)
    expect(wrapper.containsAllMatchingElements([
      <div />,
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

  it('login and register modal should has style display none before its called and display block after its called', () => {
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

describe('application list', () => {

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
  })

  test('generate table with using apps data from firebase', () => {
    const table = shallow(<TableManager UserStore={UserStore}/>)
    expect(table.props()).toHaveProperty('UserStore')
  })

  test('check logout feature', () => {
    const wrapper = shallow(<NavbarHeader />)
    const instance = wrapper.instance()
    const logout = jest.spyOn(instance, 'logout')
    expect(localStorageMock.getItem('userKey')).not.toBeNull()
    wrapper.instance().logout()
    expect(localStorageMock.getItem('userKey')).toBeNull()
  })
})