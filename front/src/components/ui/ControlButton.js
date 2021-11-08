import classNames from 'classnames'
import { Button } from 'react-bulma-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ControlButton(props) {
  const { tooltip, icon, ...pass } = props;
  return <Button
    {...pass}
    className={classNames(props.className, tooltip && 'has-tooltip-hidden-mobile')}
    data-tooltip={tooltip}
    size='medium'
    >
    <p>{props.children}</p>
    <FontAwesomeIcon icon={icon} fixedWidth />
  </Button>
}
