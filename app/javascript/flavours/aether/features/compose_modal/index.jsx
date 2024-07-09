//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';


//  Our imports
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';

import { resetCompose } from 'flavours/aether/actions/compose';
import { closeModal } from 'flavours/aether/actions/modal';
import ComposeFormContainer from 'flavours/aether/features/compose/containers/compose_form_container';

const mapDispatchToProps = dispatch => {
  return {
    onCancelCompose() {
      dispatch(resetCompose());
      dispatch(closeModal({
        modalType: undefined,
        ignoreFocus: false,
      }));
    },
  };
};

class ComposeModal extends PureComponent {

  static propTypes = {
    onCancelCompose: PropTypes.func.isRequired,
  };
  
  handleCancel = () => {
    this.props.onCancelCompose();
  };

  navigateTo = (index) =>
    this.setState({ currentIndex: +index });

  render () {

    return (
      <div className='aether modal-root__modal compose-modal'>
        <ComposeFormContainer autoFocus />
        <button className='button button-secondary button-cancel' onClick={this.handleCancel}><FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' /></button>
      </div>
    );
  }

}

export default connect(null, mapDispatchToProps)(ComposeModal);
