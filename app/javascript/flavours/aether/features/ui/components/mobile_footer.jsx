import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { withRouter } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';


import { openModal } from 'flavours/aether/actions/modal';
import { fetchServer } from 'flavours/aether/actions/server';
import DropdownMenuContainer from 'flavours/aether/containers/dropdown_menu_container';
import ColumnLink from 'flavours/aether/features/ui/components/column_link';
import { preferencesLink, profileLink } from 'flavours/aether/utils/backend_links';
import { logOut } from 'flavours/aether/utils/log_out';

import NotificationsCounterIcon from './notifications_counter_icon';


const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit Profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Block domain {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unblock domain {domain}' },
  hideReblogs: { id: 'account.hide_reblogs', defaultMessage: 'Hide boosts from @{name}' },
  showReblogs: { id: 'account.show_reblogs', defaultMessage: 'Show boosts from @{name}' },
  enableNotifications: { id: 'account.enable_notifications', defaultMessage: 'Notify me when @{name} posts' },
  disableNotifications: { id: 'account.disable_notifications', defaultMessage: 'Stop notifying me when @{name} posts' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned posts' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favorites' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Manage lists' },
  followed_tags: { id: 'navigation_bar.followed_tags', defaultMessage: 'Followed Tags' },
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

const mapStateToProps = (state) => ({
  server: state.getIn(['server', 'server']),
});

const mapDispatchToProps = (dispatch, { intl }) => ({
  openClosedRegistrationsModal() {
    dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS' }));
  },
  dispatchServer() {
    dispatch(fetchServer());
  },
  onLogout () {
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: intl.formatMessage(messages.logoutMessage),
        confirm: intl.formatMessage(messages.logoutConfirm),
        closeWhenConfirm: false,
        onConfirm: () => logOut(),
      },
    }));
  },
});

class MobileFooter extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    server: ImmutablePropTypes.map,
    openClosedRegistrationsModal: PropTypes.func,
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    dispatchServer: PropTypes.func,
  };

  handleLogout = () => {
    this.props.onLogout();
  };
  
  handleOpenSetting = () => {
    this.props.openSettings();
  };


  render () {
    const { signedIn } = this.context.identity;
    const { intl } = this.props;

    let menu        = [];
    menu.push({ text: intl.formatMessage(messages.edit_profile), href: profileLink });
    menu.push({ text: intl.formatMessage(messages.preferences), href: preferencesLink });
    menu.push({ text: intl.formatMessage(messages.app_settings), action: this.handleOpenSetting });
    menu.push({ text: intl.formatMessage(messages.filters), href: '/filters' });
    menu.push(null);
    menu.push({ text: intl.formatMessage(messages.follow_requests), to: '/follow_requests', href: '/follow_requests' });
    menu.push({ text: intl.formatMessage(messages.lists), to: '/lists', href: '/lists' });
    menu.push({ text: intl.formatMessage(messages.followed_tags), to: '/followed_tags', href: '/followed_tags' });
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
        <div className='ui__mobile__footer__wrapper'>
          <div className='ui__mobile__footer'>
            <ColumnLink transparent to='/home' icon='home' title={intl.formatMessage(messages.home)} />
            <ColumnLink transparent to='/explore/local' icon='hashtag' title={intl.formatMessage(messages.explore)} />
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='header-link__notif' />} title={intl.formatMessage(messages.notifications)} />
            <ColumnLink transparent to='/conversations' icon='comments' title={intl.formatMessage(messages.direct)} />
            <DropdownMenuContainer disabled={menu.length === 0} items={menu} icon='bars' direction='right' />
          </div>
        </div>
      );
    }

    return (
      <span>
        {content}
      </span>
    );
  }

}

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileFooter)));
