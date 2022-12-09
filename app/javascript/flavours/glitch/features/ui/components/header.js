import React from 'react';
import Logo from 'flavours/glitch/components/logo';
import { Link, withRouter } from 'react-router-dom';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { registrationsOpen, me } from 'flavours/glitch/initial_state';
import Avatar from 'flavours/glitch/components/avatar';
import Permalink from 'flavours/glitch/components/permalink';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ColumnLink from 'flavours/glitch/features/ui/components/column_link';
import IconButton from 'flavours/glitch/components/icon_button';
import NotificationsCounterIcon from './notifications_counter_icon';
import DropdownMenuContainer from 'flavours/glitch/containers/dropdown_menu_container';
import { NavLink } from 'react-router-dom';
import { preferencesLink, profileLink, accountAdminLink } from 'flavours/glitch/utils/backend_links';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  cancel_follow_request: { id: 'account.cancel_follow_request', defaultMessage: 'Withdraw follow request' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit Profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention @{name}' },
  direct: { id: 'account.direct', defaultMessage: 'Direct message @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Block domain {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unblock domain {domain}' },
  hideReblogs: { id: 'account.hide_reblogs', defaultMessage: 'Hide boosts from @{name}' },
  showReblogs: { id: 'account.show_reblogs', defaultMessage: 'Show boosts from @{name}' },
  enableNotifications: { id: 'account.enable_notifications', defaultMessage: 'Notify me when @{name} posts' },
  disableNotifications: { id: 'account.disable_notifications', defaultMessage: 'Stop notifying me when @{name} posts' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned posts' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Manage lists' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Blocked domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  add_account_note: { id: 'account.add_account_note', defaultMessage: 'Add note for @{name}' },
  languages: { id: 'account.languages', defaultMessage: 'Change subscribed languages' },
  openOriginalPage: { id: 'account.open_original_page', defaultMessage: 'Open original page' },
});
const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Permalink href={account.get('url')} to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Permalink>
));

export default @withRouter @injectIntl
class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { intl } = this.props;
    const { signedIn } = this.context.identity;
    const { location } = this.props;
    
    let menu        = [];
    menu.push({ text: intl.formatMessage(messages.edit_profile), href: profileLink });
    menu.push({ text: intl.formatMessage(messages.preferences), href: preferencesLink });
    menu.push({ text: intl.formatMessage(messages.lists), to: '/lists', href: '/lists' });
    menu.push({ text: intl.formatMessage(messages.pins), to: '/pinned', href: '/pinned' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.follow_requests), to: '/follow_requests', href: '/follow_requests'});
    menu.push({ text: intl.formatMessage(messages.favourites), to: '/favourites', href: '/favourites' });
    menu.push({ text: intl.formatMessage(messages.bookmarks), to: '/bookmarks', href: '/bookmarks' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.mutes), to: '/mutes', href: '/mutes' });
    menu.push({ text: intl.formatMessage(messages.blocks), to: '/blocks', href: '/blocks' });
    menu.push({ text: intl.formatMessage(messages.domain_blocks), to: '/domain_blocks', href: '/domain_blocks' });

    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/publish' && <Link to='/publish' className='button'><FormattedMessage id='compose_form.publish_form' defaultMessage='New post' /></Link>}
          <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='header-link__notif' />}/>
          <Account />
          <DropdownMenuContainer disabled={menu.length === 0} items={menu} icon='chevron-down' size={12} direction='right' />
        </>
      );
    } else {
      content = (
        <>
          <a href='/auth/sign_in' className='button'><FormattedMessage id='sign_in_banner.sign_in' defaultMessage='Sign in' /></a>
          <a href={registrationsOpen ? '/auth/sign_up' : 'https://joinmastodon.org/servers'} className='button button-tertiary'><FormattedMessage id='sign_in_banner.create_account' defaultMessage='Create account' /></a>
        </>
      );
    }

    return (
    <div className='ui__header__wrapper'>
      <div className='ui__header'>
        <Link to='/' className='ui__header__logo'><Logo /></Link>

        <div className='ui__header__links'>
          {content}
        </div>
      </div>
    </div>
    );
  }

}
