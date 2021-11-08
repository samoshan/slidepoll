import React from 'react'
import { Button, Form, Heading } from 'react-bulma-components'
import IconButton from '../../../ui/IconButton'
import WarningNotification from '../../../ui/WarningNotification'

import InfoNotification from '../../../ui/InfoNotification'

function ResponseItem(props) {
  const { response } = props;
  return <li>
    <p>{response.text}</p>
    {props.showDelete &&
      <IconButton
        icon='trash'
        onClick={props.onDelete}
        disabled={props.disableDelete}
        />}
  </li>
}

export default class OpenEndedRespond extends React.Component {

  constructor(props) {
    super(props);
    this.state = { loading: false, text: '' };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    await this.props.submitResponse({
      text: this.state.text
    })
    this.setState({ loading: false });

    this.setState({ text: '' });
  }

  handleTextareaChange = (event) => {
    this.setState({ text: event.target.value });
  }

  render() {
    const responses = Array.from(this.props.responses.values());
    const canRespond = responses.length < 1 || this.props.poll.allowMultipleResponses;

    return <div>
      <InfoNotification><p>Type your response below</p></InfoNotification>
      <WarningNotification>Please do not enter any sensitive personal information</WarningNotification>

      <form onSubmit={this.handleSubmit}>
        <Form.Textarea
          rows='4'
          size='medium'
          value={this.state.text}
          onChange={this.handleTextareaChange}
          disabled={!canRespond}
          required
          />

        <Button
          color='info'
          style={{marginTop: '1.5rem'}}
          disabled={!canRespond || this.props.poll.locked}
          loading={this.state.loading}
          type='submit'
          fullwidth
          >
          Submit Response
        </Button>
      </form>

      {responses.length > 0 && <div>
        <Heading size='5' style={{marginTop: '2rem'}}>Your Responses</Heading>
        <ul className='oe-responses'>
          {responses.map((response) => (
            <ResponseItem
              key={response._id}
              response={response}
              showDelete={this.props.poll.allowRetractions}
              disableDelete={this.props.poll.locked}
              onDelete={() => this.props.deleteResponse(response._id)}
              />
          ))}
        </ul>
      </div>}

    </div>
  }
}
