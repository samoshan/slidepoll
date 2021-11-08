import React from 'react'

import InfoNotification from '../../../ui/InfoNotification'
import ReactionIcon from '../../../ui/ReactionIcon'
import { reactionFeeling } from '../../../../variant-definitions'
import { Button } from 'react-bulma-components'
import classNames from 'classnames'

function ReactionItem({ option, onClick, selected }) {
  return (
    <li
      onClick={onClick}
      className={selected ? 'selected' : undefined}
      >
      <ReactionIcon icon={option.icon} size='5x' />
    </li>
  )
}

export default class ReactionFeelingRespond extends React.Component {

  handleOptionClick = (option) => {
    this.props.submitResponse({ reaction: option.id });
  }

  handleRetract = (response) => {
    this.props.deleteResponse(response._id);
  }

  render () {
    const presetId = this.props.poll.preset;
    const options = reactionFeeling.presets[presetId];
    const response = Array.from(this.props.responses.values())[0];

    let rows;
    if (options.length === 5) {
      rows = [
        [options[1], options[2], options[3]],
        [options[0], options[4]]
      ]
    } else {
      rows = [options];
    }

    const disabled = response || this.props.poll.locked;

    return <div>
      <InfoNotification><p>Select the emoji that best describes your response</p></InfoNotification>
      <div className={classNames('respond-rf', disabled && 'disabled')}>
        <ul>
          {rows.map((row, index) => (
            <div key={index} className='row'>
            {row.map((option) => (
              <ReactionItem
                key={option.id}
                option={option}
                onClick={() => this.handleOptionClick(option)}
                selected={option.id === response?.reaction}
                />
            ))}
            </div>
          ))}
        </ul>
      </div>
      
      {response && this.props.poll.allowRetractions && 
      <Button
        color='warning'
        style={{marginTop: '1.5rem'}}
        onClick={() => this.handleRetract(response)}
        disabled={this.props.poll.locked}
        fullwidth
        >
        Retract Response
      </Button>}
    </div>
  }

}
