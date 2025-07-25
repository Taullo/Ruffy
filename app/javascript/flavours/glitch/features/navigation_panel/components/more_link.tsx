import { useMemo } from 'react';

import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import MoreHorizIcon from '@/material-icons/400-24px/more_horiz.svg?react';
import { openModal } from 'flavours/glitch/actions/modal';
import { Dropdown } from 'flavours/glitch/components/dropdown_menu';
import { Icon } from 'flavours/glitch/components/icon';
import { useIdentity } from 'flavours/glitch/identity_context';
import type { MenuItem } from 'flavours/glitch/models/dropdown_menu';
import {
  canManageReports,
  canViewAdminDashboard,
} from 'flavours/glitch/permissions';
import { useAppDispatch } from 'flavours/glitch/store';

const messages = defineMessages({
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domainMutes: {
    id: 'navigation_bar.domain_mutes',
    defaultMessage: 'Muted domains',
  },
  domainBlocks: {
    id: 'navigation_bar.domain_blocks',
    defaultMessage: 'Blocked domains',
  },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Filters' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favorites' },
  administration: {
    id: 'navigation_bar.administration',
    defaultMessage: 'Administration',
  },
  moderation: { id: 'navigation_bar.moderation', defaultMessage: 'Moderation' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  automatedDeletion: {
    id: 'navigation_bar.automated_deletion',
    defaultMessage: 'Automated post deletion',
  },
  accountSettings: {
    id: 'navigation_bar.account_settings',
    defaultMessage: 'Password and security',
  },
  importExport: {
    id: 'navigation_bar.import_export',
    defaultMessage: 'Import and export',
  },
  privacyAndReach: {
    id: 'navigation_bar.privacy_and_reach',
    defaultMessage: 'Privacy and reach',
  },
});

export const MoreLink: React.FC = () => {
  const intl = useIntl();
  const { permissions } = useIdentity();
  const dispatch = useAppDispatch();

  const menu = useMemo(() => {
    const arr: MenuItem[] = [
      { text: intl.formatMessage(messages.favourites), to: '/favourites' },
      { text: intl.formatMessage(messages.mutes), to: '/mutes' },
      { text: intl.formatMessage(messages.blocks), to: '/blocks' },
      {
        text: intl.formatMessage(messages.domainMutes),
        to: '/domain_mutes',
      },
      {
        text: intl.formatMessage(messages.domainBlocks),
        to: '/domain_blocks',
      },
    ];

    arr.push(
      null,
      { text: intl.formatMessage(messages.filters), href: '/filters' },
      {
        href: '/settings/privacy',
        text: intl.formatMessage(messages.privacyAndReach),
      },
      {
        href: '/statuses_cleanup',
        text: intl.formatMessage(messages.automatedDeletion),
      },
      {
        href: '/auth/edit',
        text: intl.formatMessage(messages.accountSettings),
      },
      {
        href: '/settings/export',
        text: intl.formatMessage(messages.importExport),
      },
    );

    if (canManageReports(permissions)) {
      arr.push(null, {
        href: '/admin/reports',
        text: intl.formatMessage(messages.moderation),
      });
    }

    if (canViewAdminDashboard(permissions)) {
      arr.push({
        href: '/admin/dashboard',
        text: intl.formatMessage(messages.administration),
      });
    }

    const handleLogoutClick = () => {
      dispatch(openModal({ modalType: 'CONFIRM_LOG_OUT', modalProps: {} }));
    };

    arr.push(null, {
      text: intl.formatMessage(messages.logout),
      action: handleLogoutClick,
    });

    return arr;
  }, [intl, dispatch, permissions]);

  return (
    <Dropdown items={menu}>
      <button className='column-link column-link--transparent'>
        <Icon id='' icon={MoreHorizIcon} className='column-link__icon' />

        <FormattedMessage id='navigation_bar.more' defaultMessage='More' />
      </button>
    </Dropdown>
  );
};
