//  Package imports
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages } from 'react-intl';

import CloseIcon from '@/material-icons/400-24px/close.svg?react';
import BrushIcon from '@/material-icons/400-24px/brush-fill.svg?react';
import ComputerIcon from '@/material-icons/400-24px/computer.svg?react';
import ChatIcon from '@/material-icons/400-24px/chat-fill.svg?react';
import EditIcon from '@/material-icons/400-24px/edit.svg?react';
import AccessibilityIcon from '@/material-icons/400-24px/accessibility.svg?react';
import SettingsIcon from '@/material-icons/400-24px/settings-fill.svg?react';
import { preferencesLink } from 'flavours/glitch/utils/backend_links';

import LocalSettingsNavigationItem from './item';

const messages = defineMessages({
  general: {  id: 'settings.general', defaultMessage: 'Appearance' },
  layout: {  id: 'settings.layout', defaultMessage: 'Layout' },
  compose: {  id: 'settings.compose_box_opts', defaultMessage: 'Compose box' },
  statuses: { id: 'settings.statuses', defaultMessage: 'Posts' },
  collapsed: { id: 'settings.collapsed_statuses', defaultMessage: 'Collapsed posts' },
  media: { id: 'settings.media', defaultMessage: 'Media' },
  accessibility: { id: 'settings.accessibility', defaultMessage: 'Accessibility' },
  preferences: { id: 'settings.preferences', defaultMessage: 'Preferences' },
  close: { id: 'settings.close', defaultMessage: 'Close' },
});

class LocalSettingsNavigation extends PureComponent {

  static propTypes = {
    index      : PropTypes.number,
    intl       : PropTypes.object.isRequired,
    onClose    : PropTypes.func.isRequired,
    onNavigate : PropTypes.func.isRequired,
  };

  render () {

    const { index, intl, onClose, onNavigate } = this.props;

    return (
      <nav className='glitch local-settings__navigation'>
        <LocalSettingsNavigationItem
          className='close'
          onNavigate={onClose}
          icon='times'
          iconComponent={CloseIcon}
        />
        <LocalSettingsNavigationItem
          href={preferencesLink}
          icon='cog'
          iconComponent={SettingsIcon}
          title={intl.formatMessage(messages.preferences)}
          className='local_prefs'
        />
        <LocalSettingsNavigationItem
          active={index === 0}
          index={0}
          onNavigate={onNavigate}
          icon='paint-brush'
          iconComponent={BrushIcon}
          title={intl.formatMessage(messages.general)}
        />
        <LocalSettingsNavigationItem
          active={index === 1}
          index={1}
          onNavigate={onNavigate}
          icon='window-restore'
          iconComponent={ComputerIcon}
          title={intl.formatMessage(messages.layout)}
        />
        <LocalSettingsNavigationItem
          active={index === 2}
          index={2}
          onNavigate={onNavigate}
          icon='pencil'
          iconComponent={EditIcon}
          title={intl.formatMessage(messages.compose)}
        />
        <LocalSettingsNavigationItem
          active={index === 3}
          index={3}
          onNavigate={onNavigate}
          icon='comment'
          iconComponent={ChatIcon}
          title={intl.formatMessage(messages.statuses)}
        />
        <LocalSettingsNavigationItem
          active={index === 4}
          index={4}
          onNavigate={onNavigate}
          icon='universal-access'
          iconComponent={AccessibilityIcon}
          title={intl.formatMessage(messages.accessibility)}
        />
      </nav>
    );
  }

}

export default injectIntl(LocalSettingsNavigation);
