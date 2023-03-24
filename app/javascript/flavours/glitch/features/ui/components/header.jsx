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
import { openModal } from 'flavours/glitch/actions/modal';
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
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  add_account_note: { id: 'account.add_account_note', defaultMessage: 'Add note for @{name}' },
  languages: { id: 'account.languages', defaultMessage: 'Change subscribed languages' },
  openOriginalPage: { id: 'account.open_original_page', defaultMessage: 'Open original page' },
  
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  profile: { id: 'tabs_bar.profile', defaultMessage: 'Profile' },
  local: { id: 'tabs_bar.local_timeline', defaultMessage: 'Local' },
  federated: { id: 'tabs_bar.federated_timeline', defaultMessage: 'Federated' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Messages' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  app_settings: { id: 'navigation_bar.app_settings', defaultMessage: 'Display' },
  
  logoutMessage: { id: 'confirmations.logout.message', defaultMessage: 'Are you sure you want to log out?' },
  logoutConfirm: { id: 'confirmations.logout.confirm', defaultMessage: 'Log out' },
});
const Account = connect(state => ({
  account: state.getIn(['accounts', me]),
}))(({ account }) => (
  <Permalink href={account.get('url')} to={`/@${account.get('acct')}`} title={account.get('acct')}>
    <Avatar account={account} size={35} />
  </Permalink>
));

const mapDispatchToProps = (dispatch) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal('CLOSED_REGISTRATIONS'));
  },
  openSettings: () => dispatch(openModal('SETTINGS', {})),
  onLogout () {
    dispatch(openModal('CONFIRM', {
      message: intl.formatMessage(messages.logoutMessage),
      confirm: intl.formatMessage(messages.logoutConfirm),
      closeWhenConfirm: false,
      onConfirm: () => logOut(),
    }));
  },
});

export default @withRouter @injectIntl
@connect(null, mapDispatchToProps)
class Header extends React.PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
  };
  
  handleLogout = () => {
    this.props.onLogout();
  }

  render () {
    const { intl, openSettings, location, openClosedRegistrationsModal } = this.props;
    const { signedIn } = this.context.identity;
    
    let menu        = [];
    menu.push({ text: intl.formatMessage(messages.edit_profile), href: profileLink });
    menu.push({ text: intl.formatMessage(messages.preferences), href: preferencesLink });
    menu.push({ text: intl.formatMessage(messages.filters), href: '/filters' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.follow_requests), to: '/follow_requests', href: '/follow_requests'});
    menu.push({ text: intl.formatMessage(messages.lists), to: '/lists', href: '/lists' });
    menu.push({ text: intl.formatMessage(messages.favourites), to: '/favourites', href: '/favourites' });
    menu.push({ text: intl.formatMessage(messages.bookmarks), to: '/bookmarks', href: '/bookmarks' });
    menu.push({ text: intl.formatMessage(messages.pins), to: '/pinned', href: '/pinned' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.mutes), to: '/mutes', href: '/mutes' });
    menu.push({ text: intl.formatMessage(messages.blocks), to: '/blocks', href: '/blocks' });
    menu.push({ text: intl.formatMessage(messages.domain_blocks), to: '/domain_blocks', href: '/domain_blocks' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.logout), action: this.handleLogout });

    let content;

    if (signedIn) {
      content = (
        <>
          {location.pathname !== '/publish' && <Link icon='pen' to='/publish' className='button'><FormattedMessage id='compose_form.publish_form' defaultMessage='New post' /></Link>}
          <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='header-link__notif' />} title={intl.formatMessage(messages.notifications)}/>
          <ColumnLink transparent to='/conversations' icon='envelope' title={intl.formatMessage(messages.direct)} />
          <ColumnLink transparent icon='cogs' title={intl.formatMessage(messages.app_settings)} onClick={openSettings} />
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
        <div className='ui__header__left'>
          <Link to='/' className='ui__header__logo'><Logo /></Link>
          <ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} />
          <ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} />
        </div>

        <div className='ui__header__links'>
          {content}
        </div>
      </div>
    </div>
    );
  }

}
