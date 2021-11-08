import React from 'react'
import { Form } from 'react-bulma-components'

import OptionsPanel from '../../OptionsPanel'
import Checkradio from '../../../ui/Checkradio'

export default class RankedChoiceSettings extends React.Component {

  constructor(props) {
    super();
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
      randomiseOrder: poll ? poll.randomiseOrder : true
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

  render() {
    return <div>
      <Form.Label>Configure options</Form.Label>

      <OptionsPanel
        options={this.props.state.options}
        setOptions={this.dispatchOptions}
        />
      
      <Checkradio
        name='randomiseOrder'
        checked={this.props.state.randomiseOrder}
        onChange={this.handleInputChange} >
          Randomise order of options on voting page
      </Checkradio>
    </div>
  }
  
}
