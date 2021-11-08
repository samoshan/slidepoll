/* eslint-disable no-undef */
import React from 'react'
import axios from 'axios'
import LoginForm from '../components/forms/LoginForm'

import { addTagToSelectedSlide, getSelectedSlideTags, deleteTagFromSelectedSlide } from '../officeUtil'
import ResultsPage from './ResultsPage'
import ManagePollsPage from './ManagePollsPage'

const TAG_NAME = 'POLLAPP_POLL';

export default class OfficePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await this.tryToLoadPolls();
    this.setState({
      hasAttemptedLoad: true
    })

    const tag = await this.getTag();
    if (tag) {
      console.log(`found tag: ${tag}`);
      this.setSlidePoll(tag);
    }

    window.addEventListener('resize', () => {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight);
    })
  }

  tryToLoadPolls = async () => {
    try {
      const response = await axios.get('/user/polls?includeResponsesCount=true');
      this.setState({
        polls: response.data.polls
      })
    } catch {}
  }

  setSlidePoll = async (pollId) => {
    if (pollId) {
      await addTagToSelectedSlide(TAG_NAME, pollId);
    } else {
      await deleteTagFromSelectedSlide(TAG_NAME);
    }
    this.setState({
      pollId: pollId
    })
  }

  getTag = async() => {
    const tags = await getSelectedSlideTags();
    return tags[TAG_NAME];
  }

  render() {

    // render blank page until we know if the user is logged in or not
    if (!this.state.hasAttemptedLoad) {
      return '';
    }

    // not logged in, show login form and retry poll loading on success
    if (!this.state.polls) {
      return (
        <main className='box w500'>
          <LoginForm onLogin={this.tryToLoadPolls} isOffice />
        </main>
      )
    }

    // show results page if there is a poll tag set
    if (this.state.pollId) {
      return <ResultsPage
        pollId={this.state.pollId}
        onChangePoll={(pollId) => this.setSlidePoll(pollId)}
        onBackPressed={() => this.setSlidePoll(null)}
        isOffice />
    }

    // logged in, show the list of polls
    return (<div>
      <ManagePollsPage
        onPollClick={(pollId) => this.setSlidePoll(pollId)}
        isOffice />
    </div>
    )
  }

}
