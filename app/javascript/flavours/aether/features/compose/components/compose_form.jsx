import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { length } from 'stringz';

import { IconButton } from 'flavours/aether/components/icon_button';
import { maxChars } from 'flavours/aether/initial_state';

import AutosuggestHashtagarea from '../../../components/autosuggest_hashtagarea';
import AutosuggestInput from '../../../components/autosuggest_input';
import AutosuggestTextarea from '../../../components/autosuggest_textarea';
import EmojiPickerDropdown from '../containers/emoji_picker_dropdown_container';
import OptionsContainer from '../containers/options_container';
import PollFormContainer from '../containers/poll_form_container';
import PrivacyDropdownContainer from '../containers/privacy_dropdown_container';
import ReplyIndicatorContainer from '../containers/reply_indicator_container';
import UploadFormContainer from '../containers/upload_form_container';
import WarningContainer from '../containers/warning_container';
import { countableText } from '../util/counter';

import Publisher from './publisher';
import TextareaIcons from './textarea_icons';


const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What is on your mind?' },
  missingDescriptionMessage: {
    id: 'confirmations.missing_media_description.message',
    defaultMessage: 'At least one media attachment is lacking a description. Consider describing all media attachments for the visually impaired before sending your toot.',
  },
  missingDescriptionConfirm: {
    id: 'confirmations.missing_media_description.confirm',
    defaultMessage: 'Send anyway',
  },
  hashtag_placeholder: { id: 'compose_form.hashtag_placeholder', defaultMessage: 'Add #hashtags to your post' },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
  spoiler: {
    defaultMessage: 'Toggle content warning',
    id: 'compose_form.spoiler.unmarked',
  },
});

class ComposeForm extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    text: PropTypes.string,
    hashtags: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    spoiler: PropTypes.bool,
    privacy: PropTypes.string,
    spoilerText: PropTypes.string,
    focusDate: PropTypes.instanceOf(Date),
    caretPosition: PropTypes.number,
    preselectDate: PropTypes.instanceOf(Date),
    isSubmitting: PropTypes.bool,
    isChangingUpload: PropTypes.bool,
    isEditing: PropTypes.bool,
    isUploading: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onClearSuggestions: PropTypes.func,
    onFetchSuggestions: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    onChangeHashtags: PropTypes.func,
    onChangeSpoilerText: PropTypes.func,
    onPaste: PropTypes.func,
    onPickEmoji: PropTypes.func,
    showSearch: PropTypes.bool,
    anyMedia: PropTypes.bool,
    replyingTo: PropTypes.string,
    isInReply: PropTypes.bool,
    singleColumn: PropTypes.bool,
    lang: PropTypes.string,
    account: PropTypes.string,
    autoFocus: PropTypes.bool,

    advancedOptions: ImmutablePropTypes.map,
    media: ImmutablePropTypes.list,
    sideArm: PropTypes.string,
    sensitive: PropTypes.bool,
    spoilersAlwaysOn: PropTypes.bool,
    mediaDescriptionConfirmation: PropTypes.bool,
    preselectOnReply: PropTypes.bool,
    onChangeSpoilerness: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onMediaDescriptionConfirm: PropTypes.func,
    onPoorContentWarning: PropTypes.func,
    onSemiPoorContentWarning: PropTypes.func,
    onNudeContentWarning: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    showSearch: false,
  };

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  };

  getFulltextForCharacterCounting = () => {
    return [
      this.props.spoiler? this.props.spoilerText: '',
      countableText(this.props.text),
      countableText(this.props.hashtags)
    ].join('');
  };

  canSubmit = () => {
    const { isSubmitting, isChangingUpload, isUploading, anyMedia } = this.props;
    const fulltext = this.getFulltextForCharacterCounting();

    return !(isSubmitting || isUploading || isChangingUpload || (this.props.text.length === 0 && !anyMedia) || length(fulltext) > maxChars || (!fulltext.trim().length && !anyMedia));
  };

  handleSubmit = (overriddenVisibility = null) => {
    const {
      onSubmit,
      media,
      mediaDescriptionConfirmation,
      onMediaDescriptionConfirm,
      onPoorContentWarning,
      onSemiPoorContentWarning,
      onNudeContentWarning,
      onChangeVisibility,
    } = this.props;

    if (this.props.text !== this.textarea.value) {
      // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
      // Update the state to match the current text
      this.props.onChange(this.textarea.value);
    }

    if (!this.canSubmit()) {
      return;
    }
    
    if (this.props.spoilerText.length > 0) {
      const allowNudity = window.getComputedStyle(document.body, '::before').getPropertyValue('content').includes('allow-nudity');
      const containsNudity = /(nude|naked|nudity)/i.test(this.props.spoilerText.toLowerCase());
      // Cancel submitting if inadequate content warning
      if ((this.props.spoilerText.toLowerCase().includes('nsfw')) || (this.props.spoilerText.toLowerCase().includes('sensitive content'))) {
        if ((this.props.spoilerText.toLowerCase().trim() === 'nsfw') || (this.props.spoilerText.toLowerCase().trim() === 'sensitive content')) {
          onPoorContentWarning();
        }
        else {
          onSemiPoorContentWarning(this.context.router ? this.context.router.history : null, overriddenVisibility);
        }
        return;
      }
      // Forced confirmation if nudity is allowed but still warned for
      else if (allowNudity && containsNudity) {
        onNudeContentWarning(this.context.router ? this.context.router.history : null, overriddenVisibility);
        return;
      }
    }

    // Submit unless there are media with missing descriptions
    if (mediaDescriptionConfirmation && onMediaDescriptionConfirm && media && media.some(item => !item.get('description'))) {
      const firstWithoutDescription = media.find(item => !item.get('description'));
      onMediaDescriptionConfirm(this.context.router ? this.context.router.history : null, firstWithoutDescription.get('id'), overriddenVisibility);
      return;
    }
    
    if (onSubmit) {
      if (onChangeVisibility && overriddenVisibility) {
        onChangeVisibility(overriddenVisibility);
      }
      onSubmit(this.context.router ? this.context.router.history : null);
    }
  };

  handleChangeHashtags = (e) => {
    this.props.onChangeHashtags(e.target.value);
  };

  //  Changes the text value of the spoiler.
  handleChangeSpoiler = ({ target: { value } }) => {
    const { onChangeSpoilerText } = this.props;
    if (onChangeSpoilerText) {
      onChangeSpoilerText(value);
    }
  };

  setRef = c => {
    this.composeForm = c;
  };

  //  Inserts an emoji at the caret.
  handleEmojiPick = (data) => {
    const { textarea: { selectionStart } } = this;
    const { onPickEmoji } = this.props;
    if (onPickEmoji) {
      onPickEmoji(selectionStart, data);
    }
  };

  //  Handles the secondary submit button.
  handleSecondarySubmit = () => {
    const {
      sideArm,
    } = this.props;
    this.handleSubmit(sideArm === 'none' ? null : sideArm);
  };

  //  Selects a suggestion from the autofill.
  handleSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text']);
  };
  
  handleHashtagSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['hashtags']);
  };

  handleSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }

    if (e.keyCode === 13 && e.altKey) {
      this.handleSecondarySubmit();
    }
  };

  //  Sets a reference to the textarea.
  setAutosuggestTextarea = (textareaComponent) => {
    if (textareaComponent) {
      this.textarea = textareaComponent.textarea;
    }
  };
  
  setAutosuggestHashtagarea = (hashtagareaComponent) => {
    if (hashtagareaComponent) {
      this.hashtagarea = hashtagareaComponent.input;
    }
  };
 
  //  Sets a reference to the CW field.
  handleRefSpoilerText = (spoilerComponent) => {
    if (spoilerComponent) {
      this.spoilerText = spoilerComponent.input;
    }
  };

  handleFocus = () => {
    if (this.composeForm && !this.props.singleColumn) {
      const { left, right } = this.composeForm.getBoundingClientRect();
      if (left < 0 || right > (window.innerWidth || document.documentElement.clientWidth)) {
        this.composeForm.scrollIntoView();
      }
    }
  };

  componentDidMount () {
    this._updateFocusAndSelection({ });
  }

  componentDidUpdate (prevProps) {
    this._updateFocusAndSelection(prevProps);
  }

  //  This statement does several things:
  //  - If we're beginning a reply, and,
  //      - Replying to zero or one users, places the cursor at the end
  //        of the textbox.
  //      - Replying to more than one user, selects any usernames past
  //        the first; this provides a convenient shortcut to drop
  //        everyone else from the conversation.
  _updateFocusAndSelection = (prevProps) => {
    const {
      textarea,
      spoilerText,
    } = this;
    const {
      focusDate,
      caretPosition,
      isSubmitting,
      preselectDate,
      text,
      preselectOnReply,
    } = this.props;
    let selectionEnd, selectionStart;

    //  Caret/selection handling.
    if (focusDate !== prevProps.focusDate) {
      switch (true) {
      case preselectDate !== prevProps.preselectDate && this.props.isInReply && preselectOnReply:
        selectionStart = text.search(/\s/) + 1;
        selectionEnd = text.length;
        break;
      case !isNaN(caretPosition) && caretPosition !== null:
        selectionStart = selectionEnd = caretPosition;
        break;
      default:
        selectionStart = selectionEnd = text.length;
      }
      if (textarea) {
        // Because of the wicg-inert polyfill, the activeElement may not be
        // immediately selectable, we have to wait for observers to run, as
        // described in https://github.com/WICG/inert#performance-and-gotchas
        Promise.resolve().then(() => {
          textarea.setSelectionRange(selectionStart, selectionEnd);
        }).catch(console.error);
      }

    //  Refocuses the textarea after submitting.
    } else if (textarea && prevProps.isSubmitting && !isSubmitting) {
      textarea.focus();
    } else if (this.props.spoiler !== prevProps.spoiler) {
      if (this.props.spoiler) {
        if (spoilerText) {
          spoilerText.focus();
        }
      } else {
        if (textarea) {
          textarea.focus();
        }
      }
    }
  };


  render () {
    const {
      handleEmojiPick,
      handleSecondarySubmit,
      handleSubmit,
    } = this;
    const {
      account,
      advancedOptions,
      intl,
      isSubmitting,
      onChangeSpoilerness,
      onClearSuggestions,
      onFetchSuggestions,
      onPaste,
      privacy,
      sensitive,
      sideArm,
      spoiler,
      spoilerText,
      suggestions,
      spoilersAlwaysOn,
      isEditing,
      disabled,
      replyingTo,
      isInReply,
      autoFocus
    } = this.props;

    const countText = this.getFulltextForCharacterCounting();
    const composerClass = !isInReply ? 'compose-form' : 'compose-form reply-form';

    return (
      <div className={composerClass}>
        <WarningContainer />

        <ReplyIndicatorContainer />

        <AutosuggestTextarea
          ref={this.setAutosuggestTextarea}
          placeholder={intl.formatMessage(messages.placeholder)}
          disabled={isSubmitting}
          value={this.props.text}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          suggestions={suggestions}
          onFocus={this.handleFocus}
          onSuggestionsFetchRequested={onFetchSuggestions}
          onSuggestionsClearRequested={onClearSuggestions}
          onSuggestionSelected={this.handleSuggestionSelected}
          onPaste={onPaste}
          autoFocus={autoFocus}
          lang={this.props.lang}
        >
          <EmojiPickerDropdown onPickEmoji={handleEmojiPick} />
          <TextareaIcons advancedOptions={advancedOptions} />
          <div className='compose-form__modifiers'>
            <UploadFormContainer />
            <PollFormContainer />
          </div>
        </AutosuggestTextarea>
        
        {(!isInReply || (replyingTo === account)) && (
          <AutosuggestHashtagarea
            ref={this.setAutosuggestHashtagarea}
            placeholder={intl.formatMessage(messages.hashtag_placeholder)}
            disabled={isSubmitting}
            value={this.props.hashtags}
            onChange={this.handleChangeHashtags}
            onKeyDown={this.handleKeyDown}
            suggestions={suggestions}
            onFocus={this.handleFocus}
            onSuggestionsFetchRequested={onFetchSuggestions}
            onSuggestionsClearRequested={onClearSuggestions}
            onSuggestionSelected={this.handleHashtagSuggestionSelected}
            onPaste={onPaste}
            autoFocus={false}
            lang={this.props.lang}
          />
        )}

        <div className='compose-form__buttons-wrapper'>
          <OptionsContainer
            advancedOptions={advancedOptions}
            disabled={isSubmitting}
            onUpload={onPaste}
            isEditing={isEditing}
            sensitive={sensitive || (spoilersAlwaysOn && spoilerText && spoilerText.length > 0)}
            spoiler={spoilersAlwaysOn ? (spoilerText && spoilerText.length > 0) : spoiler}
            countText={countText}
            maxChars={maxChars}
          />
        </div>

        <div className={`compose-form__bottom-buttons ${spoiler ? 'spoiler-button--clicked' : ''}`}>
      
          <div className='spoiler_wrapper'>
      
            <span className='spoiler_button'>
              <IconButton
                active={spoiler}
                ariaControls='glitch.composer.spoiler.input'
                icon='warning'
                size={1.1}
                style={{
                  height: null,
                  lineHeight: null,
                }}
                onClick={onChangeSpoilerness}
                title={intl.formatMessage(messages.spoiler)}
              />
            </span>
      
            <div className={`spoiler-input ${spoiler ? 'spoiler-input--visible' : ''}`} ref={this.setRef} aria-hidden={!this.props.spoiler}>
              <AutosuggestInput
                placeholder={intl.formatMessage(messages.spoiler_placeholder)}
                value={spoilerText}
                onChange={this.handleChangeSpoiler}
                onKeyDown={this.handleKeyDown}
                disabled={!spoiler}
                ref={this.handleRefSpoilerText}
                suggestions={suggestions}
                onSuggestionsFetchRequested={onFetchSuggestions}
                onSuggestionsClearRequested={onClearSuggestions}
                onSuggestionSelected={this.handleSpoilerSuggestionSelected}
                searchTokens={[':']}
                id='glitch.composer.spoiler.input'
                className='spoiler-input__input'
                lang={this.props.lang}
                autoFocus={false}
                spellCheck
              />
            </div>
        
          </div>
      
          <PrivacyDropdownContainer disabled={disabled || isEditing} />

          <Publisher
            countText={countText}
            disabled={!this.canSubmit()}
            isEditing={isEditing}
            onSecondarySubmit={handleSecondarySubmit}
            onSubmit={handleSubmit}
            privacy={privacy}
            sideArm={sideArm}
          />
        </div>
      </div>
    );
  }

}

export default injectIntl(ComposeForm);

