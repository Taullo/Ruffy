import PropTypes from 'prop-types';
import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import Fields from 'flavours/aether/features/account/components/fields';
import Relationships from 'flavours/aether/features/account/components/relationships';
import AccountNoteContainer from 'flavours/aether/features/account/containers/account_note_container';

export default class RightColumn extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    domain: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    identity_props: ImmutablePropTypes.list,
  };

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  handleChangeLanguages = () => {
    this.props.onChangeLanguages(this.props.account);
  };

  handleInteractionModal = () => {
    this.props.onInteractionModal(this.props.account);
  };


  render () {
    const { account, hidden } = this.props;
    const suspended = account.get('suspended');
    const fields = account.get('fields');
    const { signedIn } = this.context.identity;

    if (account === null) {
      return null;
    }

    return (
      <>
        <Fields 
          account={account}
          domain={this.props.domain}
          hidden={hidden}
          suspended={suspended}
          fields={fields}
        />
        
        {signedIn && <AccountNoteContainer account={account} />}
        
        <Relationships 
          account={account}
          domain={this.props.domain}
          hidden={hidden}
          suspended={suspended}
        />

      </>

    );
  }

}
