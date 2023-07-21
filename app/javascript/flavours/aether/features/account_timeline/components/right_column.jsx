import PropTypes from 'prop-types';
import React from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import Fields from 'flavours/aether/features/account/components/fields';


export default class RightColumn extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
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
    const { account, hidden } = this.props;

    if (account === null) {
      return null;
    }

    return (
        
        <Fields 
          account={account}
          domain={this.props.domain}
          hidden={hidden}
        />

    );
  }

}
