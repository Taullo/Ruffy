import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

import { Icon } from 'flavours/aether/components/icon';

const messages = defineMessages({
  profile: { id: 'column_header.profile', defaultMessage: 'Profile' },
});

class ProfileHeader extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  handleBackClick = () => {
    const { router } = this.context;

    if (router.history.location?.state?.fromMastodon) {
      router.history.goBack();
    } else {
      router.history.push('/');
    }
  };

  render() {

    return (
      <div className='column-header__wrapper'>
        <h1 className='column-header'>
          <button className='column-header__back-button'>
            <Icon id='arrow-left' onClick={this.handleBackClick} className='column-back-button__icon' fixedWidth />
          </button>
          <button>
            <Icon id='user-circle' fixedWidth className='column-header__icon' />
            <FormattedMessage id='messages.profile' defaultMessage='Profile' />
          </button>
        </h1>
      </div>
    );
  }

}

export default injectIntl(ProfileHeader);
