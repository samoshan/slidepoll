import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bulma-components'

export default function IconButton(props) {
  const { tooltip, icon, iconSize, span, ...pass } = props;
  return <Button
    {...pass}
    //className={tooltip && 'has-tooltip-hidden-mobile'}
    className={classNames(props.className, tooltip && 'has-tooltip-hidden-mobile')}
    data-tooltip={tooltip}
    >
    <span className='icon'>
      <FontAwesomeIcon icon={icon} size={iconSize} />
    </span>
    { props.children && <span>{props.children}</span> }
  </Button>
}
