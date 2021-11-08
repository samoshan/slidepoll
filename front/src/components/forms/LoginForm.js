import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Button, Form, Heading, Icon, Level, Notification } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import Checkradio from '../ui/Checkradio'
import UserContext from '../../UserContext'

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      remember: false
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
    const { email, password, remember } = this.state;
    
    let displayError = null;
    this.setState({ displayError });

    try {
      await axios.post('/auth/login', {
        email, password, remember
      })

      this.context.refresh();
      
      if (this.props.onLogin) {
        return this.props.onLogin();
      } else {
        this.props.history.push('/mypolls');
      }

    } catch (error) {
      displayError = error.response.data.message;
      this.setState({ displayError, password: '' });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Heading>Login</Heading>

        { this.state.displayError && <Notification color='warning'>{this.state.displayError}</Notification> }

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
              placeholder='Password'
              required />
            <Icon align='left'><FontAwesomeIcon icon='lock' /></Icon>
          </Form.Control>
        </Form.Field>

        <Level>
          <Level.Side align='left'>
            {/* Remember me checkbox */}
            <Level.Item style={{justifyContent: 'flex-start'}}>
              <Checkradio
                name='remember'
                checked={this.state.remember}
                onChange={this.handleInputChange} >
                  <p>Stay logged in on this device</p>
                  <Form.Help>By checking above you consent to the use of cookies</Form.Help>
              </Checkradio>
            </Level.Item>
          </Level.Side>

          <Level.Side align='right'>
            {/* Submit button */}
            <Level.Item><Form.Control style={{width: '100%'}}>
              <Button color='link' style={{width: '100%'}} size='medium'>Login</Button>
            </Form.Control></Level.Item>
          </Level.Side>
        </Level>

        {this.props.isOffice ? 
          <div><a href='/signup' target='_blank'>Don't have an account?</a><p className='help'>(Opens in a new window)</p></div>
          : <Link to='/signup'>Don't have an account?</Link>}
      </form>
    )
  }

}
LoginForm.contextType = UserContext;

export default withRouter(LoginForm);
