import PropTypes from 'prop-types';

import { injectIntl, defineMessages } from 'react-intl';

import { Link } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Icon } from 'flavours/aether/components/icon';
import { signOutLink } from 'flavours/aether/utils/backend_links';
import { conditionalRender } from 'flavours/aether/utils/react_helpers';

const messages = defineMessages({
  community: {
    defaultMessage: 'Local timeline',
    id: 'navigation_bar.community_timeline',
  },
  home_timeline: {
    defaultMessage: 'Home',
    id: 'tabs_bar.home',
  },
  logout: {
    defaultMessage: 'Logout',
    id: 'navigation_bar.logout',
  },
  notifications: {
    defaultMessage: 'Notifications',
    id: 'tabs_bar.notifications',
  },
  public: {
    defaultMessage: 'Federated timeline',
    id: 'navigation_bar.public_timeline',
  },
  settings: {
    defaultMessage: 'Interface settings',
    id: 'navigation_bar.app_settings',
  },
  start: {
    defaultMessage: 'Getting started',
    id: 'getting_started.heading',
  },
});

class Header extends ImmutablePureComponent {

  static propTypes = {
    columns: ImmutablePropTypes.list,
    unreadNotifications: PropTypes.number,
    showNotificationsBadge: PropTypes.bool,
    intl: PropTypes.object,
    onSettingsClick: PropTypes.func,
    onLogout: PropTypes.func.isRequired,
  };

  handleLogoutClick = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onLogout();

    return false;
  };

  render () {
    const { intl, columns, unreadNotifications, showNotificationsBadge, onSettingsClick } = this.props;

    //  Only renders the component if the column isn't being shown.
    const renderForColumn = conditionalRender.bind(null,
      columnId => !columns || !columns.some(
        column => column.get('id') === columnId,
      ),
    );

    //  The result.
    return (
      <nav className='drawer__header'>
        <Link
          aria-label={intl.formatMessage(messages.start)}
          title={intl.formatMessage(messages.start)}
          to='/getting-started'
        ><Icon id='asterisk' /></Link>
        {renderForColumn('HOME', (
          <Link
            aria-label={intl.formatMessage(messages.home_timeline)}
            title={intl.formatMessage(messages.home_timeline)}
            to='/home'
          ><Icon id='home' /></Link>
        ))}
        {renderForColumn('NOTIFICATIONS', (
          <Link
            aria-label={intl.formatMessage(messages.notifications)}
            title={intl.formatMessage(messages.notifications)}
            to='/notifications'
          >
            <span className='icon-badge-wrapper'>
              <Icon id='bell' />
              { showNotificationsBadge && unreadNotifications > 0 && <div className='icon-badge' />}
            </span>
          </Link>
        ))}
        {renderForColumn('COMMUNITY', (
          <Link
            aria-label={intl.formatMessage(messages.community)}
            title={intl.formatMessage(messages.community)}
            to='/explore/local'
          ><Icon id='users' /></Link>
        ))}
        {renderForColumn('PUBLIC', (
          <Link
            aria-label={intl.formatMessage(messages.public)}
            title={intl.formatMessage(messages.public)}
            to='/explore/all'
          ><Icon id='globe' /></Link>
        ))}
        <a
          aria-label={intl.formatMessage(messages.settings)}
          onClick={onSettingsClick}
          href='/settings/preferences'
          title={intl.formatMessage(messages.settings)}
        ><Icon id='cogs' /></a>
        <a
          aria-label={intl.formatMessage(messages.logout)}
          onClick={this.handleLogoutClick}
          href={signOutLink}
          title={intl.formatMessage(messages.logout)}
        ><Icon id='sign-out' /></a>
      </nav>
    );
  }

}

export default injectIntl(Header);
