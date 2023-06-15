import { connect } from 'react-redux';

import { changeComposeVisibility } from 'flavours/aether/actions/compose';
import { openModal, closeModal } from 'flavours/aether/actions/modal';
import { isUserTouching } from 'flavours/aether/is_mobile';

import PrivacyDropdown from '../components/privacy_dropdown';

const mapStateToProps = state => ({
  value: state.getIn(['compose', 'privacy']),
});

const mapDispatchToProps = dispatch => ({

  onChange (value) {
    dispatch(changeComposeVisibility(value));
  },

  isUserTouching,
  onModalOpen: props => dispatch(openModal({
    modalType: 'ACTIONS',
    modalProps: props,
  })),
  onModalClose: () => dispatch(closeModal({
    modalType: undefined,
    ignoreFocus: false,
  })),

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyDropdown);
