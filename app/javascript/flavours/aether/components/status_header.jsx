//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

//  Mastodon imports.
import { Avatar } from './avatar';
import AvatarOverlay from './avatar_overlay';
import { DisplayName } from './display_name';

export default class StatusHeader extends PureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    friend: ImmutablePropTypes.map,
    parseClick: PropTypes.func.isRequired,
  };

  //  Handles clicks on account name
  handleClick = (acct, e) => {
    const { parseClick } = this.props;
    parseClick(e, `/@${acct}`);
  };

  handleAccountClick = (e) => {
    const { status } = this.props;
    this.handleClick(status.getIn(['account', 'acct']), e);
  };

  //  Rendering.
  render () {
    const {
      status,
      friend,
      parseClick,
    } = this.props;

    const account = status.get('account');
    const accountLink = `/@${account.get('acct')}`;

    let statusAvatar;
    if (friend === undefined || friend === null) {
      statusAvatar = <a href={accountLink} onClick={this.handleAccountClick} ><Avatar account={account} size={62} /></a>;
    } else {
      statusAvatar = <AvatarOverlay account={account} friend={friend} parseClick={parseClick} />;
    }

    return (
      <div className='status__info__account'>
        <div
          className='status__avatar'
        >
          {statusAvatar}
        </div>
        <a
          href={accountLink}
          target='_blank'
          className='status__display-name'
          onClick={this.handleAccountClick}
          rel='noopener noreferrer'
        >
          <DisplayName account={account} />
        </a>
      </div>
    );
  }

}
