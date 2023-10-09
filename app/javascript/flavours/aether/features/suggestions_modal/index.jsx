//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

//  Our imports
import Suggestions from 'flavours/aether/features/firehose/components/suggestions';

const dispatch = ({
  onClose () {
    dispatch({
      modalType: undefined,
      ignoreFocus: false,
    });
  },
});

class ComposeModal extends PureComponent {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  handleClose = (e) => {
    if (e.target.className === 'display-name') {
      this.props.onClose();
    }
  };

  navigateTo = (index) =>
    this.setState({ currentIndex: +index });

  render () {

    return (
      <div className='aether modal-root__modal suggestions-modal'>
        <Suggestions onClick={this.handleClose} />
      </div>
    );
  }

}

export default ComposeModal;
