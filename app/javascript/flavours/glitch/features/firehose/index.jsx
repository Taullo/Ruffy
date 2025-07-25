import PropTypes from 'prop-types';
import { useRef, useCallback, useEffect } from 'react';

import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import { useIdentity } from '@/flavours/glitch/identity_context';
import PublicIcon from '@/material-icons/400-24px/public.svg?react';
import { addColumn } from 'flavours/glitch/actions/columns';
import { changeSetting } from 'flavours/glitch/actions/settings';
import { connectPublicStream, connectCommunityStream, connectBubbleStream } from 'flavours/glitch/actions/streaming';
import { expandPublicTimeline, expandCommunityTimeline, expandBubbleTimeline } from 'flavours/glitch/actions/timelines';
import { DismissableBanner } from 'flavours/glitch/components/dismissable_banner';
import SettingText from 'flavours/glitch/components/setting_text';
import { domain } from 'flavours/glitch/initial_state';
import { useAppDispatch, useAppSelector } from 'flavours/glitch/store';

import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import SettingToggle from '../notifications/components/setting_toggle';
import StatusListContainer from '../ui/containers/status_list_container';

const messages = defineMessages({
  title: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  filter_regex: { id: 'home.column_settings.filter_regex', defaultMessage: 'Filter out by regular expressions' },
});

const ColumnSettings = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.getIn(['settings', 'firehose']));
  const onChange = useCallback(
    (key, checked) => dispatch(changeSetting(['firehose', ...key], checked)),
    [dispatch],
  );

  return (
    <div className='column-settings'>
      <section>
        <div className='column-settings__row'>
          <SettingToggle
            settings={settings}
            settingPath={['onlyMedia']}
            onChange={onChange}
            label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media only' />}
          />

          <SettingToggle
            settings={settings}
            settingPath={['allowLocalOnly']}
            onChange={onChange}
            label={<FormattedMessage id='firehose.column_settings.allow_local_only' defaultMessage='Show local-only posts in "All"' />}
          />
        </div>
      </section>

      <section>
        <h3><FormattedMessage id='home.column_settings.advanced' defaultMessage='Advanced' /></h3>

        <div className='column-settings__row'>
          <SettingText
            settings={settings}
            settingPath={['regex', 'body']}
            onChange={onChange}
            label={intl.formatMessage(messages.filter_regex)}
          />
        </div>
      </section>
    </div>
  );
};

const Firehose = ({ feedType, multiColumn }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { signedIn } = useIdentity();
  const columnRef = useRef(null);

  const allowLocalOnly = useAppSelector((state) => state.getIn(['settings', 'firehose', 'allowLocalOnly']));
  const regex = useAppSelector((state) => state.getIn(['settings', 'firehose', 'regex', 'body']));

  const onlyMedia = useAppSelector((state) => state.getIn(['settings', 'firehose', 'onlyMedia'], false));
  const hasUnread = useAppSelector((state) => state.getIn(['timelines', `${feedType}${feedType === 'public' && allowLocalOnly ? ':allow_local_only' : ''}${onlyMedia ? ':media' : ''}`, 'unread'], 0) > 0);

  const handlePin = useCallback(
    () => {
      switch(feedType) {
      case 'community':
        dispatch(addColumn('COMMUNITY', { other: { onlyMedia }, regex: { body: regex } }));
        break;
      case 'public':
        dispatch(addColumn('PUBLIC', { other: { onlyMedia, allowLocalOnly }, regex: { body: regex }  }));
        break;
      case 'bubble':
        dispatch(addColumn('BUBBLE', { other: { onlyMedia }, regex: { body: regex } }));
        break;
      case 'public:remote':
        dispatch(addColumn('REMOTE', { other: { onlyMedia, onlyRemote: true }, regex: { body: regex }  }));
        break;
      }
    },
    [dispatch, onlyMedia, feedType, allowLocalOnly, regex],
  );

  const handleLoadMore = useCallback(
    (maxId) => {
      switch(feedType) {
      case 'community':
        dispatch(expandCommunityTimeline({ maxId, onlyMedia }));
        break;
      case 'bubble':
        dispatch(expandBubbleTimeline({ maxId, onlyMedia }));
        break;
      case 'public':
        dispatch(expandPublicTimeline({ maxId, onlyMedia, allowLocalOnly }));
        break;
      case 'public:remote':
        dispatch(expandPublicTimeline({ maxId, onlyMedia, onlyRemote: true }));
        break;
      }
    },
    [dispatch, onlyMedia, allowLocalOnly, feedType],
  );

  const handleHeaderClick = useCallback(() => columnRef.current?.scrollTop(), []);

  useEffect(() => {
    let disconnect;

    switch(feedType) {
    case 'community':
      dispatch(expandCommunityTimeline({ onlyMedia }));
      if (signedIn) {
        disconnect = dispatch(connectCommunityStream({ onlyMedia }));
      }
      break;
    case 'bubble':
      dispatch(expandBubbleTimeline({ onlyMedia }));
      if (signedIn) {
        disconnect = dispatch(connectBubbleStream({ onlyMedia }));
      }
      break;
    case 'public':
      dispatch(expandPublicTimeline({ onlyMedia, allowLocalOnly }));
      if (signedIn) {
        disconnect = dispatch(connectPublicStream({ onlyMedia, allowLocalOnly }));
      }
      break;
    case 'public:remote':
      dispatch(expandPublicTimeline({ onlyMedia, onlyRemote: true }));
      if (signedIn) {
        disconnect = dispatch(connectPublicStream({ onlyMedia, onlyRemote: true }));
      }
      break;
    }

    return () => disconnect?.();
  }, [dispatch, signedIn, feedType, onlyMedia, allowLocalOnly]);

  let prependBanner;
  let emptyMessage;

  if (feedType === 'community') {
    prependBanner = (
      <DismissableBanner id='community_timeline'>
        <FormattedMessage
          id='dismissable_banner.community_timeline'
          defaultMessage='These are the most recent public posts from people whose accounts are hosted by {domain}.'
          values={{ domain }}
        />
      </DismissableBanner>
    );
    emptyMessage = (
      <FormattedMessage
        id='empty_column.community'
        defaultMessage='The local timeline is empty. Write something publicly to get the ball rolling!'
      />
    );
  } else if (feedType === 'bubble') {
    prependBanner = (
      <DismissableBanner id='bubble_timeline'>
        <FormattedMessage
          id='dismissable_banner.bubble_timeline'
          defaultMessage='These are the most recent public posts from people on the fediverse whose accounts are on other servers selected by {domain}.'
          values={{ domain }}
        />
      </DismissableBanner>
    );
    emptyMessage = (
      <FormattedMessage
        id='empty_column.bubble'
        defaultMessage='The bubble timeline is currently empty, but something might show up here soon!'
      />
    );
  } else {
    prependBanner = (
      <DismissableBanner id='public_timeline'>
        <FormattedMessage
          id='dismissable_banner.public_timeline'
          defaultMessage='These are the most recent public posts from people on the fediverse that people on {domain} follow.'
          values={{ domain }}
        />
      </DismissableBanner>
    );
    emptyMessage = (
      <FormattedMessage
        id='empty_column.public'
        defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up'
      />
    );
  }

  return (
    <Column bindToDocument={!multiColumn} ref={columnRef} label={intl.formatMessage(messages.title)}>
      <ColumnHeader
        icon='globe'
        iconComponent={PublicIcon}
        active={hasUnread}
        title={intl.formatMessage(messages.title)}
        onPin={handlePin}
        onClick={handleHeaderClick}
        multiColumn={multiColumn}
      >
        <ColumnSettings />
      </ColumnHeader>

      <StatusListContainer
        prepend={prependBanner}
        timelineId={`${feedType}${feedType === 'public' && allowLocalOnly ? ':allow_local_only' : ''}${onlyMedia ? ':media' : ''}`}
        onLoadMore={handleLoadMore}
        trackScroll
        scrollKey='firehose'
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
        regex={regex}
      />

      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
        <meta name='robots' content='noindex' />
      </Helmet>
    </Column>
  );
};

Firehose.propTypes = {
  multiColumn: PropTypes.bool,
  feedType: PropTypes.string,
};

export default Firehose;
