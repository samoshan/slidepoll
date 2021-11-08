import { Button } from 'react-bulma-components'

export default function ButtonAttatchedGroup(props) {
  return (
    <Button.Group 
      hasAddons
      flexWrap='nowrap'
      >
      {props.children}
    </Button.Group>
  )
}
