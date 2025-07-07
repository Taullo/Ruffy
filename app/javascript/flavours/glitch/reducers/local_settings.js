//  Package imports.
import { Map as ImmutableMap } from 'immutable';

//  Our imports.
import { LOCAL_SETTING_CHANGE, LOCAL_SETTING_DELETE } from 'flavours/glitch/actions/local_settings';
import { STORE_HYDRATE } from 'flavours/glitch/actions/store';

const initialState = ImmutableMap({
  layout    : 'single-column',
  font_size : 16,
  stretch   : false,
  accent    : 'default',
  side_arm  : 'none',
  side_arm_reply_mode : 'keep',
  always_show_spoilers_field: false,
  confirm_missing_media_description: false,
  confirm_boost_missing_media_description: false,
  confirm_before_clearing_draft: true,
  prepend_cw_re: true,
  preselect_on_reply: true,
  inline_preview_cards: true,
  hicolor_action_buttons: false,
  hicolor_privacy_icons: false,
  show_content_type_choice: false,
  tag_misleading_links: true,
  rewrite_mentions: 'no',
  theme: 'auto',
  post_style  : 'filled',
  post_smoosh: false,
  cw_visibility  : 'default',
  cw_style  : 'redacted',
  hashtag_cw: false,
  low_contrast_theme: false,
  right_column : ImmutableMap({
    visibility     : 'show',
    widgets        : ImmutableMap({
      lists          : true,
      hashtags       : true,
      suggestions    : false,
    }),
  }),
  content_warnings : ImmutableMap({
    filter              : null,
    media_outside       : false,
    shared_state        : false,
  }),
  collapsed_posts : ImmutableMap({
    enabled     : true,
    auto        : ImmutableMap({
      height           : 1400,
    }),
  }),
  media     : ImmutableMap({
    letterbox        : true,
    fullwidth        : true,
    pop_in_player    : true,
  }),
  notifications : ImmutableMap({
    favicon_badge : true,
    tab_badge     : true,
  }),
  status_icons : ImmutableMap({
    language:   true,
    reply:      true,
    local_only: true,
    media:      true,
    visibility: true,
  }),
});

const hydrate = (state, localSettings) => state.mergeDeep(localSettings);

export default function localSettings(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return hydrate(state, action.state.get('local_settings'));
  case LOCAL_SETTING_CHANGE:
    return state.setIn(action.key, action.value);
  case LOCAL_SETTING_DELETE:
    return state.deleteIn(action.key);
  default:
    return state;
  }
}
