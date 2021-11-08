import IconNotification from './IconNotification'

export default function WarningNotification(props) {
  return (
    <IconNotification color='warning' icon='exclamation-circle'>
      {props.children}
    </IconNotification>
  )
}
