import { Form } from 'react-bulma-components';

export default function Checkradio(props) {
  const color = props.color || 'info';
  const id = props.id || props.name;

  return (
    <Form.Field>
      <div className='checkradio'>
        <input 
          className={`is-checkradio is-${color}`}
          type='checkbox'
          name={props.name}
          id={id}
          checked={props.checked}
          onChange={props.onChange} />
        <label className='field-label' htmlFor={id}>{props.children}</label>
      </div>
    </Form.Field>
  )
}
