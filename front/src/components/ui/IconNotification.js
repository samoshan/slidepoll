import { Notification } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function IconNotification(props) {
  return (
    <Notification color={props.color} style={{display: 'flex'}}>
      <FontAwesomeIcon icon={props.icon} style={{ marginRight: 10, marginTop: 5}} />
      {props.children}
    </Notification>
  )
}