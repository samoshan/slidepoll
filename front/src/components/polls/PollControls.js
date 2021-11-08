import axios from 'axios'
import path from 'path'
import { useState } from 'react'

import ControlButton from '../ui/ControlButton'

export default function PollControls(props) {

  const { poll, isActive, hideResults, isOffice } = props;

  const [isFullscreen, setIsFullscreen] = useState();

  async function clearResponses() {
    await axios.delete(path.join('/poll', poll._id, 'responses'));
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.getElementById('results').requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

  async function toggleActive() {
    let url;
    if (isActive) {
      url = '/user/clearactive';
    } else {
      url = path.join('/poll', poll._id, 'setactive');
    }
    try {
      await axios.post(url);
      props.toggleActive();
    } catch {}
  }

  async function toggleLocked() {
    const url = path.join('/poll', poll._id, poll.locked ? 'unlock' : 'lock');
    try {
      const response = await axios.post(url);
      props.setIsLocked(response.data.locked);
    } catch {}
  }

  return (
    <ul className='controls'>
      <li>
        <ControlButton
          icon={hideResults ? 'eye' : 'eye-slash'}
          color={hideResults ? 'warning' : undefined}
          onClick={props.toggleHideResults}
          >
          {hideResults ?  'Show results' : 'Hide results'}
        </ControlButton>
        
        {!isOffice && <ControlButton
          icon={isFullscreen ? 'compress-arrows-alt' : 'expand-arrows-alt'}
          color={isFullscreen ? 'info' : undefined}
          onClick={toggleFullscreen}
          >
          {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </ControlButton>}
      </li>
      <li>
        <ControlButton
          icon='podcast'
          color={isActive ? 'info' : 'warning'}
          onClick={toggleActive}
          >
          Activate
        </ControlButton>

        <ControlButton
          icon='lock'
          color={poll.locked ? 'warning' : undefined}
          onClick={toggleLocked}
          >
          {poll.locked ? 'Unlock' : 'Lock'}
        </ControlButton>

        <ControlButton
          icon='eraser'
          onClick={clearResponses}
          >
          Clear responses
        </ControlButton>
      </li>
      <li>
        <ControlButton icon='arrow-left' onClick={() => props.cyclePoll(false)}>Previous</ControlButton>
        <ControlButton icon='arrow-right' onClick={() => props.cyclePoll(true)}>Next</ControlButton>
      </li>
    </ul>
  )
}
