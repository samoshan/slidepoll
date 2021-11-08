import React from 'react'
import axios from 'axios'
import { Button, Form, Heading, Icon } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, withRouter } from 'react-router-dom'

import InfoNotification from '../ui/InfoNotification'
import WarningNotification from '../ui/WarningNotification'
import UserContext from '../../UserContext'

class RegisterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      first_name: '',
      token: '',
      is18: false
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    let displayError = null;
    this.setState({ displayError });

    if (!this.state.is18) {
      displayError = 'You must confirm you are over 18 to proceed';
    } else {
      const { email, password, first_name, token } = this.state;

      try {
        await axios.post('/auth/register', {
          email, password, first_name, token
        })

        this.context.refresh();
        this.props.history.push('/mypolls');
      } catch (error) {
        displayError = error.response.data.message;
      }
    }

    this.setState({ displayError });
  }
  
  render() {
    return <form onSubmit={this.handleSubmit}>

      <Heading>Sign up</Heading>

      { this.state.displayError && <WarningNotification>{this.state.displayError}</WarningNotification> }

      <div className='form-group'>
        <Form.Label>Your details</Form.Label>

        {/* Name input */}
        <Form.Field>
          <Form.Control>
            <Form.Input
              value={this.state.first_name}
              onChange={this.handleInputChange}
              type='text'
              name='first_name'
              placeholder='First name'
              required />
            <Icon align='left'><FontAwesomeIcon icon='user' /></Icon>
          </Form.Control>
        </Form.Field>

        {/* Email input */}
        <Form.Field>
          <Form.Control>
            <Form.Input
              value={this.state.email}
              onChange={this.handleInputChange}
              type='email'
              name='email'
              placeholder='Email'
              required />
            <Icon align='left'><FontAwesomeIcon icon='envelope' /></Icon>
          </Form.Control>
        </Form.Field>

        {/* Password input */}
        <Form.Field>
          <Form.Control>
            <Form.Input
              value={this.state.password}
              onChange={this.handleInputChange}
              type='password'
              name='password'
              placeholder='Choose password'
              required />
            <Icon align='left'><FontAwesomeIcon icon='lock' /></Icon>
          </Form.Control>
        </Form.Field>
      </div>

      <div className='form-group'>
        <Form.Label>Customisation</Form.Label>

        {/* Token input */}
        <Form.Field>
          <Form.Control>
            <Form.Input
              value={this.state.token}
              onChange={this.handleInputChange}
              type='text'
              name='token'
              placeholder='Active poll token'
              required />
            <Icon align='left'><FontAwesomeIcon icon='directions' /></Icon>
          </Form.Control>
        </Form.Field>

        <InfoNotification><p>The <i>active poll token</i> is a phrase that can be used by your respondents to access your current active poll.</p></InfoNotification>
      </div>

      <div className='form-group'>
        <Form.Label>Legal</Form.Label>
        {/* Age checkbox */}
        <Form.Field>
        <div className='checkradio'>
          <input 
            className='is-checkradio is-info'
            type='checkbox'
            name='is18'
            id='is18'
            checked={this.state.is18}
            onChange={this.handleInputChange} />
          <label className='field-label' htmlFor='is18'>
            <p>I certify that I am 18 years of age or older</p>
          </label>
        </div>
        </Form.Field>
      </div>

      {/* Submit button */}
      <Form.Control>
        <Button color='success' size='medium' fullwidth>Create account</Button>
      </Form.Control>

      <p style={{marginTop: 20}}><Link to='/login'>Already have an account?</Link></p>
    </form>
  }
}
RegisterForm.contextType = UserContext;

export default withRouter(RegisterForm);
