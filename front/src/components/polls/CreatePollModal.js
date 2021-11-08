import React from 'react'
import axios from 'axios'
import path from 'path'
import { Button, Form, Icon, Modal } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import OpenModal from '../ui/OpenModal'
import Checkradio from '../ui/Checkradio'
import VariantPicker from './VariantPicker'
import VariantManager from '../../VariantManager'
import WarningNotification from '../ui/WarningNotification'

export default class CreatePollModal extends React.Component {

  constructor(props) {
    super(props);

    this.isEdit = !!props.poll;

    const poll = this.isEdit ? props.poll : {
      title: '',
      allowMultipleResponses: false,
      allowRetractions: true,
      private: true,
      variant: 'MultipleChoice'
    }

    let variantStates = {};
    if (this.isEdit) {
      variantStates[poll.variant] = this.getVariantDef(poll.variant).settingsComponent?.getInitialState(poll);
    } else {
      for (const variant of VariantManager.getAll()) {
        variantStates[variant.id] = variant.settingsComponent?.getInitialState();
      }
    }

    this.state = {
      poll,
      variantStates
    }
    
  }

  getVariantDef(x) {
    x = x || this.state.poll.variant;
    return VariantManager.get(x);
  }

  dispatchVariantState = (name, state) => {
    this.setState((prevState) => {
      const prevVariantState = prevState.variantStates[name];
      if (typeof state === 'function') {
        state = state(prevVariantState);
      }
      return {
        variantStates: {
          ...prevState.variantStates,
          [name]: {
            ...prevVariantState,
            ...state
          }
        }
      }
    })
  }

  getVariantState = () => {
    return this.state.variantStates[this.state.poll.variant];
  }

  setLoading = (loading) => {
    this.setState({ loading });
  }

  setDisplayError = (displayError) => {
    this.setState({ displayError });
  }

  handlePollStateChange = (poll) => {
    this.setState((prevState) => ({
      poll: {
        ...prevState.poll,
        ...poll
      }
    }))
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.handlePollStateChange({ [name]: value });
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let displayError = null;

    const variantState = this.getVariantState();
    const settingsComponent = this.getVariantDef().settingsComponent;
    const variantData = settingsComponent?.convertStateForSubmit?.(variantState) ?? variantState;

    // common settings validation
    if (this.state.poll.title.trim() === '') {
      displayError = 'Title is required';
    } else {
      // variant settings validation
      displayError = settingsComponent?.getValidationError?.(variantData);
    }
    this.setDisplayError(displayError);
    if (displayError) return;

    // prepare data for request
    const data = { 
      ...this.state.poll,
      ...variantData
    }
    if (this.isEdit) {
      // only update changed properties
      for (const [property, value] of Object.entries(data)) {
        if (value === this.props.poll[property]) {
          delete data[property];
        }
      }
    }

    // make http request
    this.setLoading(true);
    try {
      const response = await axios({
        url: path.join('/poll', this.isEdit ? this.props.poll._id : ''),
        method: this.isEdit ? 'PATCH' : 'POST',
        data
      })
      this.onSuccess(response.data);
    } catch (error) {
      this.setDisplayError(error.response.data.message);
      this.setLoading(false);
    }

  }

  onSuccess(poll) {
    this.props.onSuccess(poll);
    this.handleClose();
  }

  render() {
    const variantDef = this.getVariantDef();
    const VariantSettingsComponent = variantDef.settingsComponent;
    let variantSettings;
    if (VariantSettingsComponent) {
      variantSettings = (
        <VariantSettingsComponent
          poll={this.state.poll}
          state={this.getVariantState()}
          setState={(state) => this.dispatchVariantState(variantDef.id, state)}
          variant={variantDef.id}
          />
      )
    }

    return (
      <OpenModal onClose={this.handleClose} showClose={false}>
        <Modal.Card className='is-wide'>

          <Modal.Card.Header>
            <p className='modal-card-title'>{this.isEdit ? 'Edit' : 'Create'} Poll</p>
          </Modal.Card.Header>

          <Modal.Card.Body>
          { this.state.displayError && <WarningNotification>{this.state.displayError}</WarningNotification> }

            <div className='form-group'>
              <Form.Label>Common settings</Form.Label>

              <Form.Field>
                <Form.Control>
                  <Form.Input
                    value={this.state.poll.title}
                    onChange={this.handleInputChange}
                    name='title'
                    placeholder='Title / Prompt'
                    required />
                  <Icon align='left'><FontAwesomeIcon icon='book' /></Icon>
                </Form.Control>
              </Form.Field>

              <div className='checkradio-group'>
                <Checkradio
                  name='allowMultipleResponses'
                  checked={this.state.poll.allowMultipleResponses}
                  onChange={this.handleInputChange} >
                    Allow multiple responses
                </Checkradio>
                <Checkradio
                  name='allowRetractions'
                  checked={this.state.poll.allowRetractions}
                  onChange={this.handleInputChange} >
                    Allow users to retract responses
                </Checkradio>
                <Checkradio
                  name='private'
                  checked={this.state.poll.private}
                  onChange={this.handleInputChange} >
                    <strong>Private results</strong> - <i>Don't allow users to view responses</i>
                </Checkradio>
              </div>
            </div>

            {!this.isEdit &&
            <div className='form-group'>
              <Form.Label>Select poll variant</Form.Label>

              <VariantPicker
                selected={this.state.poll.variant}
                setChoice={(variant) => { this.handlePollStateChange({ variant }) }} />
            </div>}

            <div className='form-group'>
              {variantSettings}
            </div>
          </Modal.Card.Body>

          <Modal.Card.Footer style={{ justifyContent: 'flex-end' }}>
            <Button.Group align='right'>
              <Button onClick={this.handleClose} type='button'>Cancel</Button>
              <Button
                type='submit'
                color='success'
                onClick={this.handleSubmit}
                loading={this.state.loading}
                >{this.isEdit ? 'Confirm Changes' : 'Create'}</Button>
            </Button.Group>
          </Modal.Card.Footer>
          
        </Modal.Card>
      </OpenModal>
    )
  }

}
