import React from 'react'
import { Button, Form, Icon, Level, Panel } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { nanoid } from 'nanoid'

export default class OptionsPanel extends React.Component {

  constructor(props) {
    super(props);
    this.setOptions = props.setOptions;
  }

  static DEFAULT_OPTION = { name: '', correct: undefined };

  static createOption() {
    return [nanoid(), this.DEFAULT_OPTION];
  }

  static getInitialOptions(count) {
    const options = new Map();
    let i;
    for (i = 0; i < count; i++) {
      const [key, option] = OptionsPanel.createOption();
      options.set(key, option);
    }
    return options;
  }

  static convertOptions(options) {
    return Array.from(options.values()).filter(option => option.name.trim() !== '');
  }

  static getValidationError(options) {
    if (options.length < 1) {
      return 'Must have at least one named option'
    }
  }

  Option = (props) => {
    const { option } = props;
    
    const correctButton = (this.props.useCorrect) && (
      <Form.Control>
        <Button type='button' onClick={props.toggleChecked} className={option.correct && 'correct'}>
          <FontAwesomeIcon icon='check' />
        </Button>
      </Form.Control>
    )
  
    return <Panel.Block className='edit-option'>
      <Form.Field kind='addons' style={{width: '100%'}}>
        {correctButton}
        <Form.Control fullwidth>
          <Form.Input placeholder='Option name' value={option.name} onChange={props.onNameChange} />
        </Form.Control>
        <Form.Control>
          <Button type='button' onClick={props.onDelete}>
            <FontAwesomeIcon icon='trash' />
          </Button>
        </Form.Control>
      </Form.Field>
    </Panel.Block>
  }

  addOption = () => {
    const [key, option] = OptionsPanel.createOption();
    this.setOptions((prevOptions) => prevOptions.set(key, option));
  }

  deleteOption = (key) => {
    this.setOptions((prevOptions) => {
      prevOptions.delete(key);
      return prevOptions;
    })
  }

  changeOptionName = (key, event) => {
    const name = event.target.value;
    this.setOptions((prevOptions) => prevOptions.set(key, { ...prevOptions.get(key), name }))
  }

  toggleCorrect = (key) => {
    this.setOptions((prevOptions) => {
      const prevOption = prevOptions.get(key);
      return prevOptions.set(key, {
        ...prevOption,
        correct: (!prevOption.correct) ? true : undefined
      })
    })
  }

  render() {
    const optionComponents = Array.from(this.props.options).map(([key, option]) => (
      <this.Option
        key={key}
        option={option}
        toggleChecked={() => this.toggleCorrect(key)}
        onNameChange={(event) => this.changeOptionName(key, event)}
        onDelete={() => this.deleteOption(key)}
        />
    ))
    
    return (
      <Panel style={{ marginBottom: '1.0rem' }}>
        <Panel.Header style={{ padding: 5, fontSize: 'inherit' }}>
        <Level breakpoint='mobile'>
          <Level.Side align='left'>
            <Level.Item style={{ marginLeft: 15 }}>Options</Level.Item>
          </Level.Side>
          <Level.Side align='right'>
            <Level.Item>
              <Button type='button' color='info' onClick={this.addOption}>
                <Icon><FontAwesomeIcon icon='plus' /></Icon>
                <span>Add option</span>
              </Button>
            </Level.Item>
          </Level.Side>
        </Level>  
        </Panel.Header>
        {optionComponents}
      </Panel>
    )
  }

}
