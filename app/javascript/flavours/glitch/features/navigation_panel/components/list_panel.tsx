import ListAltActiveIcon from '@/material-icons/400-24px/list_alt-fill.svg?react';
import ListAltIcon from '@/material-icons/400-24px/list_alt.svg?react';
import { ColumnLink } from 'flavours/glitch/features/ui/components/column_link';
import { getOrderedLists } from 'flavours/glitch/selectors/lists';
import { useAppSelector } from 'flavours/glitch/store';

export const ListPanel: React.FC = () => {
  const lists = useAppSelector((state) => getOrderedLists(state));

  return (
    <>
      {lists.map((list) => (
        <ColumnLink
          icon='list-ul'
          key={list.id}
          iconComponent={ListAltIcon}
          activeIconComponent={ListAltActiveIcon}
          text={list.title}
          to={`/feeds/${list.id}`}
          transparent
        />
      ))}
    </>
  );
};
