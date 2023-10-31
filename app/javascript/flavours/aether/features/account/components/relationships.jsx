import PropTypes from 'prop-types';
import React from 'react';

import { injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';


import { FollowersCounter, FollowingCounter, StatusesCounter } from 'flavours/aether/components/counters';
import { ShortNumber } from 'flavours/aether/components/short_number';


class Relationships extends ImmutablePureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    account: ImmutablePropTypes.map,
    identity_props: ImmutablePropTypes.list,
    onChangeLanguages: PropTypes.func.isRequired,
    onInteractionModal: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { account, intl } = this.props;

    if (!account) {
      return null;
    }

    return (
      <div className={classNames('account__header__extra__links', { inactive: !!account.get('moved') })}>
        <span title={intl.formatNumber(account.get('statuses_count'))}>
          <ShortNumber
            value={account.get('statuses_count')}
            renderer={StatusesCounter}
          />
        </span>

        <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/following`} title={intl.formatNumber(account.get('following_count'))}>
          <ShortNumber
            value={account.get('following_count')}
            renderer={FollowingCounter}
          />
        </NavLink>

        {(account.get('followers_count') >= 0) && (
          <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/followers`} title={intl.formatNumber(account.get('followers_count'))}>
            <ShortNumber
              value={account.get('followers_count')}
              renderer={FollowersCounter}
            />
          </NavLink>)}
        {(account.get('followers_count') === -1) && (
          <NavLink exact activeClassName='active' to={`/@${account.get('acct')}/followers`}>
            <FormattedMessage 
              id='account.followers'
              defaultMessage='Followers'
            />
          </NavLink>
        )}
      </div>
    );
  }

}

export default injectIntl(Relationships);
