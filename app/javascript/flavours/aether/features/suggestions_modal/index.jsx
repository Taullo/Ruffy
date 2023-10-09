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

  navigateTo = (index) =>
    this.setState({ currentIndex: +index });

  render () {

    return (
      <div className='aether modal-root__modal trending_hashtags-modal'>
        <Suggestions />
      </div>
    );
  }

}

export default ComposeModal;
