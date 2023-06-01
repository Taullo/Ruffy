import React from 'react';
import PropTypes from 'prop-types';
import ColumnHeader from '../../../components/column_header';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  media: { id: 'account.media', defaultMessage: 'Media' },
});

class MediaColumnHeader extends React.PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    multiColumn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { onClick, intl, multiColumn } = this.props;

    return (
      <ColumnHeader
        icon='picture-o'
        title={intl.formatMessage(messages.media)}
        onClick={onClick}
        showBackButton
        multiColumn={multiColumn}
      />
    );
  }

}

export default injectIntl(MediaColumnHeader);
