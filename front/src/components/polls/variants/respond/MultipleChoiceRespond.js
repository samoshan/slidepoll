import React from 'react'
import { Tag } from 'react-bulma-components'

import IconButton from '../../../ui/IconButton'
import InfoNotification from '../../../ui/InfoNotification'

function Option(props) {
  const { option, count, disabled } = props;

  return (
    <li className='box'>
      <div
        className={disabled ? 'disabled' : undefined}
        onClick={() => props.onClick(option._id)}
        >
        <Tag size='large' color='dark'>{count}</Tag>
        <p>{option.name}</p>
      </div>
      {props.allowRetraction &&
        <IconButton
        icon='minus'
        onClick={() => props.onMinusClick(option._id)}
        disabled={count < 1 || props.isPollLocked}
        className={count >=1 ? 'enabled' : undefined}
        />
      }
    </li>
  )
}

export default class MultipleChoiceRespond extends React.Component {

  onOptionClick = (option) => {
    this.props.submitResponse({ option });
  }

  onMinusClick = async (option) => {
    for (const response of this.props.responses.values()) {
      if (response.option === option) {
        this.props.deleteResponse(response._id);
        break;
      }
    }
  }

  render() {
    const { allowMultipleResponses, maxResponses, allowMultipleResponsesPerOption } = this.props.poll;
    const numResponses = this.props.responses.size;
    
    let canRespond;
    if (numResponses < 1) {
      canRespond = true;
    } else if (allowMultipleResponses) {
      canRespond = numResponses < maxResponses;
    } else {
      canRespond = false;
    }

    const counts = new Map();
    for (const response of this.props.responses.values()) {
      const currentCount = counts.get(response.option);
      counts.set(response.option, currentCount ? currentCount + 1 : 1);
    }

    const optionComponents = this.props.poll.options.map((option) => (
      <Option
        key={option._id}
        disabled={this.props.poll.locked || !canRespond || (!this.props.poll.allowMultipleResponsesPerOption && counts.get(option._id) > 0)}
        isPollLocked={this.props.poll.locked}
        option={option}
        count={counts.get(option._id) || 0}
        onClick={this.onOptionClick}
        onMinusClick={this.onMinusClick}
        allowRetraction={this.props.poll.allowRetractions}
        />
    ))

    let messages=[];
    if (allowMultipleResponses && maxResponses > 1) {
      messages[0] = `You may vote up to ${maxResponses} times (${maxResponses-numResponses} remaining)`;
      if (!allowMultipleResponsesPerOption) {
        messages[1] = 'But only once per option';
      }
    } else {
      messages[0] = 'You may only vote once';
    }

    return <div>
      <InfoNotification><div><p>{messages[0]}</p><p>{messages[1]}</p></div></InfoNotification>
      <ul className='respond-options-mc'>{optionComponents}</ul>
    </div>
  }

}
