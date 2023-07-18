import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';
import { NavLink, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import { addColumn, removeColumn, moveColumn } from 'flavours/aether/actions/columns';
import { connectPublicStream } from 'flavours/aether/actions/streaming';
import { expandPublicTimeline } from 'flavours/aether/actions/timelines';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import { DismissableBanner } from 'flavours/aether/components/dismissable_banner';
import SearchContainer from 'flavours/aether/features/compose/containers/search_container';
import Statuses from 'flavours/aether/features/explore/statuses';
import Suggestions from 'flavours/aether/features/explore/suggestions';
import Tags from 'flavours/aether/features/explore/tags';
import StatusListContainer from 'flavours/aether/features/ui/containers/status_list_container';
import { domain } from 'flavours/glitch/initial_state';

import ColumnSettingsContainer from './containers/column_settings_container';



const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Federated timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const onlyMedia = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyMedia']) : state.getIn(['settings', 'public', 'other', 'onlyMedia']);
  const onlyRemote = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyRemote']) : state.getIn(['settings', 'public', 'other', 'onlyRemote']);
  const allowLocalOnly = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'allowLocalOnly']) : state.getIn(['settings', 'public', 'other', 'allowLocalOnly']);
  const regex = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'regex', 'body']) : state.getIn(['settings', 'public', 'regex', 'body']);
  const timelineState = state.getIn(['timelines', `public${onlyMedia ? ':media' : ''}`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    onlyRemote,
    allowLocalOnly,
    regex,
  };
};

class PublicTimeline extends PureComponent {

  static defaultProps = {
    onlyMedia: false,
  };

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    onlyRemote: PropTypes.bool,
    allowLocalOnly: PropTypes.bool,
    regex: PropTypes.string,
  };

  handlePin = () => {
    const { columnId, dispatch, onlyMedia, onlyRemote, allowLocalOnly } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn(onlyRemote ? 'REMOTE' : 'PUBLIC', { other: { onlyMedia, onlyRemote, allowLocalOnly } }));
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
    const { dispatch, onlyMedia, onlyRemote, allowLocalOnly } = this.props;
    const { signedIn } = this.context.identity;

    dispatch(expandPublicTimeline({ onlyMedia, onlyRemote, allowLocalOnly }));
    if (signedIn) {
      this.disconnect = dispatch(connectPublicStream({ onlyMedia, onlyRemote, allowLocalOnly }));
    }
  }

  componentDidUpdate (prevProps) {
    const { signedIn } = this.context.identity;

    if (prevProps.onlyMedia !== this.props.onlyMedia || prevProps.onlyRemote !== this.props.onlyRemote || prevProps.allowLocalOnly !== this.props.allowLocalOnly) {
      const { dispatch, onlyMedia, onlyRemote, allowLocalOnly } = this.props;

      if (this.disconnect) {
        this.disconnect();
      }

      dispatch(expandPublicTimeline({ onlyMedia, onlyRemote, allowLocalOnly }));

      if (signedIn) {
        this.disconnect = dispatch(connectPublicStream({ onlyMedia, onlyRemote, allowLocalOnly }));
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
    const { dispatch, onlyMedia, onlyRemote, allowLocalOnly } = this.props;

    dispatch(expandPublicTimeline({ maxId, onlyMedia, onlyRemote, allowLocalOnly }));
  };

  render () {
    const { intl, columnId, hasUnread, multiColumn, onlyMedia, onlyRemote, allowLocalOnly } = this.props;
    const pinned = !!columnId;
    const { signedIn } = this.context.identity;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} name='federated' label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='globe'
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

        <div className='scrollable public-scroll'>

          <div className='account__section-headline'>
              <NavLink exact to='/explore/local'>
                <FormattedMessage tagName='div' id='explore.local' defaultMessage='Local Timeline' />
              </NavLink>
              <NavLink exact to='/explore/federated'>
                <FormattedMessage tagName='div' id='explore.federated' defaultMessage='Federated Timeline' />
              </NavLink>
              <NavLink exact to='/explore/posts'>
                <FormattedMessage tagName='div' id='explore.trending_statuses' defaultMessage='Popular Posts' />
              </NavLink>
              {multiColumn && signedIn && (
                <NavLink exact to='/explore/suggestions'>
                  <FormattedMessage tagName='div' id='explore.suggested_follows' defaultMessage='Suggested' />
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

          <StatusListContainer
            prepend={<DismissableBanner id='public_timeline'><FormattedMessage id='dismissable_banner.public_timeline' defaultMessage='These are the most recent public posts from people on the social web that people on {domain} follow.' values={{ domain }} /></DismissableBanner>}
            timelineId={`public${onlyRemote ? ':remote' : (allowLocalOnly ? ':allow_local_only' : '')}${onlyMedia ? ':media' : ''}`}
            onLoadMore={this.handleLoadMore}
            trackScroll={!pinned}
            scrollKey={`public_timeline-${columnId}`}
            emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
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

export default connect(mapStateToProps)(injectIntl(PublicTimeline));
