//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';


import { connect } from 'react-redux';

import { changeListEditorTitle, submitListEditor } from 'flavours/aether/actions/lists';
import Button from 'flavours/aether/components/button';

const messages = defineMessages({
  label: { id: 'lists.new.title_placeholder', defaultMessage: 'New list title' },
  title: { id: 'lists.new.create', defaultMessage: 'Add list' },
  cancel: { id: 'confirmation_modal.cancel', defaultMessage: 'Cancel' },
});

const mapStateToProps = state => ({
  value: state.getIn(['listEditor', 'title']),
  disabled: state.getIn(['listEditor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
  onChange: value => dispatch(changeListEditorTitle(value)),
  onSubmit: () => dispatch(submitListEditor(true)),
});

const dispatch = ({
  onClose () {
    dispatch({
      modalType: undefined,
      ignoreFocus: false,
    });
  },
});

class ListsModal extends PureComponent {

  navigateTo = (index) =>
    this.setState({ currentIndex: +index });

  static propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
  };

  handleClick = () => {
    this.props.onSubmit();
    this.props.onClose();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  render () {
    const { value, disabled, intl } = this.props;

    const label = intl.formatMessage(messages.label);
    const title = intl.formatMessage(messages.title);
    const cancel = intl.formatMessage(messages.cancel);

    return (
    
      <div className='aether modal-root__modal lists-modal'>
      <form className='new_list' onSubmit={this.handleSubmit}>
        <label>
          <span style={{ display: 'none' }}>{label}</span>

          <input
            className='setting-text'
            value={value}
            disabled={disabled}
            onChange={this.handleChange}
            placeholder={label}
          />
        </label>

        <div className='new_list_cancel'>
          <Button
            onClick={this.handleCancel}
            className='confirmation-modal__cancel-button'
            text={cancel}
          />
        </div>

        <div className='new_list_button'>
          <Button
            disabled={disabled || !value}
            text={title}
            onClick={this.handleClick}
          />
        </div>
      </form>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ListsModal));
