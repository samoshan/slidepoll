import axios from 'axios'
import { Route, Switch, withRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEnvelope, faLock, faUser, faDirections, faInfoCircle, faBook, faPlus, faCheck, faTrash, faExclamationCircle,
  faChartBar, faListOl, faParagraph, faPencilAlt, faLockOpen, faEraser, faFileCsv, faPodcast, faMinus, faGripVertical,
  faBroadcastTower, faEye, faEyeSlash, faArrowLeft, faArrowRight, faExpandArrowsAlt, faCompressArrowsAlt, faBan, faUndo
} from '@fortawesome/free-solid-svg-icons'
import { faSmile, faGrinBeam, faMeh, faFrown, faSadCry, faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import { io } from 'socket.io-client'

import 'bulma/css/bulma.min.css'
import 'bulma-extensions/bulma-checkradio/dist/css/bulma-checkradio.min.css'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'

import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ManagePollsPage from './pages/ManagePollsPage'
import RespondPage from './pages/RespondPage'
import ResultsPage from './pages/ResultsPage'
import NotFound404Page from './pages/NotFound404Page'

import Header from './components/ui/Header'
import OfficePage from './pages/OfficePage'
import React from 'react'

import UserContext from './UserContext'

library.add(
  faEnvelope, faLock, faUser, faDirections, faInfoCircle, faBook, faPlus, faCheck, faTrash, faExclamationCircle,
  faChartBar, faListOl, faParagraph, faPencilAlt, faLockOpen, faEraser, faFileCsv, faPodcast, faMinus, faGripVertical,
  faBroadcastTower, faEye, faEyeSlash, faArrowLeft, faArrowRight, faExpandArrowsAlt, faCompressArrowsAlt, faBan,
  faCheck, faUndo
)
library.add(faSmile, faGrinBeam, faMeh, faFrown, faSadCry, faThumbsUp, faThumbsDown);

axios.defaults.baseURL = '/api';

export function getSocket() {
  return io({ transports: ["websocket"] });
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { user: null }
  }

  componentDidMount() {
    this.refreshUser();
  }

  logout = async () => {
    try {
      await axios.post('/auth/logout');
      this.setState({ user: null });
      this.props.history.push('/login');
    } catch {};
  }

  refreshUser = async () => {
    try {
      const response = await axios.get('/user/profile');
      this.setState({
        user: response.data
      })
    }
    catch {}
  }

  render() {
    return (<div id='base'>
    <UserContext.Provider value={{ user: this.state.user, logout: this.logout, refresh: this.refreshUser }}>
      <Header />
      <Switch>
        <Route path='/' exact component={MainPage} />
        <Route path='/login' exact component={LoginPage} />
        <Route path='/signup' exact component={RegisterPage} />
        <Route path='/mypolls' exact component={ManagePollsPage} />
        <Route path='/token/:token' exact component={RespondPage} />
        <Route path='/respond/:id' exact component={RespondPage} />
        <Route path='/results/:id' exact component={ResultsPage} />

        <Route path='*' component={NotFound404Page} />
      </Switch>
      </UserContext.Provider>
    </div>
    )
  }
}

export function OfficeApp() {

  return (<div id='base is-office'>
    <OfficePage />
  </div>)
}

export default withRouter(App);
