import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import { addColumn, removeColumn, moveColumn } from 'flavours/aether/actions/columns';
import { connectPublicStream } from 'flavours/aether/actions/streaming';
import { expandPublicTimeline } from 'flavours/aether/actions/timelines';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import { DismissableBanner } from 'flavours/aether/components/dismissable_banner';
import StatusListContainer from 'flavours/aether/features/ui/containers/status_list_container';
import { domain } from 'flavours/aether/initial_state';

import ColumnSettingsContainer from './containers/column_settings_container';

const messages = defineMessages({
  title: { id: 'column.remote', defaultMessage: 'Remote timeline' },
});

const mapStateToProps = (state, { columnId }) => {
  const uuid = columnId;
  const columns = state.getIn(['settings', 'columns']);
  const index = columns.findIndex(c => c.get('uuid') === uuid);
  const onlyMedia = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'other', 'onlyMedia']) : state.getIn(['settings', 'public', 'other', 'onlyMedia']);
  const onlyRemote = true;
  const regex = (columnId && index >= 0) ? columns.get(index).getIn(['params', 'regex', 'body']) : state.getIn(['settings', 'public', 'regex', 'body']);
  const timelineState = state.getIn(['timelines', `public:remote' ${onlyMedia ? ':media' : ''}`]);

  return {
    hasUnread: !!timelineState && timelineState.get('unread') > 0,
    onlyMedia,
    onlyRemote,
    regex,
  };
};

class RemoteTimeline extends PureComponent {

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
    regex: PropTypes.string,
  };

  handlePin = () => {
    const { columnId, dispatch, onlyMedia } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('REMOTE', { other: { onlyMedia } }));
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
    const { dispatch, onlyMedia, onlyRemote } = this.props;
    const { signedIn } = this.context.identity;

    dispatch(expandPublicTimeline({ onlyMedia, onlyRemote }));
    if (signedIn) {
      this.disconnect = dispatch(connectPublicStream({ onlyMedia, onlyRemote }));
    }
  }

  componentDidUpdate (prevProps) {
    const { signedIn } = this.context.identity;

    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia, onlyRemote } = this.props;

      if (this.disconnect) {
        this.disconnect();
      }

      dispatch(expandPublicTimeline({ onlyMedia, onlyRemote }));

      if (signedIn) {
        this.disconnect = dispatch(connectPublicStream({ onlyMedia, onlyRemote }));
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

  handleLoadMore = () => {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandPublicTimeline({ onlyMedia }));
  };

  render () {
    const { intl, columnId, hasUnread, multiColumn, onlyMedia } = this.props;
    const pinned = !!columnId;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} name='federated' label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='sitemap'
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

        <StatusListContainer
          prepend={<DismissableBanner id='public_timeline'><FormattedMessage id='dismissable_banner.public_timeline' defaultMessage='These are the most recent public posts from people on the social web that people on {domain} follow.' values={{ domain }} /></DismissableBanner>}
          timelineId={`public:remote${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          trackScroll={!pinned}
          scrollKey={`public_timeline-${columnId}`}
          emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
          bindToDocument={!multiColumn}
          regex={this.props.regex}
        />

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(RemoteTimeline));
