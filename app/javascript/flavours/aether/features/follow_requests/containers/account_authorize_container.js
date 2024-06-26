import { connect } from 'react-redux';

import { authorizeFollowRequest, rejectFollowRequest } from 'flavours/aether/actions/accounts';
import { makeGetAccount } from 'flavours/aether/selectors';

import AccountAuthorize from '../components/account_authorize';

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, props) => ({
    account: getAccount(state, props.id),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { id }) => ({
  onAuthorize () {
    dispatch(authorizeFollowRequest(id));
  },

  onReject () {
    dispatch(rejectFollowRequest(id));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(AccountAuthorize);
