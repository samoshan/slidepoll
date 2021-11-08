import IconNotification from './IconNotification'

export default function WarningNotification(props) {
  return (
    <IconNotification color='info' icon='info-circle'>
      {props.children}
    </IconNotification>
  )
}
