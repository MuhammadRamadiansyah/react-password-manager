import React from 'react'
import ReactDOM from 'react-dom'
import renderer from 'react-test-renderer'
import App from './App'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import UserStore from './stores/UserStore'
import { Provider } from 'mobx-react'

//Component module
import Home from './components/Home'
import NavbarHeader from './components/NavbarHeader'
import Modal from './components/general/Modal'
import ModalAddList from './components/general/ModalAddList'
import SearchFeature from './components/general/SearchFeature'
import RegisterForm from "./components/general/RegisterForm"
import AddListForm from './components/general/AddListForm';
import LoginForm from "./components/general/LoginForm"
import HomeAlert from "./components/general/HomeAlert"
import TableManager from "./components/homes/TableManager"

// import { wrap } from 'module'
import localStorageMock from './LocalStorageMock'
import { wrap } from 'module';
Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  const div = document.createElement('div', { id: 'root' });
  ReactDOM.render(<div id="root"><App /></div>, div);
  ReactDOM.unmountComponentAtNode(div);
})

describe('<App /> rendering', () => {
  it('should render navbar header component and home', () => {
    const wrapper = shallow(<Provider UserStore={UserStore}><App /></Provider>)
    expect(wrapper.containsAllMatchingElements([
      <NavbarHeader />,
      <Home />
    ]))
  })
})

describe('<Home /> render', async () => {

  
  const wrapper = shallow(<Home />),
        instance = wrapper.instance()
  let testKey = '-LBj_XMYcT_4_7tpJymu',
      testApp
  
  beforeAll( async () => {
    await UserStore.login('rama2@gmail.com', 'Rama12345')
    testApp = UserStore.user.apps[UserStore.user.apps.length-1]
    await UserStore.registerApp(testKey, {
      email: 'tes@gmail.com',
      password: 'blabBla12!22',
      app: 'apalah'
    })
  })
  test('Home alert testing element', () => {
    const component = renderer.create(<HomeAlert/>)
    expect(component).toMatchSnapshot()
  })

  test('<Home /> testing methods for look', async () => {
    const lookPasswordApp = jest.spyOn(instance, 'lookPassword')
    await wrapper.instance().lookPassword(testApp)
    expect(lookPasswordApp).toBeCalled()
  })

  test('<Home /> delete methods', async() => {
    const deleteApp = jest.spyOn(instance, 'deleteApp')
    await wrapper.instance().deleteApp(testApp)
    expect(deleteApp).toBeCalled()
  })

  afterAll( async() => {
    localStorageMock.removeItem('userKey')
    const deleteApp = jest.spyOn(instance, 'deleteApp')
    await wrapper.instance().deleteApp(testApp)
    expect(deleteApp).toBeCalled()
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

describe('<Modal /> and <ModalAddList /> render', () => {

  it('<Modal /> should has component <RegisterForm /> and <LoginForm />', () => {
    const wrapper = shallow(<Modal UserStore={UserStore}/>)
    expect(wrapper.containsAllMatchingElements([
      <LoginForm />,
      <RegisterForm />
    ]))
  })

  it('<ModalAddList /> should has component <AddListForm />', () => {
    const wrapper = shallow(<Modal UserStore={UserStore}/>)
    expect(wrapper.containsAllMatchingElements([
      <ModalAddList />
    ]))
  })

  it('login and register modal button are works', () => {
    const modal = shallow(<Modal UserStore={UserStore}/>)
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
    it('email handle change, password handle change, and submit are works', async () => {
      const component = renderer.create(<RegisterForm />)
      const wrapper = shallow(<RegisterForm />)
      expect(wrapper.state('email')).toBe('')
      expect(wrapper.state('password')).toBe('')
  
      wrapper.find('#newEmail').simulate('change', 
      {target: {name: 'email', value:'rama2@gmail.com'}})
      wrapper.find('#newPassword').simulate('change', 
      {target: {name: 'password', value:'Rama12345!'}})
  
      expect(wrapper.state('email')).toBe('rama2@gmail.com')
      expect(wrapper.state('password')).toBe('Rama12345!')
    
      expect(component).toMatchSnapshot()
  
      //close modal button works
      const instance = wrapper.instance()
      const close = jest.spyOn(instance, 'closeModal')

      //clear modal button works
      const clear = jest.spyOn(instance, 'clearForm')

      //submit modal button works
      const submit = jest.spyOn(instance, 'handleSubmit')
      // await wrapper.instance().handleSubmit({ preventDefault() {} })
      // expect(close).toHaveBeenCalledTimes(1)
      // expect(clear).toHaveBeenCalledTimes(1)
      // expect(submit).toBeCalled()
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

describe('CRUD Testing, look Password, hide Password and search App', () => {

  let countApps,
      testApp,
      userEmail, 
      userPassword,
      strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")

  beforeEach( async () => {
    const wrapper = shallow(<LoginForm />)
    expect(wrapper.state('email')).toBe('')
    expect(wrapper.state('password')).toBe('')

    wrapper.find('#loginEmail').simulate('change', 
    {target: {name: 'email', value:'rama2@gmail.com'}})
    wrapper.find('#loginPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345'}})
    userEmail = wrapper.state().email
    userPassword = wrapper.state().password
    await UserStore.login(userEmail, userPassword)
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
    testApp = UserStore.user.apps[UserStore.user.apps.length-1]

    expect(testApp.email).toEqual(payload.email)
    expect(testApp.realPassword).toEqual(payload.password)
    expect(testApp.app).toEqual(payload.app)
  })

  test('look password and hide password', async () => {
    
    expect(testApp.password).not.toMatch(strongRegex)

    //show password
    await UserStore.lookPassword(userEmail, userPassword, testApp['.key'])
    testApp = UserStore.user.apps[UserStore.user.apps.length-1]
    expect(testApp.password).toMatch(strongRegex)
    expect(testApp.password).toEqual(testApp.realPassword)

    //hide password
    await UserStore.hiddenPassword(testApp)
    testApp = UserStore.user.apps[UserStore.user.apps.length-1]
    expect(testApp.password).not.toMatch(strongRegex)
  })

  test('search app name', async () => {
    const searchWrapper = shallow(<SearchFeature />)
    expect(searchWrapper.state('search')).toBe('')
    searchWrapper.find('#searchApp').simulate('change', 
    {target: {name: 'search', value:'3'}})
    expect(searchWrapper.state().search).toBe('3')
    var regex = new RegExp(searchWrapper.state().search, "g")
    await UserStore.searchData(searchWrapper.state().search)
    UserStore.user.apps.forEach(app => {
      expect(app.app).toMatch(regex)
    })
  })
  afterAll( async () => {
    await UserStore.deleteApp(localStorageMock.getItem('userKey'), UserStore.user.apps[UserStore.user.apps.length-1]['.key'])
    expect(UserStore.user.apps.length).toEqual(countApps)
  })
})

describe('mount testing compoonents', async () => {
  let testKey = '-LBj_XMYcT_4_7tpJymu',
      testEmail = 'rama2@gmail.com',
      testApp
      
  it('<NavbarHeader /> mount testing, should have user and apps data', () => {
    localStorageMock.setItem('userKey', testKey)
    const wrapper = mount(<NavbarHeader />)
    expect(UserStore.user.email).toEqual(testEmail)
    expect(UserStore.user.apps.length).toBeGreaterThan(0)
  })

  describe('testing components that have props methods', () => {

    it('<TableManager /> testing component', () => {
      testApp = UserStore.user.apps[0]
      const home = shallow(<Home />)
      const deleteApp = home.instance().deleteApp
      const editApp = home.instance().editApp
      const lookPassword = home.instance().lookPassword
      const component = renderer.create(<TableManager user={UserStore.user} UserStore={UserStore} delete={deleteApp} edit={editApp} look={lookPassword}/>)
      const wrapper = shallow(<TableManager UserStore={UserStore} delete={deleteApp} edit={editApp} look={lookPassword}/>)
      const instance = home.instance()
      const editAppMock = jest.spyOn(instance, 'editApp')
      wrapper.instance().props.edit(testApp)
      home.instance().editApp(testApp)
      expect(editAppMock).toHaveBeenCalledWith(testApp)
    })
  })

})

describe('test each of components element', () => {
  let testKey = '-LBj_XMYcT_4_7tpJymu',
      testApp

  it('<ModalAddList /> component', () => {
    const component = renderer.create(<ModalAddList />)
    const wrapper = shallow(<ModalAddList logout={() => localStorageMock.removeItem('userKey')} />)
    expect(wrapper.containsAllMatchingElements([
      <AddListForm />,
      <button />,
      <div />
    ]))
    expect(component).toMatchSnapshot()

    //Modal Button open works
    const instance = wrapper.instance()
    const openModal = jest.spyOn(instance, 'openModal')
    const logoutMethod = jest.spyOn(instance, 'logout')
    wrapper.instance().openModal()
    wrapper.instance().logout()
    expect(openModal).toBeCalled()
    expect(logoutMethod).toBeCalled()
  })

  test('<LoginForm /> component', async () => {
    const component = renderer.create(<LoginForm />)
    const wrapper = shallow(<LoginForm />)
    expect(wrapper.containsAllMatchingElements([
      <form />,
      <button />,
      <h1 />,
      <div />
    ]))

    wrapper.find('#loginEmail').simulate('change', 
    {target: {name: 'email', value:'rama2@gmail.com'}})
    wrapper.find('#loginPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345'}})

    const instance = wrapper.instance()
    const submit = jest.spyOn(instance, 'handleSubmit')
    const close = jest.spyOn(instance, 'closeModal')
    const clear = jest.spyOn(instance, 'clearForm')
    await wrapper.instance().handleSubmit({ preventDefault() {} })
    expect(close).toHaveBeenCalledTimes(1)
    expect(clear).toHaveBeenCalledTimes(1)
    expect(submit).toBeCalled()
    expect(component).toMatchSnapshot()
  })

  it('<AddListForm /> component', async () => {
    const wrapper = shallow(<AddListForm title="add"/>)
    const instance = wrapper.instance()
    const submit = jest.spyOn(instance, 'handleSubmit')
    const close = jest.spyOn(instance, 'closeModal')
    const clear = jest.spyOn(instance, 'clearForm')

    wrapper.find('#appEmail').simulate('change', 
    {target: {name: 'email', value:'rama2appss@gmail.com'}})
    wrapper.find('#appPassword').simulate('change', 
    {target: {name: 'password', value:'Rama12345App!'}})
    wrapper.find('#appName').simulate('change', 
    {target: {name: 'app', value:'Jest23'}})
    
    await wrapper.instance().handleSubmit({ preventDefault() {} })
    expect(close).toHaveBeenCalledTimes(1)
    expect(clear).toHaveBeenCalledTimes(1)
    expect(submit).toBeCalled()
  })
})