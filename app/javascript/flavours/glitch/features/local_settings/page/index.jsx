//  Package imports
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import LocalSettingsPageItem from './item';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

const messages = defineMessages({
  layout_desktop: { id: 'layout.desktop', defaultMessage: 'Advanced Layout' },
  layout_desktop_hint: { id: 'layout.hint.desktop', defaultMessage: 'Allows you to configure multiple columns to see as much information as you want (e.g. home, notifications, timeline, lists and hashtags).' },
  layout_mobile: { id: 'layout.single', defaultMessage: 'Normal Layout' },
  layout_mobile_hint: { id: 'layout.hint.single', defaultMessage: 'Use the default simple layout. This lays out information in a less compact and more readable way.' },
  font_size: { id: 'settings.font_size', defaultMessage: 'Font Size' },
  font_size_hint: { id: 'settings.font_size_hint', defaultMessage: 'Change the size of the text across the site (default is center)' },
  rightcolumn_show: { id: 'layout.rightcolumn_show', defaultMessage: 'Show Right Column' },
  rightcolumn_hide: { id: 'layout.rightcolumn_hide', defaultMessage: 'Hide Right Column' },
  side_arm_none: { id: 'settings.side_arm.none', defaultMessage: 'None' },
  side_arm_keep: { id: 'settings.side_arm_reply_mode.keep', defaultMessage: 'Keep its set privacy' },
  side_arm_copy: { id: 'settings.side_arm_reply_mode.copy', defaultMessage: 'Copy privacy setting of the post being replied to' },
  side_arm_restrict: { id: 'settings.side_arm_reply_mode.restrict', defaultMessage: 'Restrict privacy setting to that of the post being replied to' },
  regexp: { id: 'settings.content_warnings.regexp', defaultMessage: 'Regular expression' },

  theme_auto: { id: 'settings.theme_auto', defaultMessage:  'Automatic' },
  theme_light: { id: 'settings.theme_light', defaultMessage:  'Light' },
  theme_dark: { id: 'settings.theme_dark', defaultMessage:  'Dark' },
  theme_mixed: { id: 'settings.theme_mixed', defaultMessage:  'Mixed' },

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
  accent_mammoth: { id: 'settings.accent_mammoth', defaultMessage:  'Mammoth' },
  accent_keystone: { id: 'settings.accent_keystone', defaultMessage:  'Keystone' },
  accent_goby: { id: 'settings.accent_goby', defaultMessage:  'Goby' },
  accent_mono: { id: 'settings.accent_mono', defaultMessage:  'Monochrome' },
  accent_custom: { id: 'settings.accent_custom', defaultMessage:  'Custom' },

  post_style_filled: { id: 'settings.post_style_filled', defaultMessage:  'Filled' },
  post_style_wired: { id: 'settings.post_style_wired', defaultMessage:  'Wireframe' },
  post_style_wireless: { id: 'settings.post_style_wireless', defaultMessage:  'Borderless' },

  post_smoosh: { id: 'settings.post_smoosh', defaultMessage:  'Make posts appear closer together' },
  post_smoosh_hint: { id: 'settings.post_smoosh_hint', defaultMessage:  'Posts will be separated by a small border instead of appearing separately' },

  cw_visibility_obscured: { id: 'settings.cw_visibility_default', defaultMessage:  'Default' },
  cw_visibility_shown: { id: 'settings.cw_visibility_shown', defaultMessage:  'Visible' },
  cw_visibility_lockdown: { id: 'settings.cw_visibility_lockdown', defaultMessage:  'Lockdown' },
  cw_style_redacted: { id: 'settings.cw_style_redacted', defaultMessage:  'Redacted' },
  cw_style_blurred: { id: 'settings.cw_style_blurred', defaultMessage:  'Blurred' },
  cw_style_hidden: { id: 'settings.cw_style_hidden', defaultMessage:  'Hidden' },
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
        <span className='themeSelector'>
          <LocalSettingsPageItem
            settings={settings}
            item={['theme']}
            id='mastodon-settings--theme'
            options={[
              {  type: 'radio', value: 'auto', title: intl.formatMessage(messages.theme_auto) },
              {  type: 'radio', value: 'light', title: intl.formatMessage(messages.theme_light) },
              {  type: 'radio', value: 'dark', title: intl.formatMessage(messages.theme_dark) },
              {  type: 'radio', value: 'mixed', title: intl.formatMessage(messages.theme_mixed) },
            ]}
            onChange={onChange}
          >
            <FormattedMessage id='settings.theme' defaultMessage='Style' />
          </LocalSettingsPageItem>
        </span>
        <span className='accentSelector'>
          <LocalSettingsPageItem
            settings={settings}
            item={['accent']}
            id='mastodon-settings--accent'
            options={[
              { type: 'radio', value: 'default', title: intl.formatMessage(messages.accent_default) },
              { type: 'radio', value: '#589734', title: intl.formatMessage(messages.accent_green) },
              { type: 'radio', value: '#377ee4', title: intl.formatMessage(messages.accent_blue) },
              { type: 'radio', value: '#a539ff', title: intl.formatMessage(messages.accent_purple) },
              { type: 'radio', value: '#ff8300', title: intl.formatMessage(messages.accent_orange) },
              { type: 'radio', value: '#ffce00', title: intl.formatMessage(messages.accent_yellow) },
              { type: 'radio', value: '#f02727', title: intl.formatMessage(messages.accent_red) },
              { type: 'radio', value: '#f027be', title: intl.formatMessage(messages.accent_pink) },
              { type: 'radio', value: '#6364ff', title: intl.formatMessage(messages.accent_mammoth) },
              { type: 'radio', value: '#b4e900', title: intl.formatMessage(messages.accent_keystone) },
              { type: 'radio', value: '#d1bcf5', title: intl.formatMessage(messages.accent_goby) },
              { type: 'radio', value: 'mono', title: intl.formatMessage(messages.accent_mono) },
              { type: 'color', value: undefined, title: intl.formatMessage(messages.accent_custom) },
            ]}
            onChange={onChange}
          >
            <FormattedMessage id='settings.accent' defaultMessage='Accent Color' />
            <span className='hint'><FormattedMessage id='settings.accent_hint' defaultMessage='Change the accent color of the entire site' /></span>
          </LocalSettingsPageItem>
          <h2><FormattedMessage id='settings.font_size' defaultMessage='Font Size' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['font_size']}
            id='mastodon-settings--font-size'
            placeholder='12'
            onChange={onChange}
            inputProps={{ type: 'range', min: '12', max: '20' }}
          >
            <FormattedMessage id='settings.font_size_hint' defaultMessage='Change the size of the text across the site (default is center)' />
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
            {  type: 'radio', value: 'no', message: intl.formatMessage(messages.rewrite_mentions_no) },
            {  type: 'radio', value: 'acct', message: intl.formatMessage(messages.rewrite_mentions_acct) },
            {  type: 'radio', value: 'username', message: intl.formatMessage(messages.rewrite_mentions_username) },
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
              {  type: 'radio', value: 'single-column', message: intl.formatMessage(messages.layout_mobile), hint: intl.formatMessage(messages.layout_mobile_hint) },
              {  type: 'radio', value: 'multi-column', message: intl.formatMessage(messages.layout_desktop), hint: intl.formatMessage(messages.layout_desktop_hint) },
            ]}
            onChange={onChange}
          />
          <LocalSettingsPageItem
            settings={settings}
            item={['stretch']}
            id='mastodon-settings--stretch'
            onChange={onChange}
          >
            <FormattedMessage id='settings.wide_view' defaultMessage='Wide view' />
            <span className='hint'><FormattedMessage id='settings.wide_view_hint' defaultMessage='Stretches columns to better fill the available space.' /></span>
          </LocalSettingsPageItem>
          <h2><FormattedMessage id='settings.layout_home' defaultMessage='Home Timeline' /></h2>
          <LocalSettingsPageItem
            settings={settings}
            item={['right_column', 'visibility']}
            id='mastodon-settings--right_column'
            options={[
              {  type: 'radio', value: 'show', message: intl.formatMessage(messages.rightcolumn_show) },
              {  type: 'radio', value: 'hide', message: intl.formatMessage(messages.rightcolumn_hide) },
            ]}
            onChange={onChange}
          >
            <FormattedMessage id='settings.right_column' defaultMessage='Show the right column on the home page' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['right_column', 'widgets', 'lists']}
            id='mastodon-settings--right_column-lists'
            onChange={onChange}
          >
            <FormattedMessage id='settings.right_column_lists' defaultMessage='Show lists in the right column' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['right_column', 'widgets', 'hashtags']}
            id='mastodon-settings--right_column-hashtags'
            onChange={onChange}
          >
            <FormattedMessage id='settings.right_column_hashtags' defaultMessage='Show hashtags in the right column' />
          </LocalSettingsPageItem>
          <LocalSettingsPageItem
            settings={settings}
            item={['right_column', 'widgets', 'suggestions']}
            id='mastodon-settings--right_column-suggested'
            onChange={onChange}
          >
            <FormattedMessage id='settings.right_column_suggested' defaultMessage='Show suggested accounts in the right column' />
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
            { type: 'radio', value: 'none', message: intl.formatMessage(messages.side_arm_none) },
            { type: 'radio', value: 'direct', message: intl.formatMessage(messages.direct) },
            { type: 'radio', value: 'private', message: intl.formatMessage(messages.private) },
            { type: 'radio', value: 'unlisted', message: intl.formatMessage(messages.unlisted) },
            { type: 'radio', value: 'public', message: intl.formatMessage(messages.public) },
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
            { type: 'radio', value: 'keep', message: intl.formatMessage(messages.side_arm_keep) },
            { type: 'radio', value: 'copy', message: intl.formatMessage(messages.side_arm_copy) },
            { type: 'radio', value: 'restrict', message: intl.formatMessage(messages.side_arm_restrict) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.side_arm_reply_mode' defaultMessage='When replying to a post, the secondary post button should:' />
        </LocalSettingsPageItem>
      </div>
    ),
    ({ intl, onChange, settings }) => (
      <div className='glitch local-settings__page posts'>
        <h1><FormattedMessage id='settings.statuses' defaultMessage='Posts' /></h1>
        <LocalSettingsPageItem
          settings={settings}
          item={['post_style']}
          id='mastodon-settings--post-style'
          options={[
            { type: 'radio', value: 'filled', message: intl.formatMessage(messages.post_style_filled) },
            { type: 'radio', value: 'wired', message: intl.formatMessage(messages.post_style_wired) },
            { type: 'radio', value: 'wireless', message: intl.formatMessage(messages.post_style_wireless) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.post_style_header' defaultMessage='Post style:' />
          <span className='hint'><FormattedMessage id='settings.post_style_hint' defaultMessage='Change the appearance of posts' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['post_smoosh']}
          id='mastodon-settings--post-smoosh'
          onChange={onChange}
        >
          <FormattedMessage id='settings.post_smoosh' defaultMessage='Make posts appear closer together' />
          <span className='hint'><FormattedMessage id='settings.post_smoosh_hint' defaultMessage='Posts will be separated by a small border instead of appearing separately' /></span>
        </LocalSettingsPageItem>
        <h2><FormattedMessage id='settings.collapsed_statuses' defaultMessage='Collapsed posts' /></h2>
        <LocalSettingsPageItem
          settings={settings}
          item={['collapsed_posts', 'enabled']}
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
            item={['collapsed_posts', 'auto', 'height']}
            id='mastodon-settings--collapsed-auto-height'
            placeholder='1400'
            onChange={onChange}
            dependsOn={[['collapsed_posts', 'enabled']]}
            inputProps={{ type: 'range', min: '400', max: '2000' }}
          >
            <FormattedMessage id='settings.auto_collapse_height' defaultMessage='Height (in pixels) for a post to be considered lengthy' />
          </LocalSettingsPageItem>
        </section>
        <h2><FormattedMessage id='settings.content_warnings' defaultMessage='Sensitive Content' /></h2>
        <LocalSettingsPageItem
          settings={settings}
          item={['cw_visibility']}
          id='mastodon-settings--cw-visibility'
          options={[
            { type: 'radio', value: 'default', message: intl.formatMessage(messages.cw_visibility_obscured) },
            { type: 'radio', value: 'visible', message: intl.formatMessage(messages.cw_visibility_shown) },
            { type: 'radio', value: 'lockdown', message: intl.formatMessage(messages.cw_visibility_lockdown) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.cw_visibility_header' defaultMessage='Content visibility:' />
          <span className='hint'><FormattedMessage id='settings.cw_visibility_hint' defaultMessage='Change whether to hide sensitive posts, show them, or to hide all media behind a click' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['hashtag_cw']}
          id='mastodon-settings--hashtag-cw'
          onChange={onChange}
        >
          <FormattedMessage id='settings.hashtag_cw' defaultMessage='Show the hashtag bar even when a post is hidden' />
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['cw_style']}
          id='mastodon-settings--cw-style'
          options={[
            { type: 'radio', value: 'redacted', message: intl.formatMessage(messages.cw_style_redacted) },
            { type: 'radio', value: 'blurred', message: intl.formatMessage(messages.cw_style_blurred) },
            { type: 'radio', value: 'hidden', message: intl.formatMessage(messages.cw_style_hidden) },
          ]}
          onChange={onChange}
        >
          <FormattedMessage id='settings.cw_style_header' defaultMessage='Content warning style:' />
          <span className='hint'><FormattedMessage id='settings.cw_style_hint' defaultMessage='Changes the style of hidden posts' /></span>
        </LocalSettingsPageItem>
        <h2><FormattedMessage id='settings.media' defaultMessage='Media' /></h2>
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
          item={['low_contrast_theme']}
          id='mastodon-settings--low_contrast_theme'
          onChange={onChange}
        >
          <FormattedMessage id='settings.low_contrast_theme' defaultMessage='Simplified theme' />
          <span className='hint'><FormattedMessage id='settings.low_contrast_theme.hint' defaultMessage='Reduces the use of the accent color on certain areas of the site and simplifies certain elements' /></span>
        </LocalSettingsPageItem>
        <LocalSettingsPageItem
          settings={settings}
          item={['hicolor_action_buttons']}
          id='mastodon-settings--hicolor_action_buttons'
          onChange={onChange}
        >
          <FormattedMessage id='settings.hicolor_action_buttons' defaultMessage='High color post action buttons' />
          <span className='hint'><FormattedMessage id='settings.hicolor_action_buttons.hint' defaultMessage='Display post action buttons (e.g. boost, favorite, bookmark) in bright and easily distinguishable colors when clicked' /></span>
        </LocalSettingsPageItem>
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
