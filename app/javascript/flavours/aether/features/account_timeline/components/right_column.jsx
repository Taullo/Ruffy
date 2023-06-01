import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Fields from 'flavours/aether/features/account/components/fields';
import ActionBar from 'flavours/aether/features/account/components/action_bar';
import ImmutablePureComponent from 'react-immutable-pure-component';
import MemorialNote from './memorial_note';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import MovedNote from './moved_note';

export default class RightColumn extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    hideTabs: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleChangeLanguages = () => {
    this.props.onChangeLanguages(this.props.account);
  };

  handleInteractionModal = () => {
    this.props.onInteractionModal(this.props.account);
  };


  render () {
    const { account, hidden, hideTabs } = this.props;

    if (account === null) {
      return null;
    }

    return (
      <div className='account-timeline__right-column'>
        
        <Fields 
          account={account}
          domain={this.props.domain}
          hidden={hidden}
        />

      </div>
    );
  }

}
