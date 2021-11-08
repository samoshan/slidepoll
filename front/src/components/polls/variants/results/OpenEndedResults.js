import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import classNames from 'classnames'
import path from 'path'
import { useState } from 'react'
import { Button, Modal } from 'react-bulma-components'
import IconButton from '../../../ui/IconButton'

export default function OpenEndedResults(props) {

  const { results, hideResults } = props;
  const [activeResponse, setActiveResponse] = useState();

  if (hideResults) {
    return <div style={{margin: 'auto 0'}}>
      <FontAwesomeIcon icon='eye-slash' style={{fontSize: '15em'}} />
    </div>
  }

  function offsetActive(offset) {
    const index = results.findIndex((searchResponse) => searchResponse.id === activeResponse.id);
    let offsetIndex = index + offset;

    if (offsetIndex >= results.length) offsetIndex = 0;
    if (offsetIndex < 0) offsetIndex = results.length - 1;

    setActiveResponse(results[offsetIndex]);
  }

  function deleteResponse(responseId) {
    axios.delete(path.join('/response', responseId));
  }

  return <div style={{display: 'flex', margin: 'auto 0', gap: 60, flexWrap: 'wrap', padding: 50, width: '100%', justifyContent: 'center'}} className='oe-results'>

    <div className={classNames('modal', activeResponse && 'is-active')}>
      <div className='modal-background' onClick={() => setActiveResponse(null)}></div>
      <Modal.Card>
        <Modal.Card.Body className='oe-response-active'>
        {activeResponse?.text}
        </Modal.Card.Body>
        <Modal.Card.Footer style={{display: 'flex', justifyContent: 'space-between', padding: 10}}>
          <Button onClick={() => setActiveResponse(null)}>Close</Button>
          <div>
            <IconButton icon='arrow-left' onClick={() => offsetActive(-1)} />
            <IconButton icon='arrow-right' onClick={() => offsetActive(1)} />
          </div>
        </Modal.Card.Footer>
      </Modal.Card>
    </div>
    
    {results.map((response) => (
      <div className='box oe-response' key={response.id}>
        <p onClick={() => setActiveResponse(response)}>{response.text}</p>
        <IconButton
          icon='trash'
          color='warning'
          onClick={() => deleteResponse(response.id)}
          />
      </div>
    ))}

  </div>
}
