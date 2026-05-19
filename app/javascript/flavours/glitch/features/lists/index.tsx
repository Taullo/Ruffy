import { useEffect, useMemo, useCallback } from 'react';

import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import AddIcon from '@/material-icons/400-24px/add.svg?react';
import GroupsIcon from '@/material-icons/400-24px/groups-fill.svg?react';
import HomeActiveIcon from '@/material-icons/400-24px/home-fill.svg?react';
import HomeIcon from '@/material-icons/400-24px/home.svg?react';
import ListAltIcon from '@/material-icons/400-24px/list_alt.svg?react';
import MoreHorizIcon from '@/material-icons/400-24px/more_horiz.svg?react';
import PublicIcon from '@/material-icons/400-24px/public.svg?react';
import TrendingUpIcon from '@/material-icons/400-24px/trending_up.svg?react';
import VillageIcon from '@/material-icons/400-24px/village.svg?react';
import SquigglyArrow from '@/svg-icons/squiggly_arrow.svg?react';
import { fetchLists } from 'flavours/glitch/actions/lists';
import { openModal } from 'flavours/glitch/actions/modal';
import { Column } from 'flavours/glitch/components/column';
import { ColumnHeader } from 'flavours/glitch/components/column_header';
import { Dropdown } from 'flavours/glitch/components/dropdown_menu';
import { Icon } from 'flavours/glitch/components/icon';
import ScrollableList from 'flavours/glitch/components/scrollable_list';
import { ColumnLink } from 'flavours/glitch/features/ui/components/column_link';
import { getOrderedLists } from 'flavours/glitch/selectors/lists';
import { useAppSelector, useAppDispatch } from 'flavours/glitch/store';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  create: { id: 'lists.create_list', defaultMessage: 'Create list' },
  edit: { id: 'lists.edit', defaultMessage: 'Edit list' },
  delete: { id: 'lists.delete', defaultMessage: 'Delete list' },
  more: { id: 'status.more', defaultMessage: 'More' },
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  explore: { id: 'explore.title', defaultMessage: 'Trending' },
  local: { id: 'firehose.local', defaultMessage: 'Community' },
  public: { id: 'firehose.public', defaultMessage: 'Public' },
  remote: { id: 'firehose.remote', defaultMessage: 'Global' },
  bubble: { id: 'firehose.bubble', defaultMessage: 'Neighbors' },
});

const ListItem: React.FC<{
  id: string;
  title: string;
}> = ({ id, title }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const handleDeleteClick = useCallback(() => {
    dispatch(
      openModal({
        modalType: 'CONFIRM_DELETE_LIST',
        modalProps: {
          listId: id,
        },
      }),
    );
  }, [dispatch, id]);

  const menu = useMemo(
    () => [
      { text: intl.formatMessage(messages.edit), to: `/feeds/${id}/edit` },
      { text: intl.formatMessage(messages.delete), action: handleDeleteClick },
    ],
    [intl, id, handleDeleteClick],
  );

  return (
    <div className='lists__item'>
      <Link to={`/feeds/${id}`} className='lists__item__title'>
        <Icon id='list-ul' icon={ListAltIcon} />
        <span>{title}</span>
      </Link>

      <Dropdown
        scrollKey='lists'
        items={menu}
        icon='ellipsis-h'
        iconComponent={MoreHorizIcon}
        title={intl.formatMessage(messages.more)}
      />
    </div>
  );
};

const Lists: React.FC<{
  multiColumn?: boolean;
}> = ({ multiColumn }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const lists = useAppSelector((state) => getOrderedLists(state));

  useEffect(() => {
    void dispatch(fetchLists());
  }, [dispatch]);

  const emptyMessage = (
    <>
      <span>
        <FormattedMessage
          id='lists.no_lists_yet'
          defaultMessage='No custom feeds yet.'
        />
        <br />
        <FormattedMessage
          id='lists.create_a_list_to_organize'
          defaultMessage='Create a new feed to organize your Home feed'
        />
      </span>

      <SquigglyArrow className='empty-column-indicator__arrow' />
    </>
  );

  return (
    <Column
      bindToDocument={!multiColumn}
      label={intl.formatMessage(messages.heading)}
    >
      <ColumnHeader
        title={intl.formatMessage(messages.heading)}
        icon='list-ul'
        iconComponent={ListAltIcon}
        multiColumn={multiColumn}
        extraButton={
          <Link
            to='/feeds/new'
            className='column-header__button'
            title={intl.formatMessage(messages.create)}
            aria-label={intl.formatMessage(messages.create)}
          >
            <Icon id='plus' icon={AddIcon} />
          </Link>
        }
      />

      <ScrollableList
        scrollKey='lists'
        emptyMessage={emptyMessage}
        bindToDocument={!multiColumn}
      >
        <ColumnLink
          transparent
          to='/feeds/home'
          icon='home'
          iconComponent={HomeIcon}
          activeIconComponent={HomeActiveIcon}
          text={intl.formatMessage(messages.home)}
        />
        <ColumnLink
          transparent
          to='/feeds/trending'
          icon='explore'
          iconComponent={TrendingUpIcon}
          text={intl.formatMessage(messages.explore)}
        />
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
        {lists.map((list) => (
          <ListItem key={list.id} id={list.id} title={list.title} />
        ))}
      </ScrollableList>

      <Helmet>
        <title>{intl.formatMessage(messages.heading)}</title>
        <meta name='robots' content='noindex' />
      </Helmet>
    </Column>
  );
};

// eslint-disable-next-line import/no-default-export
export default Lists;
