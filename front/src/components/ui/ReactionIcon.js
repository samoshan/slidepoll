import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ReactionIcon(props) {
  const size = props.size || '3x';
  const isRotated = Array.isArray(props.icon);
  const icon = isRotated ? props.icon[0] : props.icon;

  return (
    <FontAwesomeIcon
      icon={['far', icon]}
      size={size}
      style={{
        ...props.style,
        transform: isRotated ? `rotate(${props.icon[1]}deg)` : undefined
      }}
      />
  )
}
