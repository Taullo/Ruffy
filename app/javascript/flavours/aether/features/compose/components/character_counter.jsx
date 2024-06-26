import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { length } from 'stringz';

export default class CharacterCounter extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
  };

  checkRemainingText (diff) {
    if (diff < 1000) {
      return <span className='character-counter character-counter--over'>{diff}</span>;
    }

    return <span className='character-counter'></span>;
  }

  render () {
    const diff = this.props.max - length(this.props.text);
    return this.checkRemainingText(diff);
  }

}
