import { Button, Heading, Notification  } from 'react-bulma-components'
import { useHistory } from 'react-router'

import LinkButton from './LinkButton'

export default function NotFound(props) {

  const history = useHistory();
  const text = props.text || '404 Page not found';

  return (
    <Notification>
      <Heading size='2'>{text}</Heading>

      <div className='buttons'>
        <LinkButton
          to='/'
          >Home</LinkButton>

        <Button
          color='link'
          onClick={() => history.goBack()}
          >Go Back</Button>
      </div>
    </Notification>
  )
}
