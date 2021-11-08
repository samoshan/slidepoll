import { Modal } from 'react-bulma-components';

export default function OpenModal(props) {
  return <Modal show {...props}>{props.children}</Modal>
}
