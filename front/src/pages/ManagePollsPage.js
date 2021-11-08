import axios from 'axios'
import React from 'react'
import { Level, Panel } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import CreatePollModal from '../components/polls/CreatePollModal'
import PollPanelBlock from '../components/polls/PollPanelBlock'
import IconButton from '../components/ui/IconButton'

export default class ManagePollsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      polls: null,
      creating: false
    }
  }

  async componentDidMount() {
    // fetch all of user's polls
    try {
      const response = await axios.get('/user/polls?includeResponsesCount=true');
      this.setState({
        polls: new Map(response.data.polls.map((poll) => [poll._id, poll])),
        activePoll: response.data.active
      })
    } catch (error) {
      if (error.response.status === 401) {
        this.props.history.replace('/login');
      }
    }
  }

  getAllPolls() {
    return Array.from(this.state.polls.values());
  }

  replacePoll = (poll) => {
    this.setState((prevState) => ({
      polls: prevState.polls.set(poll._id, poll)
    }))
  }

  deletePoll = (pollId) => {
    this.setState((prevState) => {
      prevState.polls.delete(pollId);
      return prevState;
    })
  }

  setActive = (pollId) => {
    this.setState({
      activePoll: pollId
    })
  }

  showCreate = (show) => {
    this.setState({
      creating: show
    })
  }

  onPollCreated = (poll) => {
    poll.responsesCount = 0;
    this.replacePoll(poll);
  }

  render() {
    if (!this.state.polls) return 'loading';

    const { isOffice, onPollClick } = this.props;

    const pollPanelBlocks = this.getAllPolls().map(poll => (
      <PollPanelBlock
        key={poll._id}
        isActive={poll._id === this.state.activePoll}
        setActive={this.setActive}
        poll={poll}
        replacePoll={this.replacePoll}
        deletePoll={() => this.deletePoll(poll._id)}
        isOffice={isOffice}
        onPollClick={onPollClick}
        />
    ))
    
    return <main className='container is-max-widescreen' style={{ overflowX: 'hidden' }}>

      {this.state.creating &&
        <CreatePollModal
          onSuccess={this.onPollCreated}
          onClose={() => this.showCreate(false)}
          />
      }

      <Panel className='poll-panel' style={{height: '100%'}}>
        <Panel.Header>
        <Level breakpoint='mobile'>
          <Level.Side align='left'>
            <Level.Item>My polls{isOffice && ' (click a title to embed)'}</Level.Item>
          </Level.Side>
          <Level.Side align='right'>
            <Level.Item>
              <IconButton
                icon='plus'
                color='info'
                onClick={this.showCreate}
                >
                New poll
              </IconButton>
            </Level.Item>
          </Level.Side>
        </Level>
        </Panel.Header>

        <div className='polls'>
          {pollPanelBlocks}

          {this.state.polls.size === 0 &&
          <div className='no-polls'>
            <FontAwesomeIcon icon={['far', 'frown']} size='7x' />
            <p style={{marginTop: 30}}>You don't have any polls yet</p>
            <p>Get started by clicking the button above</p>
          </div>
          }
        </div>

        <Panel.Block className='panel-footer help' style={{margin: 0, padding: 20}}>
          You have {this.state.polls.size} poll{this.state.polls.size === 1 ? '' : 's'}. Click a poll title to go to presenter mode
        </Panel.Block>
      </Panel>
    </main>
  }

}
