import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { pinAccount, unpinAccount } from 'flavours/aether/actions/accounts';
import Account from 'flavours/aether/features/list_editor/components/account';
import { makeGetAccount } from 'flavours/aether/selectors';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId, added }) => ({
    account: getAccount(state, accountId),
    added: typeof added === 'undefined' ? state.getIn(['pinnedAccountsEditor', 'accounts', 'items']).includes(accountId) : added,
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { accountId }) => ({
  onRemove: () => dispatch(unpinAccount(accountId)),
  onAdd: () => dispatch(pinAccount(accountId)),
});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Account));
