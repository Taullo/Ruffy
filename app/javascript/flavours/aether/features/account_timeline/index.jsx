import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { NavLink } from 'react-router-dom';

import { List as ImmutableList } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { lookupAccount, fetchAccount } from 'flavours/aether/actions/accounts';
import { openModal } from 'flavours/aether/actions/modal';
import { expandAccountMediaTimeline , expandAccountFeaturedTimeline, expandAccountTimeline } from 'flavours/aether/actions/timelines';
import { TimelineHint } from 'flavours/aether/components/timeline_hint';
import ProfileColumnHeader from 'flavours/aether/features/account/components/profile_column_header';
import FeaturedTags from 'flavours/aether/features/account/containers/featured_tags_container';
import MediaItem from 'flavours/aether/features/account_gallery/components/media_item';
import BundleColumnError from 'flavours/aether/features/ui/components/bundle_column_error';
import { normalizeForLookup } from 'flavours/aether/reducers/accounts_map';
import { getAccountHidden , getAccountGallery } from 'flavours/aether/selectors';

import { fetchFeaturedTags } from '../../actions/featured_tags';
import { LoadingIndicator } from '../../components/loading_indicator';
import StatusList from '../../components/status_list';
import Column from '../ui/components/column';

import LimitedAccountHint from './components/limited_account_hint';
import HeaderContainer from './containers/header_container';
import RightColumnContainer from './containers/right_column_container';



const emptyList = ImmutableList();

const mapStateToProps = (state, { params: { acct, id, tagged }, withReplies = false }) => {
  const accountId = id || state.getIn(['accounts_map', normalizeForLookup(acct)]);

  if (accountId === null) {
    return {
      isLoading: false,
      isAccount: false,
      statusIds: emptyList,
    };
  } else if (!accountId) {
    return {
      isLoading: true,
      statusIds: emptyList,
    };
  }

  const path = withReplies ? `${accountId}:with_replies` : `${accountId}${tagged ? `:${tagged}` : ''}`;

  return {
    accountId,
    acctName: state.getIn(['accounts', accountId, 'username']),
    remote: !!(state.getIn(['accounts', accountId, 'acct']) !== state.getIn(['accounts', accountId, 'username'])),
    remoteUrl: state.getIn(['accounts', accountId, 'url']),
    isAccount: !!state.getIn(['accounts', accountId]),
    statusIds: state.getIn(['timelines', `account:${path}`, 'items'], ImmutableList()),
    featuredStatusIds: withReplies ? ImmutableList() : state.getIn(['timelines', `account:${accountId}:pinned${tagged ? `:${tagged}` : ''}`, 'items'], ImmutableList()),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
    hasMore:   state.getIn(['timelines', `account:${path}`, 'hasMore']),
    suspended: state.getIn(['accounts', accountId, 'suspended'], false),
    hidden: getAccountHidden(state, accountId),
    attachments: getAccountGallery(state, accountId),
  };
};

const RemoteHint = ({ url }) => (
  <TimelineHint url={url} resource={<FormattedMessage id='timeline_hint.resources.statuses' defaultMessage='Older posts' />} />
);

RemoteHint.propTypes = {
  url: PropTypes.string.isRequired,
};

class AccountTimeline extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.shape({
      acct: PropTypes.string,
      id: PropTypes.string,
      tagged: PropTypes.string,
    }).isRequired,
    accountId: PropTypes.string,
    acctName: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    featuredStatusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    withReplies: PropTypes.bool,
    isAccount: PropTypes.bool,
    suspended: PropTypes.bool,
    hidden: PropTypes.bool,
    remote: PropTypes.bool,
    remoteUrl: PropTypes.string,
    multiColumn: PropTypes.bool,
    attachments: ImmutablePropTypes.list.isRequired,
  };

  _load () {
    const { accountId, withReplies, params: { tagged }, dispatch } = this.props;

    dispatch(fetchAccount(accountId));

    if (!withReplies) {
      dispatch(expandAccountFeaturedTimeline(accountId, { tagged }));
    }

    dispatch(fetchFeaturedTags(accountId));
    dispatch(expandAccountTimeline(accountId, { withReplies, tagged }));
    dispatch(expandAccountMediaTimeline(accountId));
  }

  componentDidMount () {
    const { params: { acct }, accountId, dispatch } = this.props;

    if (accountId) {
      this._load();
    } else {
      dispatch(lookupAccount(acct));
    }
  }

  componentDidUpdate (prevProps) {
    const { params: { acct, tagged }, accountId, withReplies, dispatch } = this.props;

    if (prevProps.accountId !== accountId && accountId) {
      this._load();
    } else if (prevProps.params.acct !== acct) {
      dispatch(lookupAccount(acct));
    } else if (prevProps.params.tagged !== tagged) {
      if (!withReplies) {
        dispatch(expandAccountFeaturedTimeline(accountId, { tagged }));
      }
      dispatch(expandAccountTimeline(accountId, { withReplies, tagged }));
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;

    if ((nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) || nextProps.withReplies !== this.props.withReplies) {
      dispatch(fetchAccount(nextProps.params.accountId));

      if (!nextProps.withReplies) {
        dispatch(expandAccountFeaturedTimeline(nextProps.params.accountId));
      }

      dispatch(expandAccountTimeline(nextProps.params.accountId, { withReplies: nextProps.params.withReplies }));
    }
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  handleLoadMore = maxId => {
    this.props.dispatch(expandAccountTimeline(this.props.accountId, { maxId, withReplies: this.props.withReplies, tagged: this.props.params.tagged }));
  };

  setRef = c => {
    this.column = c;
  };

  handleOpenMedia = attachment => {
    const { dispatch } = this.props;
    const statusId = attachment.getIn(['status', 'id']);
    const lang = attachment.getIn(['status', 'language']);

    if (attachment.get('type') === 'video') {
      dispatch(openModal({
        modalType: 'VIDEO',
        modalProps: { media: attachment, statusId, lang, options: { autoPlay: true } },
      }));
    } else if (attachment.get('type') === 'audio') {
      dispatch(openModal({
        modalType: 'AUDIO',
        modalProps: { media: attachment, statusId, lang, options: { autoPlay: true } },
      }));
    } else {
      const media = attachment.getIn(['status', 'media_attachments']);
      const index = media.findIndex(x => x.get('id') === attachment.get('id'));

      dispatch(openModal({
        modalType: 'MEDIA',
        modalProps: { media, index, statusId, lang },
      }));
    }
  };

  render () {
    const { accountId, acctName, statusIds, featuredStatusIds, isLoading, hasMore, suspended, isAccount, hidden, multiColumn, remote, remoteUrl, attachments } = this.props;

    if (isLoading && statusIds.isEmpty()) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    } else if (!isLoading && !isAccount) {
      return (
        <BundleColumnError multiColumn={multiColumn} errorType='routing' />
      );
    }

    let emptyMessage;
    
    let featuredPostsTitle;
    let mediaTitle;
    let mediaLink;

    const forceEmptyState = suspended || hidden;

    if (suspended) {
      emptyMessage = <FormattedMessage id='empty_column.account_suspended' defaultMessage='Account suspended' />;
    } else if (hidden) {
      emptyMessage = <LimitedAccountHint accountId={accountId} />;
    } else if (remote && statusIds.isEmpty()) {
      emptyMessage = <RemoteHint url={remoteUrl} />;
    } else {
      emptyMessage = <FormattedMessage id='empty_column.account_timeline' defaultMessage='No posts found' />;
    }
    
    if (!featuredStatusIds.isEmpty()) {
      featuredPostsTitle = <h4><FormattedMessage id='account.featured_posts.title' defaultMessage='Featured posts' /></h4>
    }
    
    if (attachments.size > 0) {
      mediaTitle = <h4><FormattedMessage id='account.media' defaultMessage='Media' /></h4>
      mediaLink =  <NavLink className='navbutton' exact to={`/@${acctName}/media`}><FormattedMessage tagName='div' id='status.more' defaultMessage='More' /></NavLink>
    }

    const remoteMessage = remote ? <RemoteHint url={remoteUrl} /> : null;

    return (
      <Column ref={this.setRef} name='account'>
       <div className='scrollable account-scroll'>
        <ProfileColumnHeader onClick={this.handleHeaderClick} multiColumn={multiColumn} />
        <HeaderContainer accountId={this.props.accountId} hideTabs={forceEmptyState} tagged={this.props.params.tagged} />
        <div className='account-timeline__right-column'>
          <RightColumnContainer statusIds={featuredStatusIds} accountId={this.props.accountId} tagged={this.props.params.tagged} />
          {mediaTitle}
          <div role='feed' className='account-mini-gallery__container' ref={this.handleRef}>
            {attachments.map((attachment) => attachment === null ? (
              ''
              ) : (
              <MediaItem key={attachment.get('id')} attachment={attachment} onOpenMedia={this.handleOpenMedia} />
            ))}
            {mediaLink}
          </div>
          {featuredPostsTitle}
          <StatusList
            alwaysPrepend
            scrollKey='account_pinned'
            statusIds={featuredStatusIds}
            isLoading={isLoading}
            bindToDocument={!multiColumn}
            timelineId='account_pinned'
          />
          <FeaturedTags accountId={accountId} tagged={this.props.params.tagged} />
        </div>

        <StatusList
          alwaysPrepend
          append={remoteMessage}
          scrollKey='account_timeline'
          statusIds={forceEmptyState ? emptyList : statusIds}
          isLoading={isLoading}
          hasMore={!forceEmptyState && hasMore}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
          timelineId='account'
        />
       </div>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(AccountTimeline);
