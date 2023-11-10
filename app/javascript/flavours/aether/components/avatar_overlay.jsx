import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { autoPlayGif } from 'flavours/aether/initial_state';

export default class AvatarOverlay extends PureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    friend: ImmutablePropTypes.map.isRequired,
    animate: PropTypes.bool,
    parseClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    animate: autoPlayGif,
  };
  
  //  Handles clicks on account image

  handleAccountClick = (e) => {
    const { parseClick } = this.props;
    parseClick(e, `/@${this.props.account.get('acct')}`);
  };

  handleFriendClick = (e) => {
    const { parseClick } = this.props;
    parseClick(e, `/@${this.props.friend.get('acct')}`);
  };

  render() {
    const { account, friend, animate } = this.props;
    const accountLink = `/@${account.get('acct')}`;
    const friendLink = `/@${friend.get('acct')}`;

    const baseStyle = {
      backgroundImage: `url(${account.get(animate ? 'avatar' : 'avatar_static')})`,
    };

    const overlayStyle = {
      backgroundImage: `url(${friend.get(animate ? 'avatar' : 'avatar_static')})`,
    };

    return (
      <div className='account__avatar-overlay'>
        <a href={accountLink} onClick={this.handleAccountClick} className='account__avatar-overlay-base' style={baseStyle} title={`@${account.get('acct')}`} data-avatar-of={`@${account.get('acct')}`} ><span aria-label={`@${account.get('acct')}`} /></a>
        <a href={friendLink} onClick={this.handleFriendClick} className='account__avatar-overlay-overlay' style={overlayStyle} title={`@${friend.get('acct')}`} data-avatar-of={`@${friend.get('acct')}`} ><span aria-label={`@${friend.get('acct')}`} /></a>
      </div>
    );
  }

}
