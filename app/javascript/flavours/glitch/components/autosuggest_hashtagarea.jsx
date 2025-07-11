import PropTypes from 'prop-types';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { AutosuggestHashtag } from './autosuggest_hashtag';

const textAtCursorMatchesToken = (str, caretPosition) => {
  let word;

  let left  = str.slice(0, caretPosition).search(/[^\s\u200B]+$/);
  let right = str.slice(caretPosition).search(/[\s\u200B]/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word || word.trim().length < 2 || (word.trim().length < 3 && ['#'].indexOf(word[0]) === 0)) {
    return [null, null, null];
  }

  word = word.trim().toLowerCase();

  if (word.length > 0) {
    let symbol = ['#'].indexOf(word[0]) === 0 ? true : false;
    return [left, word, symbol];
  } else {
    return [null, null, null];
  }
};

export default class AutosuggestHashtagarea extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionsClearRequested: PropTypes.func.isRequired,
    onSuggestionsFetchRequested: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    lang: PropTypes.string,
  };

  static defaultProps = {
    autoFocus: true,
  };

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
  };

  onChange = (e) => {
    const [ tokenStart, token, symbol ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      // Check if # is used, and if not, add one to the hashtag search
      this.props.onSuggestionsFetchRequested(symbol === true ? token : '#' + token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e);
  };

  onKeyDown = (e) => {
    const { suggestions, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;
    const { value } = this.props;
  
    if (disabled) {
      e.preventDefault();
      return;
    }

    /* eslint-disable no-useless-escape */
    if (/[,/\\\.!"$%&'()*+,\/:;<=>?@[\\\]^`{|}~-]+/.test(e.key) ||
        (e.key === '#' && (value[e.target.selectionStart] === '#' || value[e.target.selectionStart + 1] === '#' || value[e.target.selectionStart - 1] === '#')) ||
        (e.key === '#' && e.target.selectionStart > 0 && e.target.value[e.target.selectionStart - 1] !== ' ' && e.target.value[e.target.selectionStart - 1] !== '#')) {
      e.preventDefault();
      return;
    }
    /* eslint-enable no-useless-escape */
  
    if (e.which === 229 || e.isComposing) {
      return;
    }
  
    switch(e.key) {
    case 'Escape':
      if (suggestions.size === 0 || suggestionsHidden) {
        document.querySelector('.ui').parentElement.focus();
      } else {
        e.preventDefault();
        this.setState({ suggestionsHidden: true });
      }
      break;
    case 'ArrowDown':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
      }
      break;
    case 'ArrowUp':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
      }
      break;
    case 'Enter':
    case 'Tab':
      if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
      } else if (suggestions.size === 0 || suggestionsHidden) {
        const caretPosition = e.target.selectionStart;
        const [tokenStart, token, symbol] = textAtCursorMatchesToken(value, caretPosition);
        if (!symbol && token) {
          const newValue = value.slice(0, tokenStart) + '#' + value.slice(tokenStart) + ' ';
          this.props.onChange({ target: { value: newValue } }); 
          e.preventDefault();
          e.stopPropagation();
        }
      }
      break;
    case ' ':
      const caretPosition = e.target.selectionStart;
      const [tokenStart, token, symbol] = textAtCursorMatchesToken(value, caretPosition);
      if (!symbol && token) {
        if (caretPosition < value.length - 1 && !/\s/.test(value[caretPosition])) {
          return;
        }
        const newValue = value.slice(0, tokenStart) + '#' + value.slice(tokenStart) + ' ';
        this.props.onChange({ target: { value: newValue } }); 
        e.preventDefault();
        e.stopPropagation();
      }
      break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) {
      return;
    }

    this.props.onKeyDown(e);
  };


  onBlur = () => {
    const { value } = this.input;
    let modifiedValue = '';
    let word = '';
    let inWord = false;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];

      if (char === '#' && !inWord) {
        inWord = true;
        word = '#';
      } else if (/\s/.test(char) && inWord) {
        inWord = false;
        modifiedValue += word + ' ';
        word = '';
      } else if (/\S/.test(char) && inWord) {
        word += char;
      } else if (/\S/.test(char) && !inWord) {
        inWord = true;
        word = '#' + char;
      } else if (/\s/.test(char) && !inWord) {
        modifiedValue += char;
      }
    }

    if (inWord) {
      modifiedValue += word + ' ';
    }

    this.props.onChange({ target: { value: modifiedValue } });
    this.setState({ suggestionsHidden: true, focused: false });
  };

  onFocus = (e) => {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.input.focus();
  };

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setInput = (c) => {
    this.input = c;
  };

  onPaste = (e) => {
    let pastedText = (e.clipboardData || window.clipboardData).getData('text');
    /* eslint-disable no-useless-escape */
    pastedText = pastedText.replace(/[,/\\\.]+|\s+|#+/g, ' ').trim(); //replace certain characters with space
    pastedText = pastedText.replace(/[!"$%&'()*+,\/:;<=>?@[\\\]^-`{|}~]+/g, '').trim(); //delete leftover punctuation
    /* eslint-enable no-useless-escape */
    
    if (pastedText.length !== 0) {

      // Get selection range to allow overwriting the field
      const selectionStart = this.input.selectionStart;
      const selectionEnd = this.input.selectionEnd;
      const currentValue = this.props.value;
      let prepend = '';
      let append = '';
    
      if ((currentValue.charAt(selectionStart - 1) !== ' ') && (currentValue.charAt(selectionStart - 1).length > 0)) {
        prepend = ' ';
      }
    
      if ((currentValue.charAt(selectionEnd + 1) !== ' ') && (currentValue.charAt(selectionEnd + 1).length > 0)) {
        if (currentValue.charAt(selectionEnd + 1) === '#') {
          append = ' ';
        }
        else {
          append = ' #';
        }
      }
      const modifiedText = pastedText.split(/\s+/).map(word => (!word.startsWith('#') ? '#' + word : word)).join(' ');
      const newValue = currentValue.slice(0, selectionStart) + prepend + modifiedText + append + currentValue.slice(selectionEnd);
      this.props.onChange({ target: { value: newValue } });
      const newCursorPosition = selectionStart + modifiedText.length + prepend.length + append.length;
      setTimeout(() => {
        this.input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 1);
    }
    e.preventDefault();
  };

  renderSuggestion = (suggestion, i) => {
    const { selectedSuggestion } = this.state;
    let inner, key;
    inner = <AutosuggestHashtag tag={suggestion} />;
    key   = suggestion.name;

    return (
      <div role='button' tabIndex={0} key={key} data-index={i} className={classNames('autosuggest-textarea__suggestions__item', { selected: i === selectedSuggestion })} onMouseDown={this.onSuggestionClick}>
        {inner}
      </div>
    );
  };

  render () {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, lang, children } = this.props;
    const { suggestionsHidden } = this.state;

    return [
      <div className='compose-form__autosuggest-wrapper compose-form__autosuggest-wrapper-hashtags' key='autosuggest-wrapper'>
        <div className='autosuggest-textarea'>
          <label>
            <span style={{ display: 'none' }}>{placeholder}</span>

            <input
              ref={this.setInput}
              className='autosuggest-textarea__hashtagarea'
              disabled={disabled}
              placeholder={placeholder}
              autoFocus={autoFocus}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              dir='auto'
              aria-autocomplete='list'
              lang={lang}
            />
          </label>
        </div>
        {children}
      </div>,

      <div className='autosuggest-textarea__suggestions-wrapper' key='suggestions-wrapper'>
        <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
          {suggestions.map(this.renderSuggestion)}
        </div>
      </div>,
    ];
  }

}
