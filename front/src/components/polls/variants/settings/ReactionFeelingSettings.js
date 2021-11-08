import React from 'react'
import { Form } from 'react-bulma-components'

import VariantManager from '../../../../VariantManager'
import ReactionIcon from '../../../ui/ReactionIcon'

function ReactionsType(props) {
  const options = props.options.map((option) => (
    <ReactionIcon key={option.id} icon={option.icon} />
  ))
  return <li onClick={props.onClick} className={props.selected ? 'selected' : undefined}>
    <div className='icon-group'>{options}</div>
  </li>
}

export default class ReactionFeelingSettings extends React.Component {

  constructor(props) {
    super(props);
    this.setState = props.setState;
  }

  static getInitialState(poll) {
    const preset = poll?.preset;
    return { preset };
  }

  static getValidationError(state) {
    if (!state.preset) {
      return 'Must select a reaction preset';
    }
  }

  setPreset = (preset) => {
    this.setState({ preset });
  }

  render() {
    const reactionTypes = Object.entries(VariantManager.ReactionFeeling.presets).map(([presetId, presetOptions]) => (
      <ReactionsType 
        key={presetId}
        options={presetOptions}
        selected={presetId === this.props.state.preset}
        onClick={() => this.setPreset(presetId)}
        />
    ))

    return <div>
      <Form.Label>Select reaction preset</Form.Label>
      <div className='variant-select reactions'>
        <ul style={{flexWrap: 'wrap'}}>
          {reactionTypes}
        </ul>
      </div>
    </div>
  }

}
