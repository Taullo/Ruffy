import { useCallback, useEffect } from 'react';

import { useIntl, defineMessages, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { NavLink, useRouteMatch } from 'react-router-dom';

import EditIcon from '@/material-icons/400-24px/edit_square.svg?react';
import NotificationsActiveIcon from '@/material-icons/400-24px/notifications-fill.svg?react';
import NotificationsIcon from '@/material-icons/400-24px/notifications.svg?react';
import SearchIcon from '@/material-icons/400-24px/search.svg?react';
import TagIcon from '@/material-icons/400-24px/tag.svg?react';
import { openModal } from 'flavours/glitch/actions/modal';
import { fetchServer } from 'flavours/glitch/actions/server';
import { Icon } from 'flavours/glitch/components/icon';
import { IconWithBadge } from 'flavours/glitch/components/icon_with_badge';
import { useIdentity } from 'flavours/glitch/identity_context';
import { registrationsOpen, sso_redirect } from 'flavours/glitch/initial_state';
import { selectUnreadNotificationGroupsCount } from 'flavours/glitch/selectors/notifications';
import { useAppDispatch, useAppSelector } from 'flavours/glitch/store';

export const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  feeds: { id: 'tabs_bar.feeds', defaultMessage: 'Feeds' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  publish: { id: 'tabs_bar.publish', defaultMessage: 'Compose' },
  notifications: {
    id: 'tabs_bar.notifications',
    defaultMessage: 'Notifications',
  },
  menu: { id: 'tabs_bar.menu', defaultMessage: 'Menu' },
});

const IconLabelButton: React.FC<{
  to: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  title: string;
}> = ({ to, icon, activeIcon, title }) => {
  const match = useRouteMatch(to);

  return (
    <NavLink
      className='ui__navigation-bar__item'
      activeClassName='active'
      to={to}
      aria-label={title}
    >
      {match && activeIcon ? activeIcon : icon}
      {title}
    </NavLink>
  );
};

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
      <div className='ui__navigation-bar__sign-up'>
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
      <div className='ui__navigation-bar__sign-up'>
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

export const NavigationBar: React.FC = () => {
  const { signedIn } = useIdentity();
  const intl = useIntl();

  return (
    <div className='ui__navigation-bar'>
      {!signedIn && <LoginOrSignUp />}

      <div
        className={classNames('ui__navigation-bar__items', {
          active: signedIn,
        })}
      >
        <IconLabelButton
          title={intl.formatMessage(messages.feeds)}
          to='/feeds'
          icon={<Icon id='' icon={TagIcon} />}
        />

        {signedIn && (
          <>
            <IconLabelButton
              title={intl.formatMessage(messages.search)}
              to='/explore'
              icon={<Icon id='' icon={SearchIcon} />}
            />

            <NotificationsButton />

            <IconLabelButton
              title={intl.formatMessage(messages.publish)}
              to='/publish'
              icon={<Icon id='' icon={EditIcon} />}
            />
          </>
        )}
      </div>
    </div>
  );
};
