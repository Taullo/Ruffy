//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

//  Our imports
import TrendingHashtags from 'flavours/aether/features/firehose/components/tags';

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
    if (e.target.className === 'trends__item') {
      this.props.onClose();
    }
  };

  navigateTo = (index) =>
    this.setState({ currentIndex: +index });

  render () {

    return (
      <div className='aether modal-root__modal trending_hashtags-modal'>
        <TrendingHashtags onClick={this.handleClose} />
      </div>
    );
  }

}

export default ComposeModal;
