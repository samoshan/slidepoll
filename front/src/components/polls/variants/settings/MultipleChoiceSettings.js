import React from 'react'
import { Form } from 'react-bulma-components'

import OptionsPanel from '../../OptionsPanel'
import Checkradio from '../../../ui/Checkradio'
import IconButton from '../../../ui/IconButton'
import InfoNotification from '../../../ui/InfoNotification'

export default class MultipleChoiceSettings extends React.Component {

  constructor(props) {
    super(props);
    this.setState = props.setState;
  }

  static getInitialState(poll) {
    let options;
    if (!poll) {
      options = OptionsPanel.getInitialOptions(2);
    } else {
      options = new Map(poll.options.map((option) => [option._id, option]));
    }
    return {
      options,
      maxResponses: poll ? poll.maxResponses : 1,
      allowMultipleResponsesPerOption: poll ? poll.allowMultipleResponsesPerOption : false
    }
  }

  static convertStateForSubmit(state) {
    return { ...state, options: OptionsPanel.convertOptions(state.options) };
  }

  static getValidationError(state) {
    return OptionsPanel.getValidationError(state.options);
  }

  dispatchOptions = (getOptions) => {
    this.setState((prevState) => {
      const options = getOptions(prevState.options);
      return { options };
    })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  offsetMaxResponses = (offset) => {
    this.setState((prevState) => ({
      maxResponses: prevState.maxResponses + offset
    }))
  }

  handleMaxResponsesChange = (event) => {
    const num = parseInt(event.target.value);
    if (num < 1) return;
    this.setState({
      maxResponses: parseInt(num)
    })
  }

  render() {
    const allowMultipleResponses = this.props.poll.allowMultipleResponses;
    return <div>
      <Form.Label>Configure options</Form.Label>
      
      <OptionsPanel useCorrect
        options={this.props.state.options}
        setOptions={this.dispatchOptions}
        />

      <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 15, minHeight: 90}}>
        <div className={!allowMultipleResponses ? 'disabled': undefined}>
          <div className='number-input'>
            <label>Number of responses allowed</label>
            <Form.Field kind='addons'>
              <Form.Control>
                <IconButton
                  disabled={this.props.state.maxResponses <= 1}
                  icon='minus'
                  onClick={() => this.offsetMaxResponses(-1)}
                  />
              </Form.Control>
              <Form.Control>
                <Form.Input
                style={{width: 100}}
                type='number'
                value={this.props.state.maxResponses.toString()}
                onChange={this.handleMaxResponsesChange}
                />
              </Form.Control>
              <Form.Control>
                <IconButton
                  icon='plus'
                  onClick={() => this.offsetMaxResponses(1)}
                  />
              </Form.Control>
            </Form.Field>
          </div>

          <Checkradio
            name='allowMultipleResponsesPerOption'
            checked={this.props.state.allowMultipleResponsesPerOption}
            onChange={this.handleInputChange} >
              Allow multiple responses per option
          </Checkradio>
        </div>
        <div style={{flexGrow: 1, flexBasis: 300, display: allowMultipleResponses ? 'none' : undefined}}>
          <InfoNotification><p>Enable <i>allow multiple responses</i> to edit these settings</p></InfoNotification>
        </div>
      </div>
    </div>
  }
}
