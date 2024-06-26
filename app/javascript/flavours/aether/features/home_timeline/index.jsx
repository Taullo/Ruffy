import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchAnnouncements, toggleShowAnnouncements } from 'flavours/aether/actions/announcements';
import { openModal } from 'flavours/aether/actions/modal';
import { IconWithBadge } from 'flavours/aether/components/icon_with_badge';
import { NotSignedInIndicator } from 'flavours/aether/components/not_signed_in_indicator';
import ComposeFormContainer from 'flavours/aether/features/compose/containers/compose_form_container';
import SearchContainer from 'flavours/aether/features/compose/containers/search_container';
import Suggestions from 'flavours/aether/features/firehose/components/suggestions';
import Tags from 'flavours/aether/features/firehose/components/tags';
import AnnouncementsContainer from 'flavours/aether/features/getting_started/containers/announcements_container';
import ListPanel from 'flavours/aether/features/ui/components/list_panel';
import { me, criticalUpdatesPending } from 'flavours/aether/initial_state';

import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { expandHomeTimeline } from '../../actions/timelines';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import StatusListContainer from '../ui/containers/status_list_container';

import { ColumnSettings } from './components/column_settings';
import { CriticalUpdateBanner } from './components/critical_update_banner';
import { ExplorePrompt } from './components/explore_prompt';


const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
  show_announcements: { id: 'home.show_announcements', defaultMessage: 'Show announcements' },
  hide_announcements: { id: 'home.hide_announcements', defaultMessage: 'Hide announcements' },
});

const getHomeFeedSpeed = createSelector([
  state => state.getIn(['timelines', 'home', 'items'], ImmutableList()),
  state => state.getIn(['timelines', 'home', 'pendingItems'], ImmutableList()),
  state => state.get('statuses'),
], (statusIds, pendingStatusIds, statusMap) => {
  const recentStatusIds = pendingStatusIds.concat(statusIds);
  const statuses = recentStatusIds.filter(id => id !== null).map(id => statusMap.get(id)).filter(status => status?.get('account') !== me).take(20);

  if (statuses.isEmpty()) {
    return {
      gap: 0,
      newest: new Date(0),
    };
  }

  const datetimes = statuses.map(status => status.get('created_at', 0));
  const oldest = new Date(datetimes.min());
  const newest = new Date(datetimes.max());
  const averageGap = (newest - oldest) / (1000 * (statuses.size + 1)); // Average gap between posts on first page in seconds

  return {
    gap: averageGap,
    newest,
  };
});

const homeTooSlow = createSelector([
  state => state.getIn(['timelines', 'home', 'isLoading']),
  state => state.getIn(['timelines', 'home', 'isPartial']),
  getHomeFeedSpeed,
], (isLoading, isPartial, speed) =>
  !isLoading && !isPartial // Only if the home feed has finished loading
  && (
    (speed.gap > (30 * 60) // If the average gap between posts is more than 30 minutes
    || (Date.now() - speed.newest) > (1000 * 3600)) // If the most recent post is from over an hour ago
  )
);

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
  hasAnnouncements: !state.getIn(['announcements', 'items']).isEmpty(),
  unreadAnnouncements: state.getIn(['announcements', 'items']).count(item => !item.get('read')),
  showAnnouncements: state.getIn(['announcements', 'show']),
  tooSlow: homeTooSlow(state),
  regex: state.getIn(['settings', 'home', 'regex', 'body']),
  showRightColumn: (state.getIn(['local_settings', 'right_column', 'visibility']) === 'show'),
  showLists: state.getIn(['local_settings', 'right_column', 'widgets', 'lists']),
  showHashtags: state.getIn(['local_settings', 'right_column', 'widgets', 'hashtags']),
  showSuggestions: state.getIn(['local_settings', 'right_column', 'widgets', 'suggestions']),
});

class HomeTimeline extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    isPartial: PropTypes.bool,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasAnnouncements: PropTypes.bool,
    unreadAnnouncements: PropTypes.number,
    showAnnouncements: PropTypes.bool,
    tooSlow: PropTypes.bool,
    regex: PropTypes.string,
    showRightColumn: PropTypes.bool,
    showLists: PropTypes.bool,
    showHashtags: PropTypes.bool,
    showSuggestions: PropTypes.bool,
  };
  
  openTrendingHashtags = () => {
    this.props.dispatch(openModal({
      modalType: 'TRENDING_HASHTAGS',
      modalProps: {},
    }));
  };
  
  openSuggestions = () => {
    this.props.dispatch(openModal({
      modalType: 'SUGGESTIONS',
      modalProps: {},
    }));
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('HOME', {}));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }));
  };

  componentDidMount () {
    setTimeout(() => this.props.dispatch(fetchAnnouncements()), 700);
    this._checkIfReloadNeeded(false, this.props.isPartial);
  }

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial);
  }

  componentWillUnmount () {
    this._stopPolling();
  }

  _checkIfReloadNeeded (wasPartial, isPartial) {
    const { dispatch } = this.props;

    if (wasPartial === isPartial) {
      return;
    } else if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else if (wasPartial && !isPartial) {
      this._stopPolling();
    }
  }

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }

  handleToggleAnnouncementsClick = (e) => {
    e.stopPropagation();
    this.props.dispatch(toggleShowAnnouncements());
  };

  render () {
    const { intl, hasUnread, columnId, multiColumn, tooSlow, hasAnnouncements, unreadAnnouncements, showAnnouncements, showRightColumn, showLists, showHashtags, showSuggestions } = this.props;
    const pinned = !!columnId;
    const { signedIn } = this.context.identity;
    const banners = [];

    let announcementsButton;

    if (hasAnnouncements) {
      announcementsButton = (
        <button
          className={classNames('column-header__button', { 'active': showAnnouncements })}
          title={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          aria-label={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          onClick={this.handleToggleAnnouncementsClick}
        >
          <IconWithBadge id='bullhorn' count={unreadAnnouncements} />
        </button>
      );
    }

    if (criticalUpdatesPending) {
      banners.push(<CriticalUpdateBanner key='critical-update-banner' />);
    }

    if (tooSlow) {
      banners.push(<ExplorePrompt key='explore-prompt' />);
    }

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} name='home' label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='home'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          extraButton={announcementsButton}
          appendContent={hasAnnouncements && showAnnouncements && <AnnouncementsContainer />}
        >
          <ColumnSettings />
        </ColumnHeader>

        {((showRightColumn || !signedIn) && !multiColumn) && (
          <div className='right_column right_column__home'>

            <div className='fixed_wrapper'>

              <div className='explore__search-header'>
                <SearchContainer openInRoute />
              </div>

              {showLists && !multiColumn && signedIn && (
                <ListPanel />
              )}

              {showHashtags && !multiColumn && (
                <div className='explore__tags-header'>
                  <Tags openInRoute />
                  <div className='right-column-show-more'>
                    <button className='button button-tertiary' onClick={this.openTrendingHashtags} >
                      <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
                    </button>
                  </div>
                </div>
              )}

              {showSuggestions && !multiColumn && signedIn && (
                <div className='explore__suggested-header'>
                  <Suggestions openInRoute />
                  <div className='right-column-show-more'>
                    <button className='button button-tertiary' onClick={this.openSuggestions} >
                      <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {signedIn ? (
          <StatusListContainer
            prepend={[
              ...banners,
              !multiColumn && <ComposeFormContainer key='compose-form' />,
            ]}
            alwaysPrepend
            trackScroll={!pinned}
            scrollKey={`home_timeline-${columnId}`}
            onLoadMore={this.handleLoadMore}
            timelineId='home'
            emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Follow more people to fill it up.' />}
            bindToDocument={!multiColumn}
            regex={this.props.regex}
          />
        ) : <NotSignedInIndicator />}

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(HomeTimeline));
