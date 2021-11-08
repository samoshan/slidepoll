import VariantManager from '../../VariantManager';

function VariantOption(props) {
  return <li onClick={props.onClick} className={props.selected ? 'selected' : undefined}>
    <p className='name'>{props.variant.name}</p>
    <p className='help'>{props.variant.description}</p>
  </li>
}

export default function VariantPicker(props) {
  const setChoice = props.setChoice;

  const variantOptions = VariantManager.getAll().map((variant) => (
    <VariantOption
      key={variant.id}
      variant={variant}
      onClick={() => setChoice(variant.id)}
      selected={variant.id === props.selected}
      />
  ))

  return <div className='variant-select'><ul>{variantOptions}</ul></div>
}
