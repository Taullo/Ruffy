//  Package imports
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';


//  Our imports
// import { expandSpoilers } from 'flavours/aether/initial_state';
// import { preferenceLink } from 'flavours/aether/utils/backend_links';
import LocalSettingsPageItem from './item';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

const messages = defineMessages({
  layout_auto: {  id: 'layout.auto', defaultMessage: 'Auto' },
  layout_auto_hint: {  id: 'layout.hint.auto', defaultMessage: 'Automatically chose layout based on “Enable advanced web interface” setting and screen size.' },
  layout_desktop: { id: 'layout.desktop', defaultMessage: 'Advanced Layout' },
  layout_desktop_hint: { id: 'layout.hint.desktop', defaultMessage: 'Allows you to configure multiple columns to see as much information as you want (e.g. home, notifications, timeline, lists and hashtags).' },
  layout_mobile: { id: 'layout.single', defaultMessage: 'Normal Layout' },
  layout_mobile_hint: { id: 'layout.hint.single', defaultMessage: 'Use the default single column layout. This lays out information in a less compact and more readable way.' },
  side_arm_none: { id: 'settings.side_arm.none', defaultMessage: 'None' },
  side_arm_keep: { id: 'settings.side_arm_reply_mode.keep', defaultMessage: 'Keep its set privacy' },
  side_arm_copy: { id: 'settings.side_arm_reply_mode.copy', defaultMessage: 'Copy privacy setting of the post being replied to' },
  side_arm_restrict: { id: 'settings.side_arm_reply_mode.restrict', defaultMessage: 'Restrict privacy setting to that of the post being replied to' },
  regexp: { id: 'settings.content_warnings.regexp', defaultMessage: 'Regular expression' },
  rewrite_mentions_no: { id: 'settings.rewrite_mentions_no', defaultMessage: 'Do not rewrite mentions' },
  rewrite_mentions_acct: { id: 'settings.rewrite_mentions_acct', defaultMessage: 'Rewrite with username and domain (when the account is remote)' },
  rewrite_mentions_username: { id: 'settings.rewrite_mentions_username', defaultMessage:  'Rewrite with username' },
  pop_in_left: { id: 'settings.pop_in_left', defaultMessage: 'Left' },
  pop_in_right: { id: 'settings.pop_in_right', defaultMessage:  'Right' },

  accent_default: { id: 'settings.accent_default', defaultMessage:  'Default' },
  accent_green: { id: 'settings.accent_green', defaultMessage:  'Green' },
  accent_blue: { id: 'settings.accent_blue', defaultMessage:  'Blue' },
  accent_purple: { id: 'settings.accent_purple', defaultMessage:  'Purple' },
  accent_orange: { id: 'settings.accent_orange', defaultMessage:  'Orange' },
  accent_yellow: { id: 'settings.accent_yellow', defaultMessage:  'Yellow' },
  accent_red: { id: 'settings.accent_red', defaultMessage:  'Red' },
  accent_pink: { id: 'settings.accent_pink', defaultMessage:  'Pink' },
  accent_mammoth: { id: 'settings.accent_mammut', defaultMessage:  'Mammoth' },
  accent_keystone: { id: 'settings.accent_mammut', defaultMessage:  'Keystone' },
  accent_goby: { id: 'settings.accent_mammut', defaultMessage:  'Goby' },
  accent_mono: { id: 'settings.accent_pink', defaultMessage:  'Monochrome' },

  cw_visibility_obscured: { id: 'settings.cw_visibility_obscured', defaultMessage:  'Obscured' },
  cw_visibility_hidden: { id: 'settings.cw_visibility_hidden', defaultMessage:  'Hidden' },
  cw_visibility_shown: { id: 'settings.cw_visibility_shown', defaultMessage:  'Visible' },
  public: { id: 'privacy.public.short', defaultMessage: 'Public' },
  unlisted: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  private: { id: 'privacy.private.short', defaultMessage: 'Followers only' },
  direct: { id: 'privacy.direct.short', defaultMessage: 'Mentioned people only' },
});

class LocalSettingsPage extends PureComponent {

  static propTypes = {
    index    : PropTypes.number,
    intl     : PropTypes.object.isRequired,
    onChange : PropTypes.func.isRequired,
    settings : ImmutablePropTypes.map.isRequired,
  };

  pages = [
    ({ intl, onChange, settings }) => (
      <div className='glitch local-settings__page general'>
        <h1><FormattedMessage id='settings.general' defaultMessage='Appearance' /></h1>
        <span className='accentSelector'>
        <LocalSettingsPageItem
          settings={settings}
          item={['accent']}
          id='mastodon-settings--accent'
          options={[
            { value: 'default', title: intl.formatMessage(messages.accent_default) },
            { value: '#589734', title: intl.formatMessage(messages.accent_green) },
            { value: '#377ee4', title: intl.formatMessage(messages.accent_blue) },
            { value: '#a539ff', title: intl.formatMessage(messages.accent_purple) },
            { value: '#ff8300', title: intl.formatMessage(messages.accent_orange) },
            { value: '#ffce00', title: intl.formatMessage(messages.accent_yellow) },
            { value: '#f02727', title: intl.formatMessage(messages.accent_red) },
            { value: '#f027be', title: intl.formatMessage(messages.accent_pink) },
            { value: '#6364ff', title: intl.formatMessage(messages.accent_mammoth) },
            { value: '#b4e900', title: intl.formatMessage(messages.accent_keystone) },
            { value: '#d1bcf5', title: intl.formatMessage(messages.accent_goby) },
            { value: '#ffffff', title: intl.formatMessage(messages.accent_mono) },
          ]}
          onChange={onChange}
        >
        <FormattedMessage id='settings.accent' defaultMessage='Accent Color' />
        <span className='hint'><FormattedMessage id='settings.cw_visibility_hint' defaultMessage='Change the accent color of the entire site' /></span>
        </LocalSettingsPageItem>
        </span>
        <h2><FormattedMessage id='settings.misleading_links' defaultMessage='Tag Misleading Links' /></h2>
        <LocalSettingsPageItem
          settings={settings}
          item={['tag_misleading_links']}
          id='mastodon-settings--tag_misleading_links'
          onChange={onChange}
        >
          <FormattedMessage id='settings.tag_misleading_links' defaultMessage='Tag misleading links' />
          <span className='hint'><FormattedMessage id='settings.tag_misleading_links.hint' defaultMessage='Add a visual indication with the link target host to every link not mentioning it explicitly' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['rewrite_mentions']}
          id='mastodon-settings--rewrite_mentions'
          options={[
            { value: 'no', message: intl.formatMessage(messages.rewrite_mentions_no) },
            { value: 'acct', message: intl.formatMessage(messages.rewrite_mentions_acct) },
            { value: 'username', message: intl.formatMessage(messages.rewrite_mentions_username) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.rewrite_mentions' defaultMessage='Rewrite mentions in displayed statuses' />
        </LocalSettingsPageItem>
      </div>
    ),
    ({ intl, onChange, settings }) => (
      <div className='glitch local-settings__page layout'>
        <h1><FormattedMessage id='settings.layout' defaultMessage='Layout' /></h1>
        <section>
          <h2><FormattedMessage id='settings.layout_opts' defaultMessage='Layout options' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['layout']}
            id='mastodon-settings--layout'
            options={[
              { value: 'auto', message: intl.formatMessage(messages.layout_auto), hint: intl.formatMessage(messages.layout_auto_hint) },
              { value: 'single', message: intl.formatMessage(messages.layout_mobile), hint: intl.formatMessage(messages.layout_mobile_hint) },
              { value: 'multiple', message: intl.formatMessage(messages.layout_desktop), hint: intl.formatMessage(messages.layout_desktop_hint) },
            ]}
            onChange={onChange}
           />
          <LocalSettingsPageItem
            settings={settings}
            item={['stretch']}
            id='mastodon-settings--stretch'
            onChange={onChange}
          >
            <FormattedMessage id='settings.wide_view' defaultMessage='Wide view (Advanced Layout only)' />
            <span className='hint'><FormattedMessage id='settings.wide_view_hint' defaultMessage='Stretches columns to better fill the available space.' /></span>
          </LocalSettingsPageItem>
        </section>
        <h2><FormattedMessage id='settings.collapsed_statuses' defaultMessage='Collapse posts' /></h2>
        <LocalSettingsPageItem
          settings={settings}
          item={['collapsed', 'enabled']}
          id='mastodon-settings--collapsed-enabled'
          onChange={onChange}
        >
          <FormattedMessage id='settings.enable_collapsed' defaultMessage='Enable collapsed posts' />
          <span className='hint'><FormattedMessage id='settings.enable_collapsed_hint' defaultMessage='Collapsed posts have parts of their contents hidden to take up less screen space. This is distinct from the Content Warning feature' /></span>
        </LocalSettingsPageItem>
        <section>
          <h2><FormattedMessage id='settings.auto_collapse' defaultMessage='Automatic collapsing' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['collapsed', 'auto', 'height']}
            id='mastodon-settings--collapsed-auto-height'
            placeholder='1200'
            onChange={onChange}
            dependsOn={[['collapsed', 'enabled']]}
            dependsOnNot={[['collapsed', 'auto', 'all']]}
            inputProps={{ type: 'number', min: '400', max: '2000' }}
          >
            <FormattedMessage id='settings.auto_collapse_height' defaultMessage='Height (in pixels) for a post to be considered lengthy' />
          </LocalSettingsPageItem>
        </section>
      </div>
    ),
    ({ intl, onChange, settings }) => (
      <div className='glitch local-settings__page compose_box_opts'>
        <h1><FormattedMessage id='settings.compose_box_opts' defaultMessage='Compose box' /></h1>
        <LocalSettingsPageItem
          settings={settings}
          item={['always_show_spoilers_field']}
          id='mastodon-settings--always_show_spoilers_field'
          onChange={onChange}
        >
          <FormattedMessage id='settings.always_show_spoilers_field' defaultMessage='Always enable the Content Warning field' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['prepend_cw_re']}
          id='mastodon-settings--prepend_cw_re'
          onChange={onChange}
        >
          <FormattedMessage id='settings.prepend_cw_re' defaultMessage='Prepend “re: ” to content warnings when replying' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['preselect_on_reply']}
          id='mastodon-settings--preselect_on_reply'
          onChange={onChange}
        >
          <FormattedMessage id='settings.preselect_on_reply' defaultMessage='Pre-select usernames on reply' />
          <span className='hint'><FormattedMessage id='settings.preselect_on_reply_hint' defaultMessage='When replying to a conversation with multiple participants, pre-select usernames past the first' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['confirm_missing_media_description']}
          id='mastodon-settings--confirm_missing_media_description'
          onChange={onChange}
        >
          <FormattedMessage id='settings.confirm_missing_media_description' defaultMessage='Show confirmation dialog before sending posts lacking media descriptions' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['confirm_before_clearing_draft']}
          id='mastodon-settings--confirm_before_clearing_draft'
          onChange={onChange}
        >
          <FormattedMessage id='settings.confirm_before_clearing_draft' defaultMessage='Show confirmation dialog before overwriting the message being composed' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['side_arm']}
          id='mastodon-settings--side_arm'
          options={[
            { value: 'none', message: intl.formatMessage(messages.side_arm_none) },
            { value: 'direct', message: intl.formatMessage(messages.direct) },
            { value: 'private', message: intl.formatMessage(messages.private) },
            { value: 'unlisted', message: intl.formatMessage(messages.unlisted) },
            { value: 'public', message: intl.formatMessage(messages.public) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.side_arm' defaultMessage='Secondary post button:' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['side_arm_reply_mode']}
          id='mastodon-settings--side_arm_reply_mode'
          options={[
            { value: 'keep', message: intl.formatMessage(messages.side_arm_keep) },
            { value: 'copy', message: intl.formatMessage(messages.side_arm_copy) },
            { value: 'restrict', message: intl.formatMessage(messages.side_arm_restrict) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.side_arm_reply_mode' defaultMessage='When replying to a post, the secondary post button should:' />
        </LocalSettingsPageItem>
      </div>
    ),
    ({ intl, onChange, settings }) => (
      <div className='glitch local-settings__page content_warnings'>
        <h1><FormattedMessage id='settings.content_warnings' defaultMessage='Content Warnings' /></h1>
        <LocalSettingsPageItem
          settings={settings}
          item={['content_warnings', 'cw_visibility']}
          id='mastodon-settings--cw-visibility'
          options={[
            { value: 'obscured', message: intl.formatMessage(messages.cw_visibility_obscured) },
            { value: 'hidden', message: intl.formatMessage(messages.cw_visibility_hidden) },
            { value: 'visible', message: intl.formatMessage(messages.cw_visibility_shown) },
          ]}
          onChange={onChange}
        >
        <FormattedMessage id='settings.cw_visibility_header' defaultMessage='Content warning text visibility:' />
        <span className='hint'><FormattedMessage id='settings.cw_visibility_hint' defaultMessage='Change whether a post with a content warning is obscured, completely hidden, or shown by default' /></span>
        </LocalSettingsPageItem>
      </div>
    ),
    ({ onChange, settings }) => (
      <div className='glitch local-settings__page media'>
        <h1><FormattedMessage id='settings.media' defaultMessage='Media' /></h1>
        <LocalSettingsPageItem
          settings={settings}
          item={['inline_preview_cards']}
          id='mastodon-settings--inline-preview-cards'
          onChange={onChange}
        >
          <FormattedMessage id='settings.inline_preview_cards' defaultMessage='Inline preview cards for external links' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['media', 'pop_in_player']}
          id='mastodon-settings--pop-in-player'
          onChange={onChange}
        >
          <FormattedMessage id='settings.pop_in_player' defaultMessage='Enable pop-in player' />
        </LocalSettingsPageItem>
      </div>
    ),
    ({ onChange, settings }) => (
      <div className='glitch local-settings__page accessibility'>
        <h1><FormattedMessage id='settings.accessibility' defaultMessage='Accessibility' /></h1>
        <LocalSettingsPageItem
          settings={settings}
          item={['hicolor_privacy_icons']}
          id='mastodon-settings--hicolor_privacy_icons'
          onChange={onChange}
        >
          <FormattedMessage id='settings.hicolor_privacy_icons' defaultMessage='High color privacy icons' />
          <span className='hint'><FormattedMessage id='settings.hicolor_privacy_icons.hint' defaultMessage='Display privacy icons in bright and easily distinguishable colors' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['confirm_boost_missing_media_description']}
          id='mastodon-settings--confirm_boost_missing_media_description'
          onChange={onChange}
        >
          <FormattedMessage id='settings.confirm_boost_missing_media_description' defaultMessage='Show confirmation dialog before boosting posts lacking media descriptions' />
        </LocalSettingsPageItem>
        <section>
          <h2><FormattedMessage id='settings.notifications_opts' defaultMessage='Notifications options' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['notifications', 'tab_badge']}
            id='mastodon-settings--notifications-tab_badge'
            onChange={onChange}
          >
            <FormattedMessage id='settings.notifications.tab_badge' defaultMessage='Unread notifications badge' />
            <span className='hint'><FormattedMessage id='settings.notifications.tab_badge.hint' defaultMessage="Display a badge for unread notifications in the column icons when the notifications column isn't open" /></span>
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['notifications', 'favicon_badge']}
            id='mastodon-settings--notifications-favicon_badge'
            onChange={onChange}
          >
            <FormattedMessage id='settings.notifications.favicon_badge' defaultMessage='Unread notifications favicon badge' />
            <span className='hint'><FormattedMessage id='settings.notifications.favicon_badge.hint' defaultMessage='Add a badge for unread notifications to the favicon' /></span>
          </LocalSettingsPageItem>
        </section>
        <section>
          <h2><FormattedMessage id='settings.status_icons' defaultMessage='Post icons' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['status_icons', 'language']}
            id='mastodon-settings--status-icons-language'
            onChange={onChange}
          >
            <FormattedMessage id='settings.status_icons_language' defaultMessage='Language indicator' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['status_icons', 'reply']}
            id='mastodon-settings--status-icons-reply'
            onChange={onChange}
          >
            <FormattedMessage id='settings.status_icons_reply' defaultMessage='Reply indicator' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['status_icons', 'local_only']}
            id='mastodon-settings--status-icons-local_only'
            onChange={onChange}
          >
            <FormattedMessage id='settings.status_icons_local_only' defaultMessage='Local-only indicator' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['status_icons', 'media']}
            id='mastodon-settings--status-icons-media'
            onChange={onChange}
          >
            <FormattedMessage id='settings.status_icons_media' defaultMessage='Media and poll indicators' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['status_icons', 'visibility']}
            id='mastodon-settings--status-icons-visibility'
            onChange={onChange}
          >
            <FormattedMessage id='settings.status_icons_visibility' defaultMessage='Post privacy indicator' />
          </LocalSettingsPageItem>
        </section>
      </div>
    ),
  ];

  render () {
    const { pages } = this;
    const { index, intl, onChange, settings } = this.props;
    const CurrentPage = pages[index] || pages[0];

    return <CurrentPage intl={intl} onChange={onChange} settings={settings} />;
  }

}

export default injectIntl(LocalSettingsPage);
