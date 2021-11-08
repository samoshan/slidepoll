import { Button } from 'react-bulma-components';
import { Link } from 'react-router-dom';

export default function LinkButton(props) {
  const color = props.color || 'link';
  return <Button to={props.to} renderAs={Link} color={color} {...props}>{props.children}</Button>
}
