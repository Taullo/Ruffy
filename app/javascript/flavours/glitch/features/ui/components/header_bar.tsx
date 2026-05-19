import type { MouseEventHandler } from 'react';
import { useCallback, useEffect } from 'react';

import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import type { Map as ImmutableMap } from 'immutable';

import NotificationsActiveIcon from '@/material-icons/400-24px/notifications-fill.svg?react';
import NotificationsIcon from '@/material-icons/400-24px/notifications.svg?react';
import PersonAddActiveIcon from '@/material-icons/400-24px/person_add-fill.svg?react';
import PersonAddIcon from '@/material-icons/400-24px/person_add.svg?react';
import SettingsIcon from '@/material-icons/400-24px/settings.svg?react';
import { fetchFollowRequests } from 'flavours/glitch/actions/accounts';
import { openModal } from 'flavours/glitch/actions/modal';
import { fetchServer } from 'flavours/glitch/actions/server';
import { Account } from 'flavours/glitch/components/account';
import { IconButton } from 'flavours/glitch/components/icon_button';
import { IconWithBadge } from 'flavours/glitch/components/icon_with_badge';
import { Wordmark } from 'flavours/glitch/components/wordmark';
import { Search } from 'flavours/glitch/features/compose/components/search';
import { IconLabelButton } from 'flavours/glitch/features/ui/components/icon_label_button';
import { useIdentity } from 'flavours/glitch/identity_context';
import {
  registrationsOpen,
  sso_redirect,
  me,
} from 'flavours/glitch/initial_state';
import { selectUnreadNotificationGroupsCount } from 'flavours/glitch/selectors/notifications';
import { useAppDispatch, useAppSelector } from 'flavours/glitch/store';

import { MoreLink } from './more_link';

export const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  publish: { id: 'tabs_bar.publish', defaultMessage: 'New Post' },
  notifications: {
    id: 'tabs_bar.notifications',
    defaultMessage: 'Notifications',
  },
  menu: { id: 'tabs_bar.menu', defaultMessage: 'Menu' },
  app_settings: {
    id: 'navigation_bar.app_settings',
    defaultMessage: 'App settings',
  },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  followRequests: {
    id: 'navigation_bar.follow_requests',
    defaultMessage: 'Follow requests',
  },
});

const NotificationsButton = () => {
  const count = useAppSelector(selectUnreadNotificationGroupsCount);
  const intl = useIntl();

  return (
    <IconLabelButton
      to='/notifications'
      icon={
        <IconWithBadge
          id='bell'
          icon={NotificationsIcon}
          count={count}
          className=''
        />
      }
      activeIcon={
        <IconWithBadge
          id='bell'
          icon={NotificationsActiveIcon}
          count={count}
          className=''
        />
      }
      title={intl.formatMessage(messages.notifications)}
      className='ui__header-bar__item ui__navigation-bar__item'
    />
  );
};

const LoginOrSignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const signupUrl = useAppSelector(
    (state) =>
      (state.server.getIn(['server', 'registrations', 'url'], null) as
        | string
        | null) ?? '/auth/sign_up',
  );

  const openClosedRegistrationsModal = useCallback(() => {
    dispatch(openModal({ modalType: 'CLOSED_REGISTRATIONS', modalProps: {} }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchServer());
  }, [dispatch]);

  if (sso_redirect) {
    return (
      <div className='ui__header-bar__sign-up'>
        <a
          href={sso_redirect}
          data-method='post'
          className='button button--block button-tertiary'
        >
          <FormattedMessage
            id='sign_in_banner.sso_redirect'
            defaultMessage='Login or Register'
          />
        </a>
      </div>
    );
  } else {
    let signupButton;

    if (registrationsOpen) {
      signupButton = (
        <a href={signupUrl} className='button'>
          <FormattedMessage
            id='sign_in_banner.create_account'
            defaultMessage='Create account'
          />
        </a>
      );
    } else {
      signupButton = (
        <button className='button' onClick={openClosedRegistrationsModal}>
          <FormattedMessage
            id='sign_in_banner.create_account'
            defaultMessage='Create account'
          />
        </button>
      );
    }

    return (
      <div className='ui__header-bar__sign-up'>
        {signupButton}
        <a href='/auth/sign_in' className='button button-tertiary'>
          <FormattedMessage
            id='sign_in_banner.sign_in'
            defaultMessage='Login'
          />
        </a>
      </div>
    );
  }
};

export const HeaderBar: React.FC = () => {
  const { signedIn } = useIdentity();
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const accountID = me ?? ('' as string);

  const handleOpenSettings = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      dispatch(
        openModal({
          modalType: 'SETTINGS',
          modalProps: {},
        }),
      );
    },
    [dispatch],
  );

  const SettingsButton: React.FC = () => {
    return (
      <IconButton
        className='ui__header-bar__settings'
        title={intl.formatMessage(messages.app_settings)}
        icon='cog'
        iconComponent={SettingsIcon}
        onClick={handleOpenSettings}
      />
    );
  };

  const FollowRequestsLink: React.FC = () => {
    const intl = useIntl();
    const count = useAppSelector(
      (state) =>
        (
          state.user_lists.getIn(['follow_requests', 'items']) as
            | ImmutableMap<string, unknown>
            | undefined
        )?.size ?? 0,
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(fetchFollowRequests());
    }, [dispatch]);

    if (count === 0) {
      return null;
    }

    return (
      <IconLabelButton
        to='/follow_requests'
        icon={
          <IconWithBadge
            id='user-plus'
            icon={PersonAddIcon}
            count={count}
            className='column-link__icon'
          />
        }
        activeIcon={
          <IconWithBadge
            id='user-plus'
            icon={PersonAddActiveIcon}
            count={count}
            className='column-link__icon'
          />
        }
        title={intl.formatMessage(messages.followRequests)}
      />
    );
  };

  return (
    <div className='ui__header-bar'>
      <div className='ui__header-bar__wrapper'>
        <div className='ui__header-bar__left'>
          <Link to='/' className='ui__header-bar__logo'>
            <Wordmark />
          </Link>
        </div>
        <div className='ui__header-bar__right'>
          {!signedIn && <LoginOrSignUp />}

          <Search singleColumn />

          {signedIn && (
            <>
              <NotificationsButton />

              <FollowRequestsLink />

              <div className='ui__header-bar__pill'>
                <Account id={accountID} minimal size={36} />
                <SettingsButton />
                <MoreLink />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
