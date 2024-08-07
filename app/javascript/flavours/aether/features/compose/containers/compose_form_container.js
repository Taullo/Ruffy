import { defineMessages, injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import {
  changeCompose,
  changeComposeHashtags,
  changeComposeSpoilerText,
  changeComposeSpoilerness,
  changeComposeVisibility,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  insertEmojiCompose,
  selectComposeSuggestion,
  submitCompose,
  uploadCompose,
} from 'flavours/aether/actions/compose';
import { changeLocalSetting } from 'flavours/aether/actions/local_settings';
import {
  openModal,
} from 'flavours/aether/actions/modal';
import { me } from 'flavours/aether/initial_state';
import { privacyPreference } from 'flavours/aether/utils/privacy_preference';

import ComposeForm from '../components/compose_form';


const messages = defineMessages({
  missingDescriptionMessage: {
    id: 'confirmations.missing_media_description.message',
    defaultMessage: 'At least one media attachment is lacking a description. Consider describing all media attachments for the visually impaired before sending your toot.',
  },
  missingDescriptionConfirm: {
    id: 'confirmations.missing_media_description.confirm',
    defaultMessage: 'Send anyway',
  },
  missingDescriptionEdit: {
    id: 'confirmations.missing_media_description.edit',
    defaultMessage: 'Edit media',
  },
  badContentWarningMessageNSFW: {
    id: 'confirmations.bad_content_warning_nsfw.message',
    defaultMessage: 'Please add a more descriptive content warning. Instead, consider what about this post makes it "not safe for work" or sensitive content, then write those reasons instead. Check the About page for more information.',
  },
  semiBadContentWarningMessageNSFW: {
    id: 'confirmations.semi_bad_content_warning_nsfw.message',
    defaultMessage: 'Please consider using something more specific than "NSFW" or "sensitive content" as a content warning (e.g. sexual, kink, gore, etc.). Check the About page for more information.',
  },
  nudeContentWarningMessage: {
    id: 'confirmations.nude_content_warning_nsfw.message',
    defaultMessage: 'Non-sexual nudity does not require a content warning! If the content is sexual in nature, be sure you have said as much in your warning.',
  },
  nudeContentWarningDiscard: {
    id: 'confirmations.nude_content_warning_nsfw.discard',
    defaultMessage: 'Remove Content Warning',
  },
  warningConfirm: {
    id: 'confirmations.warning.confirm',
    defaultMessage: 'Okay',
  },
});

//  State mapping.
function mapStateToProps (state) {
  const spoilersAlwaysOn = state.getIn(['local_settings', 'always_show_spoilers_field']);
  const inReplyTo = state.getIn(['compose', 'in_reply_to']);
  const replyPrivacy = inReplyTo ? state.getIn(['statuses', inReplyTo, 'visibility']) : null;
  const sideArmBasePrivacy = state.getIn(['local_settings', 'side_arm']);
  const sideArmRestrictedPrivacy = replyPrivacy ? privacyPreference(replyPrivacy, sideArmBasePrivacy) : null;
  let sideArmPrivacy = null;
  switch (state.getIn(['local_settings', 'side_arm_reply_mode'])) {
  case 'copy':
    sideArmPrivacy = replyPrivacy;
    break;
  case 'restrict':
    sideArmPrivacy = sideArmRestrictedPrivacy;
    break;
  }
  sideArmPrivacy = sideArmPrivacy || sideArmBasePrivacy;
  return {
    account: state.getIn(['accounts', me, 'id']),
    advancedOptions: state.getIn(['compose', 'advanced_options']),
    focusDate: state.getIn(['compose', 'focusDate']),
    caretPosition: state.getIn(['compose', 'caretPosition']),
    isSubmitting: state.getIn(['compose', 'is_submitting']),
    isEditing: state.getIn(['compose', 'id']) !== null,
    isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
    isUploading: state.getIn(['compose', 'is_uploading']),
    layout: state.getIn(['local_settings', 'layout']),
    media: state.getIn(['compose', 'media_attachments']),
    preselectDate: state.getIn(['compose', 'preselectDate']),
    privacy: state.getIn(['compose', 'privacy']),
    sideArm: sideArmPrivacy,
    showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
    spoiler: spoilersAlwaysOn || state.getIn(['compose', 'spoiler']),
    spoilerText: state.getIn(['compose', 'spoiler_text']),
    hashtags: state.getIn(['compose', 'hashtags']),
    suggestions: state.getIn(['compose', 'suggestions']),
    text: state.getIn(['compose', 'text']),
    anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
    spoilersAlwaysOn: spoilersAlwaysOn,
    mediaDescriptionConfirmation: state.getIn(['local_settings', 'confirm_missing_media_description']),
    preselectOnReply: state.getIn(['local_settings', 'preselect_on_reply']),
    replyingTo: inReplyTo ? state.getIn(['statuses', inReplyTo, 'account']) : null,
    isInReply: state.getIn(['compose', 'in_reply_to']) !== null,
    lang: state.getIn(['compose', 'language']),
  };
}

//  Dispatch mapping.
const mapDispatchToProps = (dispatch, { intl }) => ({

  onChange(text) {
    dispatch(changeCompose(text));
  },
  
  onChangeHashtags(text) {
    dispatch(changeComposeHashtags(text));
  },

  onSubmit(routerHistory) {
    dispatch(submitCompose(routerHistory));
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected(position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path));
  },

  onChangeSpoilerText(text) {
    dispatch(changeComposeSpoilerText(text));
  },

  onPaste(files) {
    dispatch(uploadCompose(files));
  },

  onPickEmoji(position, emoji) {
    dispatch(insertEmojiCompose(position, emoji));
  },

  onChangeSpoilerness() {
    dispatch(changeComposeSpoilerness());
  },

  onChangeVisibility(value) {
    dispatch(changeComposeVisibility(value));
  },

  onMediaDescriptionConfirm(routerHistory, mediaId, overriddenVisibility = null) {
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: intl.formatMessage(messages.missingDescriptionMessage),
        confirm: intl.formatMessage(messages.missingDescriptionConfirm),
        onConfirm: () => {
          if (overriddenVisibility) {
            dispatch(changeComposeVisibility(overriddenVisibility));
          }
          dispatch(submitCompose(routerHistory));
        },
        secondary: intl.formatMessage(messages.missingDescriptionEdit),
        onSecondary: () => dispatch(openModal({
          modalType: 'FOCAL_POINT',
          modalProps: { id: mediaId },
        })),
        onDoNotAsk: () => dispatch(changeLocalSetting(['confirm_missing_media_description'], false)),
      },
    }));
  },
  onPoorContentWarning() {
    dispatch(openModal({
      modalType: 'WARNING',
      modalProps: {
        message: intl.formatMessage(messages.badContentWarningMessageNSFW),
        confirm: intl.formatMessage(messages.warningConfirm),
      },
    }));
  },
  onSemiPoorContentWarning(routerHistory, overriddenVisibility = null) {
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: intl.formatMessage(messages.semiBadContentWarningMessageNSFW),
        confirm: intl.formatMessage(messages.missingDescriptionConfirm),
        onConfirm: () => {
          if (overriddenVisibility) {
            dispatch(changeComposeVisibility(overriddenVisibility));
          }
          dispatch(submitCompose(routerHistory));
        },
      },
    }));
  },
  onNudeContentWarning(routerHistory, overriddenVisibility = null) {
    dispatch(openModal({
      modalType: 'CONFIRM',
      modalProps: {
        message: intl.formatMessage(messages.nudeContentWarningMessage),
        confirm: intl.formatMessage(messages.missingDescriptionConfirm),
        onConfirm: () => {
          if (overriddenVisibility) {
            dispatch(changeComposeVisibility(overriddenVisibility));
          }
          dispatch(submitCompose(routerHistory));
        },
        secondary: intl.formatMessage(messages.nudeContentWarningDiscard),
        onSecondary: () => {
          dispatch(changeComposeSpoilerText(''));
          if (overriddenVisibility) {
            dispatch(changeComposeVisibility(overriddenVisibility));
          }
          dispatch(submitCompose(routerHistory));
        },
      },
    }));
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ComposeForm));
