import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { makeGetAccount, getAccountHidden } from 'flavours/aether/selectors';

import RightColumn from '../components/right_column';

const getAccount = makeGetAccount();

const mapStateToProps = (state, { accountId }) => ({
  account: getAccount(state, accountId),
  domain: state.getIn(['meta', 'domain']),
  hidden: getAccountHidden(state, accountId),
});

export default injectIntl(connect(mapStateToProps)(RightColumn));
