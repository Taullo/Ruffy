import type { MouseEventHandler } from 'react';

import classNames from 'classnames';
import { useRouteMatch, NavLink } from 'react-router-dom';

import { Icon } from 'flavours/glitch/components/icon';
import type { IconProp } from 'flavours/glitch/components/icon';

export const IconLabelButton: React.FC<{
  icon: React.ReactNode;
  iconComponent?: IconProp;
  activeIcon?: React.ReactNode;
  activeIconComponent?: IconProp;
  isActive?: (match: unknown, location: { pathname: string }) => boolean;
  title: string;
  to?: string;
  onClick?: MouseEventHandler;
  href?: string;
  method?: string;
  badge?: React.ReactNode;
  transparent?: boolean;
  className?: string;
  id?: string;
}> = ({
  icon,
  activeIcon,
  iconComponent,
  activeIconComponent,
  title,
  to,
  onClick,
  href,
  method,
  badge,
  transparent,
  ...other
}) => {
  const match = useRouteMatch(to ?? '');
  const className = classNames('icon-label-button', {
    'icon-label-button--transparent': transparent,
  });
  const badgeElement =
    typeof badge !== 'undefined' ? (
      <span className='icon-label-button__badge'>{badge}</span>
    ) : null;
  const iconElement = iconComponent ? (
    <Icon
      id={typeof icon === 'string' ? icon : ''}
      icon={iconComponent}
      className='icon-label-button__icon'
    />
  ) : (
    icon
  );
  const activeIconElement =
    activeIcon ??
    (activeIconComponent ? (
      <Icon
        id={typeof icon === 'string' ? icon : ''}
        icon={activeIconComponent}
        className='icon-label-button__icon'
      />
    ) : (
      iconElement
    ));
  const active = !!match;

  if (href) {
    return (
      <a
        href={href}
        title={title}
        className={className}
        data-method={method}
        {...other}
      >
        {active ? activeIconElement : iconElement}
        {badgeElement}
      </a>
    );
  } else if (to) {
    return (
      <NavLink title={title} to={to} className={className} {...other}>
        {active ? activeIconElement : iconElement}
        {badgeElement}
      </NavLink>
    );
  } else {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid -- intentional to have the same look and feel as other menu items
      <a
        href='#'
        title={title}
        onClick={onClick}
        className={className}
        {...other}
        tabIndex={0}
      >
        {iconElement}
        {badgeElement}
      </a>
    );
  }
};
