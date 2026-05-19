import { useEffect, useRef } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import classNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';

import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

import AddIcon from '@/material-icons/400-24px/add.svg?react';
import AlternateEmailIcon from '@/material-icons/400-24px/alternate_email.svg?react';
import BookmarksActiveIcon from '@/material-icons/400-24px/bookmarks-fill.svg?react';
import BookmarksIcon from '@/material-icons/400-24px/bookmarks.svg?react';
import GroupsIcon from '@/material-icons/400-24px/groups-fill.svg?react';
import HomeActiveIcon from '@/material-icons/400-24px/home-fill.svg?react';
import HomeIcon from '@/material-icons/400-24px/home.svg?react';
import PublicIcon from '@/material-icons/400-24px/public.svg?react';
import TrendingUpIcon from '@/material-icons/400-24px/trending_up.svg?react';
import VillageIcon from '@/material-icons/400-24px/village.svg?react';
import {
  openNavigation,
  closeNavigation,
} from 'flavours/glitch/actions/navigation';
import { Icon } from 'flavours/glitch/components/icon';
import { ColumnLink } from 'flavours/glitch/features/ui/components/column_link';
import { useBreakpoint } from 'flavours/glitch/features/ui/hooks/useBreakpoint';
import { useIdentity } from 'flavours/glitch/identity_context';
import { timelinePreview, trendsEnabled } from 'flavours/glitch/initial_state';
// import { transientSingleColumn } from 'flavours/glitch/is_mobile';
import { useAppSelector, useAppDispatch } from 'flavours/glitch/store';

import { FollowedTagsPanel } from './components/followed_tags_panel';
import { ListPanel } from './components/list_panel';
import { Trends } from './components/trends';

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: {
    id: 'tabs_bar.notifications',
    defaultMessage: 'Notifications',
  },
  explore: { id: 'explore.title', defaultMessage: 'Trending' },
  firehose: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  local: { id: 'firehose.local', defaultMessage: 'Community' },
  public: { id: 'firehose.public', defaultMessage: 'Public' },
  remote: { id: 'firehose.remote', defaultMessage: 'Global' },
  bubble: { id: 'firehose.bubble', defaultMessage: 'Neighbors' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  followsAndFollowers: {
    id: 'navigation_bar.follows_and_followers',
    defaultMessage: 'Follows and followers',
  },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  advancedInterface: {
    id: 'navigation_bar.advanced_interface',
    defaultMessage: 'Open in advanced web interface',
  },
  openedInClassicInterface: {
    id: 'navigation_bar.opened_in_classic_interface',
    defaultMessage:
      'Posts, accounts, and other specific pages are opened by default in the classic web interface.',
  },
  followRequests: {
    id: 'navigation_bar.follow_requests',
    defaultMessage: 'Follow requests',
  },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  compose: { id: 'tabs_bar.publish', defaultMessage: 'New Post' },
  feeds: { id: 'column.lists', defaultMessage: 'Feeds' },
  createFeed: { id: 'column.create_list', defaultMessage: 'Create new custom' },
  app_settings: {
    id: 'navigation_bar.app_settings',
    defaultMessage: 'App settings',
  },
});

const MENU_WIDTH = 284;

export const NavigationPanel: React.FC = () => {
  const intl = useIntl();
  const { signedIn } = useIdentity();

  return (
    <div className='navigation-panel'>
      <div className='navigation-panel__menu'>
        <div className='sidebar-header__wrapper'>
          <div className='sidebar-header'>
            <NavLink
              className='sidebar-header__title'
              to='/feeds'
              title={intl.formatMessage(messages.feeds)}
              href='/feeds'
            >
              {intl.formatMessage(messages.feeds)}
            </NavLink>
            <hr />
            {signedIn && (
              <NavLink
                className='sidebar-header__button'
                to='/feeds/new'
                title={intl.formatMessage(messages.createFeed)}
                href='/feeds/new'
              >
                <Icon id='add' icon={AddIcon} aria-hidden='true' />
              </NavLink>
            )}
          </div>
        </div>
        {signedIn && (
          <ColumnLink
            transparent
            to='/feeds/home'
            icon='home'
            iconComponent={HomeIcon}
            activeIconComponent={HomeActiveIcon}
            text={intl.formatMessage(messages.home)}
          />
        )}

        {trendsEnabled && (
          <ColumnLink
            transparent
            to='/explore'
            icon='explore'
            iconComponent={TrendingUpIcon}
            text={intl.formatMessage(messages.explore)}
          />
        )}

        {(signedIn || timelinePreview) && (
          <>
            <ColumnLink
              transparent
              to='/feeds/community'
              icon='groups'
              iconComponent={GroupsIcon}
              text={intl.formatMessage(messages.local)}
            />
            <ColumnLink
              transparent
              to='/feeds/neighbors'
              icon='village'
              iconComponent={VillageIcon}
              text={intl.formatMessage(messages.bubble)}
            />
            <ColumnLink
              transparent
              to='/feeds/global'
              icon='globe'
              iconComponent={PublicIcon}
              text={intl.formatMessage(messages.remote)}
            />
          </>
        )}

        {signedIn && (
          <>
            <ListPanel />

            <FollowedTagsPanel />

            <ColumnLink
              transparent
              to='/conversations'
              icon='at'
              iconComponent={AlternateEmailIcon}
              text={intl.formatMessage(messages.direct)}
            />

            <ColumnLink
              transparent
              to='/bookmarks'
              icon='bookmarks'
              iconComponent={BookmarksIcon}
              activeIconComponent={BookmarksActiveIcon}
              text={intl.formatMessage(messages.bookmarks)}
            />
          </>
        )}
      </div>

      <div className='flex-spacer' />

      <Trends />
    </div>
  );
};

export const CollapsibleNavigationPanel: React.FC = () => {
  const open = useAppSelector((state) => state.navigation.open);
  const dispatch = useAppDispatch();
  const openable = useBreakpoint('openable');
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(closeNavigation());
  }, [dispatch, location]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) {
        dispatch(closeNavigation());
      }
    };

    const handleDocumentKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeNavigation());
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keyup', handleDocumentKeyUp);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keyup', handleDocumentKeyUp);
    };
  }, [dispatch]);

  const isLtrDir = getComputedStyle(document.body).direction !== 'rtl';

  const OPEN_MENU_OFFSET = isLtrDir ? -MENU_WIDTH : MENU_WIDTH;

  const [{ x }, spring] = useSpring(
    () => ({
      x: open ? 0 : OPEN_MENU_OFFSET,
      onRest: {
        x({ value }: { value: number }) {
          if (value === 0) {
            dispatch(openNavigation());
          } else if (isLtrDir ? value > 0 : value < 0) {
            dispatch(closeNavigation());
          }
        },
      },
    }),
    [open],
  );

  const bind = useDrag(
    ({
      last,
      offset: [xOffset],
      velocity: [xVelocity],
      direction: [xDirection],
      cancel,
    }) => {
      const logicalXDirection = isLtrDir ? xDirection : -xDirection;
      const logicalXOffset = isLtrDir ? xOffset : -xOffset;
      const hasReachedDragThreshold = logicalXOffset < -70;

      if (hasReachedDragThreshold) {
        cancel();
      }

      if (last) {
        const isAboveOpenThreshold = logicalXOffset > MENU_WIDTH / 2;
        const isQuickFlick = xVelocity > 0.5 && logicalXDirection > 0;

        if (isAboveOpenThreshold || isQuickFlick) {
          void spring.start({ x: OPEN_MENU_OFFSET });
        } else {
          void spring.start({ x: 0 });
        }
      } else {
        void spring.start({ x: xOffset, immediate: true });
      }
    },
    {
      from: () => [x.get(), 0],
      filterTaps: true,
      bounds: isLtrDir ? { left: 0 } : { right: 0 },
      rubberband: true,
      enabled: openable,
    },
  );

  const previouslyFocusedElementRef = useRef<HTMLElement | null>();

  useEffect(() => {
    if (open) {
      const firstLink = document.querySelector<HTMLAnchorElement>(
        '.navigation-panel__menu .column-link',
      );
      previouslyFocusedElementRef.current =
        document.activeElement as HTMLElement;
      firstLink?.focus();
    } else {
      previouslyFocusedElementRef.current?.focus();
    }
  }, [open]);

  const showOverlay = openable && open;

  return (
    <div
      className={classNames(
        'columns-area__panels__pane columns-area__panels__pane--start columns-area__panels__pane--navigational',
        { 'columns-area__panels__pane--overlay': showOverlay },
      )}
      ref={overlayRef}
    >
      <animated.div
        className='columns-area__panels__pane__inner'
        {...bind()}
        style={openable ? { x } : undefined}
      >
        <NavigationPanel />
      </animated.div>
    </div>
  );
};
