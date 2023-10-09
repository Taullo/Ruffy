import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import Suggestions from 'flavours/aether/features/firehose/components/suggestions';


const messages = defineMessages({
  title: { id: 'explore.suggestions', defaultMessage: 'Account Suggestions' },
  more: { id: 'status.more', defaultMessage: 'More' },
});

const mapStateToProps = state => ({
  layout: state.getIn(['meta', 'layout']),
});

class AccountSuggestions extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  render() {
    const { intl, multiColumn } = this.props;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <div className='column_explore'>
          <ColumnHeader
            icon='globe'
            title={intl.formatMessage(messages.title)}
            onClick={this.handleHeaderClick}
            multiColumn={multiColumn}
          />

          <div className='scrollable scrollable--flex community-scroll'>

            <Suggestions />

            <Helmet>
              <title>{intl.formatMessage(messages.title)}</title>
              <meta name='robots' content='all' />
            </Helmet>
          </div>
        </div>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(AccountSuggestions));
