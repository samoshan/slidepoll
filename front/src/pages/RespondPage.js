/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import React from 'react'
import path from 'path'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import VariantManager from '../VariantManager'
import { getSocket } from '../App'
import { Heading } from 'react-bulma-components'
import NotFound from '../components/ui/NotFound'
import PollResults from '../components/polls/PollResults'
import classNames from 'classnames'

export default class RespondPage extends React.Component {

  constructor(props) {
    super(props);

    this.token = props.match.params.token;
    this.pollId = props.match.params.id;

    this.state = {};
  }

  componentDidMount() {
    this.getInitialPoll();

    this.socket = getSocket();
    this.socket.on('connect', this.onWsConnect);
    this.socket.on('pollChanged', this.changePoll);
    this.socket.on('lockedChange', this.onLockedChangeEvent);
    this.socket.on('responsesCleared', this.onResponsesClearedEvent);
    this.socket.on('reloadPoll', this.onReloadPollEvent);
  }

  componentWillUnmount() {
    this.socket?.disconnect();
  }

  onWsConnect = () => {
    if (this.token) {
      this.socket.emit('joinTokenRoom', this.token);
    }
  }

  onLockedChangeEvent = (locked) => {
    this.setState((prevState) => ({
      poll: {
        ...prevState.poll,
        locked
      }
    }))
  }

  onResponsesClearedEvent = () => {
    this.setState({ responses: new Map() });
  }

  onReloadPollEvent = async () => {
    const responseData = await this.fetchPoll(this.state.poll._id);
    this.setPoll(responseData, true);
  }

  fetchPoll = async (pollId) => {
    const httpResponse = await axios.get(path.join('/poll', pollId) + '?includeMyResponses=true');
    return httpResponse.data;
  }

  setPoll = (responseData, isReload = false) => {
    if (!isReload) {
      if (responseData) {
        this.socket.emit('joinEventsRoom', responseData.poll._id);
      } else {
        this.socket.emit('leaveRoom', `events:${this.state.poll._id}`);
      }
    }
    
    if (responseData) {
      this.setState({
        poll: responseData.poll,
        responses: new Map(responseData.myResponses.map((response) => [response._id, response]))
      })
    } else {
      this.setState({
        poll: null,
        responses: null
      })
    }

    this.setState({ viewingResults: false });
  }

  getInitialPoll = async () => {
    try {
      if (this.token) {
        const response = await axios.get(path.join('/poll', 'active', this.token) + '?includeMyResponses=true');
        if (response.status !== 204) {
          this.setPoll(response.data);
        }
      } else {
        const poll = await this.fetchPoll(this.pollId);
        this.setPoll(poll);
      }
    } catch (error) {
      this.setState({ notFound: true });
    }
  }

  changePoll = async (pollId) => {
    if (pollId) {
      const responseData = await this.fetchPoll(pollId);
      this.setPoll(responseData);
    } else {
      this.setPoll(null);
    }
  }

  submitResponse = async (data) => {
    try {
      const httpResponse = await axios.post('/response', {
        poll: this.state.poll._id,
        ...data
      })
      const response = httpResponse.data;
      this.setState((prevState) => ({
        responses: prevState.responses.set(response._id, response)
      }))
      return true;
    } catch {
      return false;
    }
  }

  deleteResponse = async (responseId) => {
    try {
      await axios.delete(path.join('/response', responseId));
      this.setState((prevState) => {
        prevState.responses.delete(responseId);
        return prevState;
      })
    } catch {}
  }

  render() {
    const { poll } = this.state;

    const showTitle = !this.state.notFound && (poll || this.token);

    let respondComponent, noPollComponent;
    if (poll) {
      const RespondComponent = VariantManager.get(poll.variant).respondComponent;
      respondComponent = (
        <RespondComponent
          key={poll._id}
          poll={poll}
          responses={this.state.responses}
          submitResponse={this.submitResponse}
          deleteResponse={this.deleteResponse}
          />
      )
    } else {
      if (this.state.notFound) {
        const text = (this.token) ? 'Token not found' : 'Poll not found';
        noPollComponent = <NotFound text={text} />
      } else {
        noPollComponent = this.token && (
          <div style={{display: 'flex', alignItems:'center', flexDirection: 'column', padding: '70px 0', gap: 30}}>
            <FontAwesomeIcon icon='broadcast-tower' size='6x' />
            <p>Waiting for a poll to be activated...</p>
          </div>
        )
      }
    }

    return <main className='box w500' style={this.state.viewingResults ? {width: '100%', margin: '0 0', padding: '30px 10%', height: 'calc(100vh - 70px)'} : undefined}>
      {showTitle && <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Heading size='4'>{poll?.title || 'No active poll'}</Heading>
        <div
          style={{height: 32, minWidth: 32, marginLeft: 10}}
          data-tooltip={poll?.locked ? 'Locked' : undefined}
          >
          {poll?.locked && <FontAwesomeIcon icon='lock' size='2x' />}
        </div>
      </div>}

      {poll ? (
        <div>
          <div className='tabs is-centered is-medium'>
            <ul>
              <li
                className={this.state.viewingResults ? undefined : 'is-active'}
                onClick={() => this.setState({ viewingResults: false })}
                >
                  <a>Respond</a>
              </li>
              {!poll.private && 
                <li
                  className={classNames('view-results', this.state.viewingResults && 'is-active')}
                  onClick={() => this.setState({ viewingResults: true })}
                  ><a>View Results</a></li>}
            </ul>
          </div>
          {this.state.viewingResults ? 
            <div>
              <PollResults
                key={poll._id}
                poll={poll} />
            </div>
          : respondComponent
            }
        </div>
      ) : noPollComponent}
    </main>
  }

}
