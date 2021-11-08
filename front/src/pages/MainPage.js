import { useState } from 'react'
import { Button, Form, Heading } from 'react-bulma-components'
import { useHistory } from 'react-router-dom';
import InfoNotification from '../components/ui/InfoNotification'

export default function MainPage() {

  const [token, setToken] = useState('');
  const history = useHistory();

  function handleSubmit() {
    history.push(`/token/${token}`);
  }

  return <main className='box w500'>
    <Heading>Join a presentation to respond</Heading>
    <InfoNotification>Use the token provided in the header of the presentation you are viewing</InfoNotification>

    <form onSubmit={handleSubmit}>
      <div className='field' style={{marginBottom: '1.5rem'}}>
        <div className='control'>
          <Form.Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type='text'
            placeholder='Token'
            size='large'
            />
        </div>
      </div>
      <div className='field'>
        <div className='control'>
          <Button
            type='submit'
            color='primary'
            size='medium'
            fullwidth>Join</Button>
        </div>
      </div>
    </form>
    
  </main>
}
