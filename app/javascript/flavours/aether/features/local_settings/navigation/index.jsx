//  Package imports
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages } from 'react-intl';

//  Our imports
import { preferencesLink } from 'flavours/aether/utils/backend_links';

import LocalSettingsNavigationItem from './item';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

const messages = defineMessages({
  general: {  id: 'settings.general', defaultMessage: 'Appearance' },
  layout: {  id: 'settings.layout', defaultMessage: 'Layout' },
  compose: {  id: 'settings.compose_box_opts', defaultMessage: 'Compose box' },
  content_warnings: { id: 'settings.content_warnings', defaultMessage: 'Content Warnings' },
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
        />
        <LocalSettingsNavigationItem
          href={preferencesLink}
          icon='cog'
          title={intl.formatMessage(messages.preferences)}
          className='local_prefs'
        />
        <LocalSettingsNavigationItem
          active={index === 0}
          index={0}
          onNavigate={onNavigate}
          icon='paint-brush'
          title={intl.formatMessage(messages.general)}
        />
        <LocalSettingsNavigationItem
          active={index === 1}
          index={1}
          onNavigate={onNavigate}
          icon='window-restore'
          title={intl.formatMessage(messages.layout)}
        />
        <LocalSettingsNavigationItem
          active={index === 2}
          index={2}
          onNavigate={onNavigate}
          icon='pencil'
          title={intl.formatMessage(messages.compose)}
        />
        <LocalSettingsNavigationItem
          active={index === 3}
          index={3}
          onNavigate={onNavigate}
          icon='warning'
          title={intl.formatMessage(messages.content_warnings)}
        />
        <LocalSettingsNavigationItem
          active={index === 4}
          index={4}
          onNavigate={onNavigate}
          icon='image'
          title={intl.formatMessage(messages.media)}
        />
        <LocalSettingsNavigationItem
          active={index === 5}
          index={5}
          onNavigate={onNavigate}
          icon='universal-access'
          title={intl.formatMessage(messages.accessibility)}
        />
      </nav>
    );
  }

}

export default injectIntl(LocalSettingsNavigation);
