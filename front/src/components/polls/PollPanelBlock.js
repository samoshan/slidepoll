import React from 'react'
import axios from 'axios'
import path from 'path'
import { Button, Form, Level, Panel } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

import IconButton from '../ui/IconButton'
import ButtonAttatchedGroup from '../ui/ButtonAttatchedGroup'
import VariantManager from '../../VariantManager'
import CreatePollModal from './CreatePollModal'

export default class PollPanelBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = { editing: false };

    this.poll = props.poll;
    this.replacePoll = () => props.replacePoll(this.poll);

    this.baseEndpoint = path.join('/poll', this.poll._id);
    this.variantDef = VariantManager.get(this.poll.variant);
  }

  setPollProperty = (propertyName, value) => {
    this.poll[propertyName] = value;
    this.replacePoll();
  }

  toggleLocked = async () => {
    const url = path.join(this.baseEndpoint, this.poll.locked ? 'unlock' : 'lock');
    try {
      const response = await axios.post(url);
      this.setPollProperty('locked', response.data.locked);
    } catch {}
  }

  toggleActive = async () => {
    let url;
    if (this.props.isActive) {
      url = '/user/clearactive';
    } else {
      url = path.join(this.baseEndpoint, 'setactive');
    }
    try {
      await axios.post(url);
      this.props.setActive(this.props.isActive ? null : this.poll._id);
    } catch {}
  }

  delete = async () => {
    try {
      await axios.delete(this.baseEndpoint);
      this.props.deletePoll();
    } catch {}
  }

  clearResponses = async () => {
    try {
      await axios.delete(path.join(this.baseEndpoint, 'responses'));
      this.setPollProperty('responsesCount', 0);
    } catch {}
  }

  showEdit = (show) => {
    this.setState({
      editing: show
    })
  }

  onFinishedEditing = (poll) => {
    this.poll = {
      ...poll,
      responsesCount: this.poll.responsesCount
    }
    this.replacePoll();
  }

  render() {
    const responsesText = `${this.poll.responsesCount} ${this.poll.responsesCount === 1 ? 'response' : 'responses'}`;

    const csvUrl = path.join('/api', 'poll', this.poll._id, 'results.csv');

    const { isOffice } = this.props;

    return (
      <Panel.Block className='poll-item'><Level style={{width: '100%'}}>

        {this.state.editing &&
          <CreatePollModal 
            poll={this.poll}
            onSuccess={this.onFinishedEditing}
            onClose={() => this.showEdit(false)}
            />
        }

        <Level.Side align='left'><Level.Item>

          <Panel.Icon data-tooltip={this.variantDef.name} >
            <FontAwesomeIcon icon={this.variantDef.icon} />
          </Panel.Icon>
          
          {this.props.onPollClick 
            ? <p class='fake-link' onClick={() => this.props.onPollClick(this.poll._id)} style={{width: '100%'}}>{this.poll.title}</p>
            : <Link to={path.join('/', 'results', this.poll._id)} style={{width: '100%'}}>{this.poll.title}</Link>}
          
        </Level.Item></Level.Side>

        <Level.Side align='right'><Level.Item>
          
          <ButtonAttatchedGroup>
            <IconButton
              icon='podcast'
              tooltip={this.props.isActive ? 'Deactivate' : 'Activate'}
              color={this.props.isActive ? 'info' : 'undefined'}
              onClick={this.toggleActive}
              />
            <IconButton
              icon={this.poll.locked ? 'lock' : 'lock-open'}
              tooltip={this.poll.locked ? 'Unlock' : 'Lock'}
              onClick={this.toggleLocked}
              />
          </ButtonAttatchedGroup>

          <Form.Field kind='addons' className='responses-addons' style={{padding: '0px 8px'}}>
            <Form.Control className='hide-on-mobile'>
              {!isOffice && <IconButton
                icon='file-csv'
                tooltip='Download responses'
                disabled={this.poll.responsesCount < 1}
                onClick={() => window.location.href = csvUrl}
                />}
            </Form.Control>
            <Form.Control fullwidth>
              <Button isStatic fullwidth style={{padding: '0px 8px', justifyContent: 'flex-start', minWidth: 120}}><p>{responsesText}</p></Button>
            </Form.Control>
            <Form.Control>
              <IconButton
                icon='eraser'
                tooltip='Clear all responses'
                onClick={this.clearResponses}
                disabled={this.poll.responsesCount < 1}
                />
            </Form.Control>
          </Form.Field>

          <ButtonAttatchedGroup>
            <IconButton
              icon='pencil-alt'
              tooltip='Edit'
              onClick={() => this.showEdit(true)}
              />
            <IconButton
              icon='trash'
              tooltip='Delete'
              color='danger'
              onClick={this.delete}
              />
          </ButtonAttatchedGroup>

        </Level.Item></Level.Side>

      </Level></Panel.Block>
    )
  }
}
