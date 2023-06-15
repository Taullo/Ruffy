import { connect } from 'react-redux';

import { openModal, closeModal } from 'flavours/aether/actions/modal';
import { isUserTouching } from 'flavours/aether/is_mobile';

import Dropdown from '../components/dropdown';

const mapDispatchToProps = dispatch => ({
  isUserTouching,
  onModalOpen: props => dispatch(openModal({ modalType: 'ACTIONS', modalProps: props })),
  onModalClose: () => dispatch(closeModal({ modalType: undefined, ignoreFocus: false })),
});

export default connect(null, mapDispatchToProps)(Dropdown);
