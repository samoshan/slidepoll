import axios from 'axios'
import React from 'react'
import path from 'path'

import PollResults from '../components/polls/PollResults'
import PollControls from '../components/polls/PollControls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import WarningNotification from '../components/ui/WarningNotification';
import IconButton from '../components/ui/IconButton';

export default class ResultsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hideResults: true
    }
  }

  async componentDidMount() {
    try {
      const id = this.props.pollId || this.props.match.params.id;
      const response = await axios.get(`/poll/${id}?includeTokenInfo=true`);
      this.setState(response.data); // poll, isOwner, isActive, ownerToken
    } catch {
      // 404
    }
  }

  toggleHideResults = () => {
    this.setState(({ hideResults }) => ({
      hideResults: !hideResults
    }))
  }

  toggleActive = () => {
    this.setState(({ isActive }) => ({
      isActive: !isActive
    }))
  }

  setIsLocked = (isLocked) => {
    this.setState(({poll}) => ({
      poll: {
        ...poll,
        locked: isLocked
      }
    }))
  }

  cyclePoll = async (isNext) => {
    try {
      const id = this.props.pollId || this.props.match.params.id;
      const response = await axios.get(path.join('/poll', id, isNext ? 'next' : 'prev'));
      
      if (this.props.onChangePoll) {
        this.props.onChangePoll(response.data.poll._id);
      } else {
        this.props.history.replace(path.join('/results', response.data.poll._id));
      }

      this.setState({
        ...response.data,
        hideResults: true
      }) // poll, isOwner, isActive, ownerToken
    } catch {}
  }

  render() {
    const { poll, ownerToken, isOwner, isActive } = this.state;
    if (!poll) return 'loading';
    const qrUrl = new URL(`token/${ownerToken}`, process.env.REACT_APP_WEBSITE_URL_FULL).href;

    if (!isOwner) {
      return <main className='box w500'>
        <WarningNotification>You do not have permission to view this page</WarningNotification>
      </main>
    }

    return <main className='box' style={{padding: 0, margin: 0}}> 
      <div id='results' style={{display: 'flex', 'flexDirection': 'column'}} className={this.props.isOffice ? 'is-office' : undefined}>

        <div className='results-header'>
          
          <div className='text'>
            <div className='instructions'>
                {poll.locked ? (
                  <p><FontAwesomeIcon icon='lock' style={{marginRight: 10}} /><strong>Poll Locked</strong></p>
                ) : (
                  <p>
                  Respond {isActive && 'now '}
                  at <strong>{process.env.REACT_APP_WEBSITE_URL}</strong> using token <strong>{ownerToken.toUpperCase()}</strong>
                  {!isActive && ' when poll activated'}
                  </p>
                )}
                
                {this.props.isOffice && <div className='floating'>
                  <IconButton icon='undo' onClick={this.props.onBackPressed} />
                </div>}
            </div>
            <div className='title'>
              <p>{poll.title}</p>
            </div>
          </div>
        </div>

        <div className='results-wrapper'>
          

          <PollResults
            key={poll._id}
            poll={poll}
            hideResults={this.state.hideResults}
            qrUrl={qrUrl}
            />

          <PollControls
            poll={poll}
            isActive={isActive}
            toggleActive={this.toggleActive}
            hideResults={this.state.hideResults}
            toggleHideResults={this.toggleHideResults}
            setIsLocked={this.setIsLocked}
            cyclePoll={this.cyclePoll}
            isOffice={this.props.isOffice}
            />
          
        </div>

      </div>
    </main>
  }
}
