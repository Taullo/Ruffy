import PropTypes from 'prop-types';

import ImmutablePureComponent from 'react-immutable-pure-component';

import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';

export default class ColumnLoading extends ImmutablePureComponent {

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    icon: PropTypes.string,
    multiColumn: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    icon: '',
  };

  render() {
    let { title, icon, multiColumn } = this.props;

    return (
      <Column>
        <ColumnHeader icon={icon} title={title} multiColumn={multiColumn} focusable={false} placeholder />
        <div className='scrollable' />
      </Column>
    );
  }

}
