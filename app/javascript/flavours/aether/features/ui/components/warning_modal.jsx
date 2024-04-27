import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, FormattedMessage } from 'react-intl';

import Button from 'flavours/aether/components/button';

class ConfirmationModal extends PureComponent {

  static propTypes = {
    message: PropTypes.node.isRequired,
    confirm: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    closeWhenConfirm: PropTypes.bool,
    onDoNotAsk: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    closeWhenConfirm: true,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleCancel = () => {
    this.props.onClose();
  };

  setRef = (c) => {
    this.button = c;
  };

  setDoNotAskRef = (c) => {
    this.doNotAskCheckbox = c;
  };

  render () {
    const { message, confirm, onDoNotAsk } = this.props;

    return (
      <div className='modal-root__modal confirmation-modal warning-modal'>
        <div className='confirmation-modal__container'>
          {message}
        </div>

        <div>
          { onDoNotAsk && (
            <div className='confirmation-modal__do_not_ask_again'>
              <input type='checkbox' id='confirmation-modal__do_not_ask_again-checkbox' ref={this.setDoNotAskRef} />
              <label for='confirmation-modal__do_not_ask_again-checkbox'>
                <FormattedMessage id='confirmation_modal.do_not_ask_again' defaultMessage='Do not ask for confirmation again' />
              </label>
            </div>
          )}
          <div className='confirmation-modal__action-bar warning-modal__action-bar'>
            <Button text={confirm} onClick={this.handleCancel} ref={this.setRef} />
          </div>
        </div>
      </div>
    );
  }

}

export default injectIntl(ConfirmationModal);
