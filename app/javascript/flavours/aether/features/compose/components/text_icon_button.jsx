import PropTypes from 'prop-types';
import { PureComponent } from 'react';

const iconStyle = {
  height: null,
  lineHeight: '1.8rem',
  minWidth: `${18 * 1.5}px`,
};

export default class TextIconButton extends PureComponent {

  static propTypes = {
    label: PropTypes.string.isRequired,
    title: PropTypes.string,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    ariaControls: PropTypes.string,
  };

  render () {
    const { label, title, active, ariaControls } = this.props;

    return (
      <button
        title={title}
        aria-label={title}
        className={`text-icon-button ${active ? 'active' : ''}`}
        aria-expanded={active}
        onClick={this.props.onClick}
        aria-controls={ariaControls}
        style={iconStyle}
      >
        {label}
      </button>
    );
  }

}
