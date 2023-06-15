import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import { addColumn, removeColumn, moveColumn } from 'flavours/aether/actions/columns';
import { connectCommunityStream } from 'flavours/aether/actions/streaming';
import { expandCommunityTimeline } from 'flavours/aether/actions/timelines';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import DismissableBanner from 'flavours/aether/components/dismissable_banner';
import StatusListContainer from 'flavours/aether/features/ui/containers/status_list_container';
import { domain } from 'flavours/aether/initial_state';

import ColumnSettingsContainer from './containers/column_settings_container';

import { NavLink, Switch, Route } from 'react-router-dom';

import Tags from 'flavours/aether/features/explore/tags';
import Statuses from 'flavours/aether/features/explore/statuses';
import Suggestions from 'flavours/aether/features/explore/suggestions';

import SearchContainer from 'flavours/aether/features/compose/containers/search_container';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const onlyMedia = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyMedia']) : state.getIn(['settings', 'community', 'other', 'onlyMedia']);
  const regex = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'regex', 'body']) : state.getIn(['settings', 'community', 'regex', 'body']);
  const timelineState = state.getIn(['timelines', `community${onlyMedia ? ':media' : ''}`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    regex,
  };
};

class CommunityTimeline extends PureComponent {

  static defaultProps = {
    onlyMedia: false,
  };

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    columnId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    multiColumn: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    regex: PropTypes.string,
  };

  handlePin = () => {
    const { columnId, dispatch, onlyMedia } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('COMMUNITY', { other: { onlyMedia } }));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  componentDidMount () {
    const { dispatch, onlyMedia } = this.props;
    const { signedIn } = this.context.identity;

    dispatch(expandCommunityTimeline({ onlyMedia }));

    if (signedIn) {
      this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
    }
  }

  componentDidUpdate (prevProps) {
    const { signedIn } = this.context.identity;

    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;

      if (this.disconnect) {
        this.disconnect();
      }

      dispatch(expandCommunityTimeline({ onlyMedia }));

      if (signedIn) {
        this.disconnect = dispatch(connectCommunityStream({ onlyMedia }));
      }
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  setRef = c => {
    this.column = c;
  };

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
  };

  render () {
    const { intl, hasUnread, columnId, multiColumn, onlyMedia } = this.props;
    const pinned = !!columnId;
    const { signedIn } = this.context.identity;

    return (
      <Column ref={this.setRef} name='local' bindToDocument={!multiColumn} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='users'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
        >
          <ColumnSettingsContainer columnId={columnId} />
        </ColumnHeader>

        <div className='right_column'>
          <div className='fixed_wrapper'>
            <div className='explore__search-header'>
              <SearchContainer openInRoute />
            </div>

            <div className='explore__tags-header'>
              <Tags openInRoute />
              <div className='right-column-show-more'>
                <NavLink className='navbutton' exact to='/explore/tags'>
                  <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
                </NavLink>
              </div>
            </div>

            {!multiColumn &&signedIn && (
              <div className='explore__suggested-header'>
                <Suggestions openInRoute />
                <div className='right-column-show-more'>
                  <NavLink className='navbutton' exact to='/explore/suggestions'>
                    <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='scrollable community-scroll'>

          <>
            <div className='account__section-headline'>
              <NavLink exact to='/explore/local'>
                <FormattedMessage tagName='div' id='explore.local' defaultMessage='Local' />
              </NavLink>
              <NavLink exact to='/explore/federated'>
                <FormattedMessage tagName='div' id='explore.federated' defaultMessage='Fediverse' />
              </NavLink>
              <NavLink exact to='/explore/posts'>
                <FormattedMessage tagName='div' id='explore.trending_statuses' defaultMessage='Posts' />
              </NavLink>
              {multiColumn && signedIn && (
                <NavLink exact to='/explore/suggestions'>
                  <FormattedMessage tagName='div' id='explore.suggested_follows' defaultMessage='For you' />
                </NavLink>
              )}
            </div>

            <Switch>
              <Route path='/explore/tags' component={Tags} />
              <Route path='/explore/suggestions' component={Suggestions} />
              <Route exact path='/explore/posts'>
                <Statuses multiColumn={multiColumn} />
              </Route>
            </Switch>

            <DismissableBanner id='community_timeline'>
              <FormattedMessage id='dismissable_banner.community_timeline' defaultMessage='These are the most recent public posts from people whose accounts are hosted by {domain}.' values={{ domain }} />
            </DismissableBanner>

          </>

          <StatusListContainer
            trackScroll={!pinned}
            scrollKey={`community_timeline-${columnId}`}
            timelineId={`community${onlyMedia ? ':media' : ''}`}
            onLoadMore={this.handleLoadMore}
            emptyMessage={<FormattedMessage id='empty_column.community' defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!' />}
            bindToDocument={!multiColumn}
            regex={this.props.regex}
          />
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(CommunityTimeline));
