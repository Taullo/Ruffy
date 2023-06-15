import PropTypes from 'prop-types';
import { Component } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import NavigationPortal from 'flavours/aether/components/navigation_portal';
import { timelinePreview, showTrends } from 'flavours/aether/initial_state';
import { preferencesLink } from 'flavours/aether/utils/backend_links';

import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import ListPanel from './list_panel';
import SignInBanner from './sign_in_banner';

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  profile: { id: 'tabs_bar.profile', defaultMessage: 'Profile' },
  local: { id: 'tabs_bar.local_timeline', defaultMessage: 'Local' },
  federated: { id: 'tabs_bar.federated_timeline', defaultMessage: 'Federated' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  app_settings: { id: 'navigation_bar.app_settings', defaultMessage: 'App settings' },
});

class NavigationPanel extends Component {

  static contextTypes = {
    router: PropTypes.object.isRequired,
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenSettings: PropTypes.func,
  };

  render() {
    const { intl, onOpenSettings } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;
    const Account = connect(state => ({
      account: state.getIn(['accounts', me]),
    }))(({ account }) => (
      <ColumnLink transparent to={`/@${account.get('acct')}`} icon='user-circle' text={intl.formatMessage(messages.profile)} />
    ));

    return (
      <div className='navigation-panel'>
        {signedIn && (
          <>
            <span className='hideondesktop'><ColumnLink transparent to='/home' icon='home' text={intl.formatMessage(messages.home)} /></span>

            <span className='hideondesktop'><FollowRequestsColumnLink /></span>
          </>
        )}

        {showTrends ? (
          <span className='hideondesktop'><ColumnLink transparent to='/explore' icon='hashtag' text={intl.formatMessage(messages.explore)} /></span>
        ) : (
          <span className='hideondesktop'><ColumnLink transparent to='/search' icon='search' text={intl.formatMessage(messages.search)} /></span>
        )}

        {signedIn && (
          <React.Fragment>
            <span className='hideondesktop'><Account /></span>
            <span className='hideondesktop'><ColumnLink transparent to='/conversations' icon='envelope' text={intl.formatMessage(messages.direct)} /></span>
          </React.Fragment>
        )}

        {(signedIn || timelinePreview) && (
          <>
            <ColumnLink transparent to='/public/local' icon='users' text={intl.formatMessage(messages.local)} />
            <ColumnLink transparent exact to='/public' icon='globe' text={intl.formatMessage(messages.federated)} />
          </>
        )}

        <div className='navigation-panel__legal'>
          <span className='hideondesktop'><ColumnLink transparent to='/about' icon='info' text={intl.formatMessage(messages.about)} /></span>
        </div>

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && (

          <>

            <ListPanel />

            <hr className='hideondesktop' />

            <span className='hideondesktop'><ColumnLink transparent onClick={onOpenSettings} icon='cogs' text={intl.formatMessage(messages.app_settings)} /></span>
          </>
        )}

        <NavigationPortal />
      </div>
    );
  }

}

export default injectIntl(NavigationPanel);
