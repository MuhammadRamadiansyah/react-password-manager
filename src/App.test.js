import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import App from './App';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NavbarHeader from './components/NavbarHeader';
import Home from './components/Home'
import UserStore from './stores/UserStore'
import { Provider } from 'mobx-react'
import Modal from './components/general/Modal'
import ModalAddList from './components/general/ModalAddList'
import SearchFeature from './components/general/SearchFeature'
import RegisterForm from "./components/general/RegisterForm"
import LoginForm from "./components/general/LoginForm"

Enzyme.configure({ adapter: new Adapter() })

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

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
    const wrapper = shallow(<nav />)
    expect(wrapper.containsAllMatchingElements([
      <div />,
      <Modal />,
    ]))
    expect(wrapper.containsMatchingElement(<ModalAddList />)).toBeFalsy()
    expect(wrapper.containsMatchingElement(<SearchFeature />)).toBeFalsy()
  })

  it('should has component <ModalAddList /> and <SeacrhFeature />', () => {
    UserStore.isLogin = true
    const wrapper = shallow(<nav />)
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
    const registerModal = shallow(<div id="myModal"/>)
    const loginModal = shallow(<div id="loginModal"/>)
    expect(registerModal.hasClass('scale-up-center'))
    expect(registerModal.hasClass('modal'))
    expect(loginModal.hasClass('modal'))
    expect(loginModal.hasClass('scale-up-center'))
  })
})