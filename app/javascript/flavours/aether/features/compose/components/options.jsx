//  Package imports.
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import Toggle from 'react-toggle';


//  Components.
import { IconButton } from 'flavours/aether/components/icon_button';
import { pollLimits } from 'flavours/aether/initial_state';

import DropdownContainer from '../containers/dropdown_container';
import LanguageDropdown from '../containers/language_dropdown_container';

import CharacterCounter from './character_counter';
import TextIconButton from './text_icon_button';



//  Utils.

//  Messages.
const messages = defineMessages({
  advanced_options_icon_title: {
    defaultMessage: 'Advanced options',
    id: 'advanced_options.icon_title',
  },
  attach: {
    defaultMessage: 'Attach...',
    id: 'compose.attach',
  },
  content_type: {
    defaultMessage: 'Content type',
    id: 'content-type.change',
  },
  doodle: {
    defaultMessage: 'Draw something',
    id: 'compose.attach.doodle',
  },
  gif: {
    defaultMessage: 'Embed GIF',
    id: 'compose.attach.gif',
  },
  html: {
    defaultMessage: 'HTML',
    id: 'compose.content-type.html',
  },
  local_only_long: {
    defaultMessage: 'Do not post to other instances',
    id: 'advanced_options.local-only.long',
  },
  local_only_short: {
    defaultMessage: 'Local only',
    id: 'advanced_options.local-only.short',
  },
  markdown: {
    defaultMessage: 'Markdown',
    id: 'compose.content-type.markdown',
  },
  plain: {
    defaultMessage: 'Plain text',
    id: 'compose.content-type.plain',
  },
  threaded_mode_long: {
    defaultMessage: 'Automatically opens a reply on posting',
    id: 'advanced_options.threaded_mode.long',
  },
  threaded_mode_short: {
    defaultMessage: 'Threaded mode',
    id: 'advanced_options.threaded_mode.short',
  },
  upload: {
    defaultMessage: 'Upload a file',
    id: 'compose.attach.upload',
  },
  add_poll: {
    defaultMessage: 'Add a poll',
    id: 'poll_button.add_poll',
  },
  remove_poll: {
    defaultMessage: 'Remove poll',
    id: 'poll_button.remove_poll',
  },
});

const mapStateToProps = (state, { name }) => ({
  checked: state.getIn(['compose', 'advanced_options', name]),
});

class ToggleOptionImpl extends ImmutablePureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChangeAdvancedOption: PropTypes.func.isRequired,
  };

  handleChange = () => {
    this.props.onChangeAdvancedOption(this.props.name);
  };

  render() {
    const { meta, text, checked } = this.props;

    return (
      <>
        <Toggle checked={checked} onChange={this.handleChange} />

        <div className='privacy-dropdown__option__content'>
          <strong>{text}</strong>
          {meta}
        </div>
      </>
    );
  }

}

const ToggleOption = connect(mapStateToProps)(ToggleOptionImpl);

class ComposerOptions extends ImmutablePureComponent {

  static propTypes = {
    acceptContentTypes: PropTypes.string,
    advancedOptions: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    hasPoll: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChangeAdvancedOption: PropTypes.func,
    onChangeContentType: PropTypes.func,
    onTogglePoll: PropTypes.func,
    onDoodleOpen: PropTypes.func,
    onEmbedTenor: PropTypes.func,
    onModalClose: PropTypes.func,
    onModalOpen: PropTypes.func,
    onUpload: PropTypes.func,
    contentType: PropTypes.string,
    resetFileKey: PropTypes.number,
    isEditing: PropTypes.bool,
    countText: PropTypes.number,
    maxChars: PropTypes.number,
  };

  //  Handles file selection.
  handleChangeFiles = ({ target: { files } }) => {
    const { onUpload } = this.props;
    if (files.length && onUpload) {
      onUpload(files);
    }
  };

  //  Handles attachment clicks.
  handleClickAttach = () => {
    this.fileElement.click();
  };
  
  handleClickDoodle = () => {
    this.props.onDoodleOpen();
  };
  
  handleClickGif = () => {
    this.props.onEmbedTenor();
  };

  //  Handles a ref to the file input.
  handleRefFileElement = (fileElement) => {
    this.fileElement = fileElement;
  };

  renderToggleItemContents = (item) => {
    const { onChangeAdvancedOption } = this.props;
    const { name, meta, text } = item;

    return <ToggleOption name={name} text={text} meta={meta} onChangeAdvancedOption={onChangeAdvancedOption} />;
  };

  //  Rendering.
  render () {
    const {
      acceptContentTypes,
      advancedOptions,
      contentType,
      disabled,
      hasPoll,
      onChangeAdvancedOption,
      onChangeContentType,
      onTogglePoll,
      resetFileKey,
      isEditing,
      countText,
      maxChars,
      intl: { formatMessage },
    } = this.props;

    const contentTypeItems = {
      plain: {
        icon: 'file-text',
        name: 'text/plain',
        text: formatMessage(messages.plain),
      },
      html: {
        icon: 'code',
        name: 'text/html',
        text: formatMessage(messages.html),
      },
      markdown: {
        icon: 'arrow-circle-down',
        name: 'text/markdown',
        text: formatMessage(messages.markdown),
      },
    };

    //  The result.
    return (
      <>
        <div className='compose-form__buttons compose-form__buttons__left'>
          <input
            accept={acceptContentTypes}
            disabled={disabled}
            key={resetFileKey}
            onChange={this.handleChangeFiles}
            ref={this.handleRefFileElement}
            type='file'
            multiple
            style={{ display: 'none' }}
          />
          <IconButton
            disabled={disabled}
            icon='upload'
            onClick={this.handleClickAttach}
            title={formatMessage(messages.attach)}
          />
          <input
            accept={acceptContentTypes}
            disabled={disabled}
            key={resetFileKey}
            onChange={this.handleChangeFiles}
            ref={this.handleRefFileElement}
            type='file'
            multiple
            style={{ display: 'none' }}
          />
          {!!pollLimits && (
            <IconButton
              active={hasPoll}
              icon='tasks'
              onClick={onTogglePoll}
              size={1.1}
              style={{
                height: null,
                lineHeight: null,
              }}
              title={formatMessage(hasPoll ? messages.remove_poll : messages.add_poll)}
            />
          )}
          <TextIconButton
            disabled={disabled}
            label='GIF'
            onClick={this.handleClickGif}
            title={formatMessage(messages.gif)}
          />
          <IconButton
            disabled={disabled}
            icon='paint-brush'
            onClick={this.handleClickDoodle}
            title={formatMessage(messages.doodle)}
          />
        </div>

        <div className='compose-form__buttons compose-form__buttons__right'>
          <DropdownContainer
            disabled={disabled}
            icon={(contentTypeItems[contentType.split('/')[1]] || {}).icon}
            items={[
              contentTypeItems.plain,
              contentTypeItems.markdown,
              contentTypeItems.html,
            ]}
            onChange={onChangeContentType}
            title={formatMessage(messages.content_type)}
            value={contentType}
          />
          <LanguageDropdown />
          <DropdownContainer
            disabled={disabled || isEditing}
            icon='ellipsis-h'
            items={advancedOptions ? [
              {
                meta: formatMessage(messages.local_only_long),
                name: 'do_not_federate',
                text: formatMessage(messages.local_only_short),
              },
            ] : null}
            onChange={onChangeAdvancedOption}
            renderItemContents={this.renderToggleItemContents}
            title={formatMessage(messages.advanced_options_icon_title)}
            closeOnChange={false}
          />
          <div className='character-counter__wrapper'>
            <CharacterCounter text={countText} max={maxChars} />
          </div>
        </div>
      </>
    );
  }

}
export default injectIntl(ComposerOptions);
