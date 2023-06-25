import { connect } from 'react-redux';
import { makeGetAccount, getAccountHidden } from 'flavours/aether/selectors';
import RightColumn from '../components/right_column';
import { injectIntl } from 'react-intl';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    domain: state.getIn(['meta', 'domain']),
    hidden: getAccountHidden(state, accountId),
  });

  return mapStateToProps;
};

export default injectIntl(connect(makeMapStateToProps)(RightColumn));
