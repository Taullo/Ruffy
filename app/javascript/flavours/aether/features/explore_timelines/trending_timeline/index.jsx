import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import { addColumn, removeColumn, moveColumn } from 'flavours/aether/actions/columns';
import { expandTrendingTimeline } from 'flavours/aether/actions/timelines';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import { DismissableBanner } from 'flavours/aether/components/dismissable_banner';
import StatusListContainer from 'flavours/aether/features/ui/containers/status_list_container';
import { domain } from 'flavours/aether/initial_state';

const messages = defineMessages({
  title: { id: 'column.trending', defaultMessage: 'Popular Posts' },
});

const mapStateToProps = (state) => {
  const timelineState = state.getIn(['timelines', 'trending']);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
  };
};

class TrendingTimeline extends PureComponent {

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
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('TRENDING'));
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
    const { dispatch } = this.props;

    dispatch(expandTrendingTimeline());
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

  handleLoadMore = () => {
    const { dispatch } = this.props;

    dispatch(expandTrendingTimeline({}));
  };

  render () {
    const { intl, columnId, hasUnread, multiColumn } = this.props;
    const pinned = !!columnId;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} name='trending' label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='commenting'
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
         />

        <div className='scrollable trending-scroll'>
          <StatusListContainer
            prepend={<DismissableBanner id='trending_timeline'><FormattedMessage id='dismissable_banner.explore_statuses' defaultMessage='These are posts from across the fediverse that are gaining traction today. Newer posts with more boosts and favourites are ranked higher.' values={{ domain }} /></DismissableBanner>}
            timelineId={`trending`}
            onLoadMore={this.handleLoadMore}
            trackScroll={!pinned}
            scrollKey={`trending_timeline-${columnId}`}
            emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
            bindToDocument={!multiColumn}
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

export default connect(mapStateToProps)(injectIntl(TrendingTimeline));
